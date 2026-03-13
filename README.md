# NaApiE — Need another API Explorer

A forkable, template REST API explorer built with **React 19 + TypeScript + Vite**. Authenticate with a Microsoft account via OAuth 2.0 PKCE and make live API calls — similar to [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer/).

> **This is a template repo.** Fork it, swap out the sample queries, point it at your API, and you're done.

---

## Features

- **Microsoft login** — sign in with any Entra ID (Azure AD) account; Bearer tokens auto-attached
- **HTTP method support** — GET · POST · PUT · PATCH · DELETE
- **Request editor** — editable headers (key/value) + JSON body editor (Monaco)
- **Response viewer** — syntax-highlighted JSON, HTTP status badge, response headers
- **Sample queries sidebar** — pre-built requests your team can customise in one file
- **Anonymous mode** — queries work without signing in (token is simply omitted)
- **Azure Static Web Apps** — ready-to-deploy with included GitHub Actions workflow

## Quick Start

### Prerequisites

- Node.js 18+
- An [Entra ID app registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) with a **Single-page application** redirect URI

### Setup

```bash
# 1. Clone / fork
git clone https://github.com/<your-org>/naaipe.git
cd naaipe

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values (see below)

# 4. Run locally
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NAAPIE_API_BASE_URL` | ✅ | Base URL of the API to explore (e.g. `https://graph.microsoft.com/v1.0`) |
| `VITE_CLIENT_ID` | ✅ | Entra ID app registration client ID |
| `VITE_TENANT_ID` | ❌ | Tenant ID or `common` for multi-tenant (default: `common`) |
| `VITE_REDIRECT_URI` | ❌ | OAuth redirect URI (default: `window.location.origin`) |

### Entra ID App Registration

1. Go to [Entra ID → App registrations](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) and create a new registration.
2. Set **Supported account types** to match your needs (single-tenant or multi-tenant).
3. Under **Authentication → Platform configurations**, add a **Single-page application** with redirect URI `http://localhost:5173`.
4. Copy the **Application (client) ID** into `VITE_CLIENT_ID`.
5. Under **API permissions**, add permissions for the API you want to call (e.g. `User.Read` for Microsoft Graph).

## Customising for Your API

### 1. Change the target API

Set `NAAPIE_API_BASE_URL` in `.env` to your API's base URL.

### 2. Replace sample queries

Edit **`src/config/sampleQueries.ts`** — this is the primary file to customise:

```ts
const sampleQueries: SampleQuery[] = [
  {
    id: 'list-items',
    category: 'Items',
    name: 'List all items',
    method: 'GET',
    path: '/items',
    description: 'Retrieve all items from the API.',
  },
  // Add more queries...
];
```

### 3. Update permissions / scopes

If your API uses custom OAuth scopes, update the `loginRequest.scopes` array in `src/auth/authConfig.ts`.

## Deployment (Azure Static Web Apps)

1. Create an [Azure Static Web App](https://learn.microsoft.com/en-us/azure/static-web-apps/overview) resource.
2. Add the deployment token as `AZURE_STATIC_WEB_APPS_API_TOKEN` in your repo **Secrets**.
3. Add your `VITE_*` values as repo **Variables** (Settings → Secrets and variables → Actions → Variables).
4. Push to `main` — the included GitHub Actions workflow handles the rest.

## Project Structure

```
src/
├── auth/           # MSAL configuration + provider wrapper
├── components/     # React UI components
├── config/         # ★ sampleQueries.ts — customise this!
├── hooks/          # useApiRequest (fetch + token)
└── types/          # Shared TypeScript interfaces
```

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite 8 |
| Auth | MSAL.js (PKCE) |
| Editor | Monaco Editor |
| Styling | Tailwind CSS v4 |
| Deploy | Azure Static Web Apps |

## License

MIT
