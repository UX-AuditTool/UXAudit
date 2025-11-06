import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Get Azure AD access token for PostgreSQL using Azure CLI
 * Token expires after 1 hour, so this should be called periodically
 */
export async function getAzureADToken(): Promise<string> {
  try {
    const { stdout } = await execAsync(
      'az account get-access-token --resource https://ossrdbms-aad.database.windows.net --query accessToken --output tsv'
    );

    const token = stdout.trim();

    if (!token) {
      throw new Error('Failed to get Azure AD token - empty response');
    }

    return token;
  } catch (error) {
    console.error('Failed to get Azure AD token:', error);
    throw new Error(
      'Failed to authenticate with Azure AD. Make sure you are logged in with "az login" and have access to the database.'
    );
  }
}

/**
 * Build database URL with Azure AD token
 */
export async function getAzureDatabaseUrl(): Promise<string> {
  const token = await getAzureADToken();
  const baseUrl = process.env.DATABASE_URL || '';

  if (!baseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Replace password placeholder with actual token
  // Format: postgresql://username:TOKEN@host:port/database?params
  const url = new URL(baseUrl);
  url.password = token;

  return url.toString();
}
