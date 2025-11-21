/**
 * Express Backend Server for UX Audit Tool
 * Connects to Azure PostgreSQL using Prisma
 */

// Only load dotenv in development - Azure provides env vars in production
if (process.env.NODE_ENV !== 'production') {
  await import('dotenv/config');
}

import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Prisma client
let prisma: InstanceType<typeof PrismaClient>;

async function initializePrisma() {
  try {
    const baseUrl = process.env.DATABASE_URL;
    const dbPassword = process.env.DB_PASSWORD;

    if (!baseUrl) {
      throw new Error('DATABASE_URL not set');
    }

    if (!dbPassword) {
      throw new Error('DB_PASSWORD not set in environment');
    }

    // Build connection URL with password from environment variable
    const url = new URL(baseUrl);
    url.password = dbPassword;

    // Create Prisma client
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: url.toString(),
        },
      },
      log: ['query', 'error', 'warn'],
    });

    await prisma.$connect();
    console.log('✅ Connected to Azure PostgreSQL');

    // Refresh token every 50 minutes (tokens expire after 60 minutes)
    setInterval(async () => {
      console.log('🔄 Refreshing Azure AD token...');
      await prisma.$disconnect();
      await initializePrisma();
    }, 50 * 60 * 1000);

  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    throw error;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'UX Audit API is running' });
});

// ============================================================================
// PROJECTS API
// ============================================================================

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, clientName, auditGoal, devices, hipaaRequired } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        clientName,
        auditGoal: auditGoal || null,
        devices: devices || [],
        hipaaRequired: hipaaRequired || false,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
app.patch('/api/projects/:id', async (req, res) => {
  try {
    const updates = req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: updates,
    });

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Publish project (generate share token)
app.post('/api/projects/:id/publish', async (req, res) => {
  try {
    // Generate a random share token (12 chars alphanumeric)
    const shareToken = Array.from(crypto.getRandomValues(new Uint8Array(9)))
      .map(b => b.toString(36).padStart(2, '0'))
      .join('')
      .slice(0, 12);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        isPublished: true,
        shareToken,
        publishedAt: new Date(),
      },
    });

    res.json(project);
  } catch (error) {
    console.error('Error publishing project:', error);
    res.status(500).json({ error: 'Failed to publish project' });
  }
});

// Unpublish project
app.post('/api/projects/:id/unpublish', async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        isPublished: false,
        shareToken: null,
        publishedAt: null,
      },
    });

    res.json(project);
  } catch (error) {
    console.error('Error unpublishing project:', error);
    res.status(500).json({ error: 'Failed to unpublish project' });
  }
});

// ============================================================================
// PUBLIC VIEW API (no auth required)
// ============================================================================

// Get public project by share token
app.get('/api/public/:shareToken', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { shareToken: req.params.shareToken },
      include: {
        flows: {
          orderBy: { order: 'asc' },
          include: {
            flowAudit: true,
          },
        },
      },
    });

    if (!project || !project.isPublished) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching public project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ============================================================================
// FLOWS API
// ============================================================================

// Get flows for a project
app.get('/api/projects/:projectId/flows', async (req, res) => {
  try {
    const flows = await prisma.flow.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { order: 'asc' },
    });

    res.json(flows);
  } catch (error) {
    console.error('Error fetching flows:', error);
    res.status(500).json({ error: 'Failed to fetch flows' });
  }
});

// Get single flow
app.get('/api/flows/:id', async (req, res) => {
  try {
    const flow = await prisma.flow.findUnique({
      where: { id: req.params.id },
    });

    if (!flow) {
      return res.status(404).json({ error: 'Flow not found' });
    }

    res.json(flow);
  } catch (error) {
    console.error('Error fetching flow:', error);
    res.status(500).json({ error: 'Failed to fetch flow' });
  }
});

