# Turso Database Setup for Comments

This guide will help you set up a Turso database for the blog commenting system.

## Step 1: Install Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

## Step 2: Sign up / Login to Turso

```bash
turso auth signup  # If you don't have an account
# or
turso auth login   # If you already have an account
```

## Step 3: Create a Database

```bash
turso db create nick-blog-comments
```

## Step 4: Get Database Credentials

Get your database URL:

```bash
turso db show nick-blog-comments --url
```

Create an auth token:

```bash
turso db tokens create nick-blog-comments
```

## Step 5: Add Credentials to .env

Add these to your `.env` file (I'll do this part):

```
ASTRO_DB_REMOTE_URL=<your-database-url-from-step-4>
ASTRO_DB_APP_TOKEN=<your-auth-token-from-step-4>
```

## Step 6: Create the Comment Table

The existing `nick-blog-comments` database already has the `Comment` table (Astro DB created it, and `@respectify/astro` 1.0 uses it as it is), so skip this step for it.

For a brand-new database only, create the table from the SQL that ships with `@respectify/astro`:

```bash
turso db shell nick-blog-comments < node_modules/@respectify/astro/migrations/sqlite/0000_respectify_comment.sql
```

## For Local Development

Local work (`npm run dev`, a local build or preview) never uses Turso, even with the credentials in `.env`: it uses `.data/comments.db`, which is git-ignored. Create it once (to start over, delete `.data/comments.db` and run it again):

```bash
npm run db:local
```

Only Vercel production and preview deployments (where Vercel sets `VERCEL_ENV`) connect to Turso. See `src/lib/comments/comments-database-config.ts`.

## Vercel Deployment

When deploying to Vercel, add these environment variables in your Vercel project settings:

- `ASTRO_DB_REMOTE_URL`
- `ASTRO_DB_APP_TOKEN`

Both are required there: a deployment without them fails with an error naming the missing variable, rather than falling back to a local file.
