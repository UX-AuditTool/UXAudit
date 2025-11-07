# IT Request: Azure App Service for UX Audit Backend

## Request Summary
Please create an Azure App Service (Web App) to host the backend API for the UX Audit Tool application.

## Requestor
- **Name:** Jade Davila
- **Email:** jade_davila.azure@unosquare.com
- **Azure Account:** jade_davila.azure@unosquare.com

## Required Resources

### Option 1: Grant Permissions (Preferred)
Grant the following permissions to jade_davila.azure@unosquare.com:
- **Role:** "Contributor" or "Web Plan Contributor"
- **Scope:** Resource Group "Unosquare-Labs"
- **Why:** Allows self-service creation and management of App Service

### Option 2: Create Resources (Alternative)
If granting permissions is not possible, please create the following resources:

#### 1. App Service Plan
```
Name: uxaudit-backend-plan
Resource Group: Unosquare-Labs (existing)
Location: Central US
Operating System: Linux
Pricing Tier: F1 (Free) - sufficient for small user base
```

#### 2. Web App (App Service)
```
Name: uxaudit-backend
Resource Group: Unosquare-Labs (existing)
Runtime Stack: Node.js 20 LTS
Operating System: Linux
App Service Plan: uxaudit-backend-plan (created above)
Region: Central US
Publish: Code
```

#### 3. Application Settings (Environment Variables)
**SECURITY: These contain sensitive credentials - please configure as Application Settings in the App Service:**

```
DATABASE_URL=postgresql://uxadmin@uxdbpoc.postgres.database.azure.com:5432/postgres?sslmode=require
DB_PASSWORD=xJSIs^Y#r@M6L1
PORT=8080
NODE_ENV=production
```

**Note:** Application Settings are encrypted at rest in Azure and not visible in source code.

#### 4. Deployment Configuration
**Startup Command:**
```
node server/index.ts
```

**Build Command:**
```
npm install && npx prisma generate
```

## Technical Context

### Current Architecture
- **Frontend:** Already deployed on Azure Static Web Apps
  - URL: https://agreeable-sky-0a38c6210.3.azurestaticapps.net
  - GitHub: https://github.com/UX-AuditTool/UXAudit
  - Auto-deploys on push to main branch

- **Database:** Azure PostgreSQL Flexible Server
  - Server: uxdbpoc.postgres.database.azure.com
  - Already configured and migrated

- **Backend:** Needs to be deployed (this request)
  - Express.js API server with Prisma ORM
  - Connects frontend to PostgreSQL database

### Why We Need This
The backend provides REST API endpoints for:
- Project management (CRUD operations)
- Flow audits (CRUD operations)
- Heuristic violation tracking
- Database connectivity with Prisma ORM

### Security Features
- HTTPS only (provided by Azure App Service)
- CORS configured to only accept requests from frontend domain
- Database credentials stored as encrypted Application Settings
- PostgreSQL connection uses SSL/TLS (sslmode=require)

## Expected Cost
**$0/month** - Using F1 Free Tier
- Sufficient for small user base (< 100 users)
- Can upgrade to paid tier if needed in future

## Timeline
- **Priority:** Medium
- **Needed by:** As soon as possible
- **Reason:** Frontend is deployed but cannot function without backend API

## Access Needed After Creation
If you create the resources (Option 2), please grant jade_davila.azure@unosquare.com:
- "Contributor" role on the created App Service
- This allows deployment of code updates via GitHub Actions or Azure CLI

## Questions?
Contact: jade_davila.azure@unosquare.com

## Additional Information
- GitHub Repository: https://github.com/UX-AuditTool/UXAudit
- Frontend URL: https://agreeable-sky-0a38c6210.3.azurestaticapps.net
- Backend will be: https://uxaudit-backend.azurewebsites.net (after creation)

---

**Thank you for your assistance!**