// Create flow
app.post('/api/flows', async (req, res) => {
  try {
    const { projectId, name, urls } = req.body;

    // Get max order for this project
    const maxOrderFlow = await prisma.flow.findFirst({
      where: { projectId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const maxOrder = maxOrderFlow?.order ?? -1;

    const flow = await prisma.flow.create({
      data: {
        projectId,
        name,
        urls: urls || [],
        order: maxOrder + 1,
      },
    });

    res.status(201).json(flow);
  } catch (error) {
    console.error('Error creating flow:', error);
    res.status(500).json({ error: 'Failed to create flow' });
  }
});

// Update flow
app.patch('/api/flows/:id', async (req, res) => {
  try {
    const updates = req.body;

    const flow = await prisma.flow.update({
      where: { id: req.params.id },
      data: updates,
    });

    res.json(flow);
  } catch (error) {
    console.error('Error updating flow:', error);
    res.status(500).json({ error: 'Failed to update flow' });
  }
});

// Delete flow
app.delete('/api/flows/:id', async (req, res) => {
  try {
    await prisma.flow.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting flow:', error);
    res.status(500).json({ error: 'Failed to delete flow' });
  }
});

// ============================================================================
// FLOW AUDITS API
// ============================================================================

// Get flow audit
app.get('/api/flows/:flowId/audit', async (req, res) => {
  try {
    let audit = await prisma.flowAudit.findUnique({
      where: { flowId: req.params.flowId },
    });

    // Create audit if it doesn't exist
    if (!audit) {
      audit = await prisma.flowAudit.create({
        data: {
          flowId: req.params.flowId,
          heuristicViolations: [],
        },
      });
    }

    res.json(audit);
  } catch (error) {
    console.error('Error fetching flow audit:', error);
    res.status(500).json({ error: 'Failed to fetch flow audit' });
  }
});

// Update flow audit
app.patch('/api/flows/:flowId/audit', async (req, res) => {
  try {
    const updates = req.body;

    const audit = await prisma.flowAudit.upsert({
      where: { flowId: req.params.flowId },
      update: updates,
      create: {
        flowId: req.params.flowId,
        heuristicViolations: [],
        ...updates,
      },
    });

    res.json(audit);
  } catch (error) {
    console.error('Error updating flow audit:', error);
    res.status(500).json({ error: 'Failed to update flow audit' });
  }
});

// ============================================================================
// AI PROXY API
// ============================================================================

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

const geminiApiKey = process.env.GEMINI_API_KEY;
if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
  console.log('✅ Gemini AI initialized');
} else {
  console.warn('⚠️  GEMINI_API_KEY not set - AI features will be disabled');
}

// Proxy endpoint for text enhancement
app.post('/api/ai/enhance', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(503).json({
        error: 'AI service not configured. Please contact administrator.'
      });
    }

    const { text, context } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build context-aware prompt
    let prompt = '';

    if (context?.type === 'heuristic' && context.heuristic) {
      prompt = `You are a UX audit assistant helping to improve documentation. The designer wrote the following note about a usability issue related to "${context.heuristic}":

"${text}"

Rewrite this note to be more clear, professional, and concise. Only use the information provided - do not add new observations or make assumptions. If the note is too brief, make it slightly more descriptive while staying true to what was written.

Enhanced note:`;
    } else if (context?.type === 'wcag') {
      prompt = `You are a UX audit assistant helping to improve documentation. The designer wrote the following note about accessibility:

"${text}"

Rewrite this note to be more clear, professional, and concise. Only use the information provided - do not add new observations or make assumptions.

Enhanced note:`;
    } else if (context?.type === 'brand') {
      prompt = `You are a UX audit assistant helping to improve documentation. The designer wrote the following note about brand guidelines:

"${text}"

Rewrite this note to be more clear, professional, and concise. Only use the information provided - do not add new observations or make assumptions.

Enhanced note:`;
    } else {
      // General enhancement
      prompt = `You are a UX audit assistant helping to improve documentation. The designer wrote:

"${text}"

Rewrite this to be more clear, professional, and concise. Only use the information provided - do not add new observations or make assumptions.

Enhanced note:`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhancedText = response.text().trim();

    // Clean up response - remove common prefixes the model might include
    enhancedText = enhancedText
      .replace(/^Enhanced note:\s*/i, '')
      .replace(/^"(.+)"$/, '$1')  // Remove surrounding quotes
      .trim();

    res.json({ enhancedText });
  } catch (error: any) {
    console.error('Gemini API error:', error?.message || error);
    console.error('Error status:', error?.status);
    console.error('Error details:', JSON.stringify(error?.errorDetails || error, null, 2));

    // Return the actual error message for debugging
    const errorMessage = error?.message || 'Failed to enhance text. Please try again.';
    res.status(500).json({ error: errorMessage });
  }
});

// Proxy endpoint for project summary generation
app.post('/api/ai/summarize', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(503).json({
        error: 'AI service not configured. Please contact administrator.'
      });
    }

    const { projectName, flowCount, averageScore, flowSummaries } = req.body;

    if (!projectName || !flowSummaries || !Array.isArray(flowSummaries)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build summary of all flows and their notes
    const flowSummariesText = flowSummaries
      .map((flow: any) => {
        const notesText = flow.notes.filter((n: string) => n.trim()).join('\n- ');
        return `**${flow.flowName}** (Score: ${flow.score}/5)\n${notesText ? `- ${notesText}` : '(No detailed notes)'}`;
      })
      .join('\n\n');

    const prompt = `You are a UX audit assistant creating an executive summary for a project audit.

Project: ${projectName}
Total Flows Audited: ${flowCount}
Average Score: ${averageScore.toFixed(1)}/5

Flow-by-Flow Findings:
${flowSummariesText}

Based on the audit findings above, create a concise executive summary (3-4 paragraphs) that:
1. Opens with the overall project health and average score
2. Highlights the most critical issues found across all flows
3. Identifies common patterns or themes in the usability problems
4. Provides 2-3 high-priority recommendations for improvement

Keep it professional, actionable, and focused on business impact. Use bullet points sparingly for clarity.

Executive Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    res.json({ summary });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate summary. Please try again.' });
  }
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    // Initialize database connection
    await initializePrisma();

    // Start Express server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
