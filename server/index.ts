/**
 * Express Backend Server for UX Audit Tool
 * Connects to Azure PostgreSQL using Prisma
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Prisma client
let prisma: PrismaClient;

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
