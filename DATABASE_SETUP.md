# Database Setup Instructions

This application uses Supabase (PostgreSQL) for data persistence.

## Step 1: Run the Database Migration

You need to create the database tables in your Supabase project.

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your "UX Audit" project
3. Click on **SQL Editor** in the left sidebar
4. Click **+ New Query**
5. Copy the contents of `/supabase/migrations/001_initial_schema.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

You should see a success message. Your database tables are now created!

## Step 2: Verify the Setup

After running the migration:

1. Click on **Table Editor** in the left sidebar
2. You should see three tables:
   - `projects`
   - `flows`
   - `flow_audits`

## What the Migration Creates

The migration creates:

- **Tables**: projects, flows, flow_audits with all necessary columns
- **Indexes**: For better query performance
- **Triggers**: Auto-update `updated_at` timestamps
- **Row Level Security (RLS)**: Enabled with open policies (for now)
- **Relationships**: Foreign keys linking flows to projects and audits to flows

## Testing the Database

Once the migration is complete:

1. Open your app at http://localhost:5173
2. Create a new project
3. Add a flow to that project
4. Start auditing a flow

All data will now be saved to your Supabase database and persist between sessions!

## Future: Adding Authentication

Currently, the database has open policies (anyone can read/write). For production use:

1. Set up Supabase Auth
2. Update the RLS policies to check user authentication
3. Add user_id columns to link data to specific users

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure your `.env` file exists and contains valid credentials

**Error running migration:**
- Make sure you copied the entire SQL file
- Check for any syntax errors in the SQL editor
- Try running sections of the migration one at a time

**Data not persisting:**
- Check the browser console for errors
- Verify the tables were created in Table Editor
- Check that RLS policies are set correctly (should show "Enable all operations" policies)
