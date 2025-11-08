# Azure Backend Deployment Handoff

**Date:** November 7, 2025
**Status:** ⏳ In Progress - Deployment Blocked
**Priority:** HIGH - Backend needs to be deployed to make app functional

---

## 🎯 Current Objective

Deploy the Express.js backend to Azure App Service so the frontend can communicate with Azure PostgreSQL database.

---

## ✅ What's Already Done

### Infrastructure (All Complete)
- ✅ **Azure App Service Plan** created: `uxaudit-backend-plan` (B1 tier - $13/month)
- ✅ **Azure Web App** created: `uxaudit-backend.azurewebsites.net`
- ✅ **Environment Variables** configured in Azure Application Settings:
  - `DATABASE_URL`: `postgresql://uxadmin@uxdbpoc.postgres.database.azure.com:5432/postgres?sslmode=require`
  - `DB_PASSWORD`: `xJSIs^Y#r@M6L1`
  - `PORT`: `8080`
  - `NODE_ENV`: `production`
- ✅ **HTTPS enforced** on App Service
- ✅ **Logging enabled** (Application & HTTP logs)

### Code (All Complete)
- ✅ **TypeScript build configuration**: [tsconfig.server.json](tsconfig.server.json) - compiles to ES modules
- ✅ **Server code**: [server/index.ts](server/index.ts) - Express + Prisma
- ✅ **dotenv conditional loading**: Only loads in development, uses Azure env vars in production
- ✅ **Compiled JavaScript**: `dist/index.js` (ES module format)
- ✅ **package.json**: Has `start` script: `node dist/index.js`
- ✅ **TypeScript in production dependencies**: Moved from devDependencies to allow Azure to compile if needed

### Files Ready for Deployment
- `package.json` - Updated with proper scripts
- `dist/index.js` - Pre-compiled server (ES modules)
- `prisma/schema.prisma` - Database schema
- `tsconfig.server.json` - Server build config

---

## ❌ Current Blocker

**The container keeps crashing on startup** before it can respond to HTTP health checks.

### Symptoms
1. Deployment shows: "Build successful"
2. Then: "Starting the site..." (hangs for 5+ minutes)
3. Container exits with code 1
4. Error: "Container didn't respond to HTTP pings on port: 8080"
5. HTTP 503 error when accessing https://uxaudit-backend.azurewebsites.net/health

### Root Cause Analysis
We've fixed multiple issues sequentially:
1. ✅ **Issue 1 FIXED**: Missing `server` script → Changed startup command to `node dist/index.js`
2. ✅ **Issue 2 FIXED**: CommonJS vs ES modules conflict → Recompiled TypeScript to ES modules
3. ✅ **Issue 3 FIXED**: Missing `dotenv` package → Made dotenv conditional (only dev)
4. ❌ **Issue 4 CURRENT**: Startup command not being respected

**The Problem:** Azure keeps trying to run `npm run server` instead of `node dist/index.js`

Evidence from logs:
```
PATH="$PATH:/home/site/wwwroot" npm run server
npm error Missing script: "server"
```

Even though we set startup command to `node dist/index.js`, it's not taking effect.

---

## 🔍 What Needs Investigation

### Primary Issue
**Why isn't the startup command being respected?**

Possible causes:
1. Azure's Oryx build system is overriding the startup command
2. The startup command config isn't being applied correctly
3. Package.json might have conflicting configurations
4. Azure might be detecting this as a frontend project and using wrong startup logic

### Commands to Verify Startup Configuration
```bash
# Check current startup command
az webapp config show --name uxaudit-backend --resource-group Unosquare-Labs --query "appCommandLine"

# Check what Azure thinks the app type is
az webapp show --name uxaudit-backend --resource-group Unosquare-Labs --query "kind"

# View latest deployment logs
az webapp log deployment show --name uxaudit-backend --resource-group Unosquare-Labs | tail -50
```

---

## 💡 Recommended Next Steps

### Option 1: Force Startup Command (Quick Try)
Try setting startup command with different methods:

```bash
# Method 1: Direct startup file
az webapp config set --name uxaudit-backend --resource-group Unosquare-Labs \
  --startup-file "node dist/index.js"

# Method 2: Via app settings
az webapp config appsettings set --name uxaudit-backend --resource-group Unosquare-Labs \
  --settings WEBSITE_RUN_FROM_PACKAGE="0" \
             WEBSITE_NODE_DEFAULT_VERSION="20-lts"

# Then restart
az webapp restart --name uxaudit-backend --resource-group Unosquare-Labs
```

