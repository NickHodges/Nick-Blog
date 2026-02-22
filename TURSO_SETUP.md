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

## Step 6: Push Schema to Remote Database

After you've added the credentials:

```bash
npx astro db push --remote
```

## For Local Development

The local database will continue to work automatically. The remote database is only needed for production builds and deployment.

## Vercel Deployment

When deploying to Vercel, add these environment variables in your Vercel project settings:
- `ASTRO_DB_REMOTE_URL`
- `ASTRO_DB_APP_TOKEN`
