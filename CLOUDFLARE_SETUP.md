# Cloudflare Pages Deployment — UNDIMENSION

This is the **alternative** deployment option. The primary deployment is Vercel.
Use Cloudflare Pages if you want a global edge network (300+ locations), generous
free tier (500 builds/month, unlimited bandwidth), and Cloudflare's WAF + DDoS
protection.

---

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is fine)
- The repo pushed to GitHub
- Supabase project already set up (same env vars as Vercel)

---

## Step 1 — Install Wrangler CLI

```bash
npm install -g wrangler
```

Verify it works:

```bash
wrangler --version
```

---

## Step 2 — Login to Cloudflare

```bash
wrangler login
```

This opens a browser window to authenticate. After success, you'll see
`Successfully logged in.` in your terminal.

---

## Step 3 — Create the Pages project

```bash
wrangler pages project create undimension
```

- **Production branch**: `main`
- This creates an empty project on Cloudflare. The first deploy will happen
  via GitHub Actions (or you can do a manual deploy with
  `wrangler pages deploy .next --project-name=undimension` after running
  `npm run build`).

---

## Step 4 — Get your API credentials

You need two values for the GitHub Action secrets:

### 4a. Account ID

- Open [Cloudflare dashboard](https://dash.cloudflare.com)
- The URL contains your account ID: `dash.cloudflare.com/<ACCOUNT_ID>`
- Or: Account Home → copy **Account ID** from the right sidebar

### 4b. API Token

- Go to **My Profile → API Tokens → Create Token**
- Use the **"Edit Cloudflare Workers"** template, OR create a custom token with:
  - `Cloudflare Pages: Edit`
  - `Account: Read`
- Click **Continue to summary → Create Token**
- Copy the token value (you won't see it again)

---

## Step 5 — Add GitHub secrets

In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**

Add these 2 secrets:

| Secret name              | Value                       |
|--------------------------|-----------------------------|
| `CLOUDFLARE_API_TOKEN`   | The API token from step 4b  |
| `CLOUDFLARE_ACCOUNT_ID`  | The Account ID from step 4a |

You also need the Supabase env vars (same as Vercel):

| Secret name                                | Value                                   |
|--------------------------------------------|-----------------------------------------|
| `DATABASE_URL`                             | Supabase PostgreSQL connection string   |
| `NEXT_PUBLIC_SUPABASE_URL`                 | `https://xxxxxxxx.supabase.co`          |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`     | `sb_publishable_xxx...`                 |
| `SUPABASE_SERVICE_KEY`                     | `eyJhbGciOiJI...` (service_role key)    |

---

## Step 6 — Set environment variables in Cloudflare dashboard

In Cloudflare Pages → your project → **Settings → Environment variables**:

Add the same 4 Supabase vars (production environment):

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_KEY`

---

## Step 7 — Push to main

The GitHub Action (`.github/workflows/deploy-cloudflare.yml`) auto-triggers
on every push to `main`. You can also trigger it manually from the Actions tab
(**Deploy to Cloudflare Pages → Run workflow**).

---

## Verifying the deployment

1. Open Cloudflare Pages → your project → **Deployments**
2. The latest deployment should show **Success** within ~2-3 minutes
3. Click the deployment URL (e.g. `https://undimension.pages.dev`)
4. The site should load fully functional

---

## Custom domain

To use a custom domain (e.g. `undimension.com`):

1. Cloudflare Pages → your project → **Custom domains → Set up a domain**
2. Follow the instructions (CNAME record is auto-added if the domain is on
   Cloudflare; otherwise add the CNAME manually at your registrar)

---

## Notes / caveats

- **API routes run as Cloudflare Workers** (Edge runtime). Some Node.js-only
  APIs (e.g. `fs`, `Buffer` in certain forms) may need polyfills. The
  `@cloudflare/next-on-pages` adapter handles most cases automatically.
- **Cold starts are minimal** (Edge runtime, ~50ms globally).
- **Build minutes**: free tier gives 500 builds/month. Each `git push` to main
  triggers a build. Branch pushes don't (only `main`).
- **Bandwidth**: unlimited on free tier.
- **Parallel deploys**: This workflow runs in parallel with the Vercel deploy
  workflow. If you want to use ONLY Cloudflare, disable the Vercel workflow
  (rename it to `deploy-vercel.yml.disabled` or delete the file).

---

## Quick reference — Manual deploy (without GitHub Action)

If you want to deploy locally without GitHub Actions:

```bash
# 1. Build the Next.js app
npm run build

# 2. Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=undimension
```

This is useful for testing before pushing to main.