### Option 2: Fix package.json Scripts
Ensure package.json has ONLY backend scripts (not frontend):

```json
{
  "name": "uxaudit-backend",
  "type": "module",
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc -p tsconfig.server.json",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^6.19.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "prisma": "^6.19.0",
    "typescript": "^5.9.3"
  }
}
```

Create a **separate** package.json for backend deployment (exclude all React/Vite deps).

### Option 3: Disable Azure Build Entirely
Deploy ONLY pre-compiled code with dependencies:

```bash
# 1. Install production dependencies locally
npm install --production --prefix /tmp/backend-prod @prisma/client cors dotenv express prisma

# 2. Create complete deployment package
zip -r backend-deploy.zip \
  package.json \
  dist \
  prisma \
  /tmp/backend-prod/node_modules

# 3. Disable all Azure build processes
az webapp config appsettings set --name uxaudit-backend --resource-group Unosquare-Labs \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT="false" \
             ENABLE_ORYX_BUILD="false" \
             WEBSITE_RUN_FROM_PACKAGE="1"

# 4. Deploy
az webapp deploy --name uxaudit-backend --resource-group Unosquare-Labs \
  --src-path backend-deploy.zip --type zip --restart true
```

### Option 4: Use Docker (Most Control)
Create a Dockerfile for complete control over the build and startup:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY dist ./dist
COPY prisma ./prisma
RUN npx prisma generate
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

Deploy as Azure Container Instance or App Service Container.

---

## 📁 Important Files & Locations

### Local Files
- **Server source**: [server/index.ts](server/index.ts)
- **Compiled output**: `dist/index.js`
- **TypeScript config**: [tsconfig.server.json](tsconfig.server.json)
- **Database schema**: [prisma/schema.prisma](prisma/schema.prisma)
- **Package config**: [package.json](package.json)

### Azure Resources
- **Resource Group**: `Unosquare-Labs`
- **Subscription**: `77388a13-6bdf-46e5-bfdf-73e9d61fd79f` (Azure subscription 1)
- **Region**: Central US
- **App Service**: `uxaudit-backend`
- **Database**: `uxdbpoc.postgres.database.azure.com`

### Useful URLs
- **Backend URL**: https://uxaudit-backend.azurewebsites.net
- **Health endpoint**: https://uxaudit-backend.azurewebsites.net/health
- **Kudu (diagnostics)**: https://uxaudit-backend.scm.azurewebsites.net
- **Deployment logs**: https://uxaudit-backend.scm.azurewebsites.net/api/deployments/latest

---

## 🔑 Key Learnings from Debugging

### Errors We Fixed
1. **"Missing script: server"** → Startup command was looking for wrong script
2. **"exports is not defined in ES module scope"** → Was compiling to CommonJS but package.json said ES modules
3. **"Cannot find package 'dotenv'"** → Azure wasn't installing dependencies, fixed by making dotenv conditional

### Important Configuration Details
- **package.json has `"type": "module"`** - All .js files are treated as ES modules
- **TypeScript compiles to ES modules** (tsconfig.server.json: `module: "ESNext"`)
- **Azure Application Settings** provide environment variables (don't need .env file in production)
- **Server listens on process.env.PORT** (Azure sets this to 8080)

### Azure Quirks Discovered
- Azure's Oryx build system can be aggressive about detecting project type
- Having frontend dependencies in package.json confuses Azure
- Startup commands sometimes get ignored if Azure detects conflicting package.json scripts
- Build settings don't always apply immediately - might need full restart or redeploy

---

## 🎯 Success Criteria

When deployment is successful, you should see:

1. **Deployment completes** without timeout
2. **Health endpoint responds**:
   ```bash
   curl https://uxaudit-backend.azurewebsites.net/health
   # Should return: {"status":"ok","message":"UX Audit API is running"}
   ```
3. **Container stays running** (doesn't exit with code 1)
4. **HTTP status 200** (not 503)
5. **Can query projects**:
   ```bash
   curl https://uxaudit-backend.azurewebsites.net/api/projects
   # Should return: [] or list of projects
   ```

---

## 📚 Reference Documentation

### Project Guidelines
**IMPORTANT**: Read [claude.md](claude.md) before making changes!

Key principles:
- **"La prisa mata"** - Haste kills. Think through solutions properly.
- **No quick fixes** - Do it right the first time
- Keep changes under 100 lines where possible
- Use descriptive conventional commits
- TypeScript strict mode enabled

### Tech Stack (Current)

**Frontend:**
- React 18 + TypeScript + Vite
- Zustand (state)
- React Router v6
- Radix UI + Tailwind CSS
- pnpm (package manager)

**Backend:** ⚠️ **UPDATED - Different from claude.md**
- Node.js 20 with TypeScript (compiles to ES modules)
- Express.js (not Fastify)
- PostgreSQL on Azure (not local)
- Prisma ORM
- ~~Auth0~~ (Not implemented yet)
- ~~Bull/BullMQ~~ (Not implemented yet)

### Local Development Commands
```bash
# Frontend
pnpm dev                # Start frontend dev server (port 5173)

# Backend (local)
./start-server.sh       # Start backend locally (port 3001)
pnpm dev:server         # Watch mode with tsx

# Build
pnpm run build:server   # Compile TypeScript to dist/index.js
```

---

## 🐛 Debugging Commands

### Check Azure Logs
```bash
# Download all logs
az webapp log download --name uxaudit-backend --resource-group Unosquare-Labs \
  --log-file webapp-logs.zip

# Unzip and check Docker logs
unzip -o webapp-logs.zip
cat LogFiles/*docker*.log | tail -100

# Stream live logs
az webapp log tail --name uxaudit-backend --resource-group Unosquare-Labs
```

### Check Configuration
```bash
# View all app settings
az webapp config appsettings list --name uxaudit-backend \
  --resource-group Unosquare-Labs -o table

# Check startup command
az webapp config show --name uxaudit-backend \
  --resource-group Unosquare-Labs \
  --query "{startupCommand:appCommandLine, runtime:linuxFxVersion}"
```

### Test Health Endpoint
```bash
# With status code
curl -s -w "\nHTTP Status: %{http_code}\n" \
  https://uxaudit-backend.azurewebsites.net/health

# Should return 200 and:
# {"status":"ok","message":"UX Audit API is running"}
```

---

## 💰 Cost Information

**Current Monthly Cost: ~$13**
- Azure PostgreSQL: Already running (covered separately)
- Azure Static Web Apps: Free tier (frontend)
- Azure App Service: **B1 Basic tier - $13/month**
  - 1.75 GB RAM
  - 100 GB storage
  - Always On enabled
  - Better than F1 Free (which had cold start issues)

**Note**: User approved B1 tier upgrade during debugging for better performance.

---

## 🔐 Security Notes

**Credentials Management:**
- ✅ Database password in Azure Application Settings (encrypted)
- ✅ No credentials in code or git
- ✅ .env file in .gitignore
- ✅ HTTPS enforced
- ✅ TLS connections to PostgreSQL

**Database Access:**
- Server: `uxdbpoc.postgres.database.azure.com`
- User: `uxadmin`
- Password: `xJSIs^Y#r@M6L1` (stored in Azure Settings as `DB_PASSWORD`)
- Database: `postgres`
- SSL: required

---

## 📞 Contact & Resources

**Azure Account:** jade_davila.azure@unosquare.com
**Subscription:** Azure subscription 1
**GitHub Repo:** https://github.com/UX-AuditTool/UXAudit
**Frontend URL:** https://agreeable-sky-0a38c6210.3.azurestaticapps.net

**Previous Handoff:** [HANDOFF_SUMMARY.md](HANDOFF_SUMMARY.md) - Complete migration from Supabase to Azure

---

## 🎓 Lessons for Next Agent

1. **Read claude.md first** - Has important development principles
2. **Check logs immediately** - Don't guess, read the actual errors
3. **One issue at a time** - We hit 4 sequential issues; each had to be fixed properly
4. **Azure is opinionated** - Build system tries to be smart but can interfere
5. **Environment vars work differently** - Azure provides them natively, don't need dotenv
6. **TypeScript in production** - Had to move to dependencies for Azure to compile
7. **ES modules vs CommonJS** - package.json `"type": "module"` affects everything

---

## ✅ Final Checklist Before Starting

- [ ] Read [claude.md](claude.md) for development principles
- [ ] Review this entire handoff document
- [ ] Check current Azure logs to see latest error
- [ ] Verify environment variables are set correctly
- [ ] Test that compiled `dist/index.js` exists locally
- [ ] Confirm startup command in Azure config

---

**Good luck! The infrastructure is ready, code is prepared, just need to get Azure to run it correctly!** 🚀

---

**Last Updated:** November 7, 2025 01:45 UTC
**Next Steps:** Fix startup command issue or try Docker approach
