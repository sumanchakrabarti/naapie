# NaApiE — Need another API Explorer

## Problem Statement
Build a reusable, forkable REST API explorer app (similar to Microsoft Graph Explorer) in Node.js / TypeScript / React 19. Users log in with a Microsoft account via OAuth2 PKCE, and can make authenticated HTTP requests against a configurable API base URL. Teams fork and customize the sample queries to fit their own APIs.

## Decisions Made
| Decision | Choice |
|---|---|
| API base URL | Set via `VITE_API_BASE_URL` environment variable |
| Auth flow | OAuth2 Authorization Code + PKCE (SPA, no backend) |
| Framework | Vite + React 19 + TypeScript |
| Deployment | Azure Static Web Apps |
| Sample queries | Shipped in a TypeScript config file, easy to customize |
| Query history | Not included (out of scope for v1) |

## Tech Stack
- **Runtime/Build**: Node.js, Vite 6
- **UI**: React 19, TypeScript
- **Auth**: `@azure/msal-browser` + `@azure/msal-react` (PKCE flow)
- **Styling**: Tailwind CSS v4
- **JSON/Body editor**: `@monaco-editor/react` (lightweight code editor)
- **Deployment**: Azure Static Web Apps (`staticwebapp.config.json`)
- **CI/CD**: GitHub Actions workflow for Azure SWA

## Project Structure
```
naaipe/
├── public/
│   └── staticwebapp.config.json      # Azure SWA routing (SPA fallback)
├── src/
│   ├── auth/
│   │   ├── authConfig.ts             # MSAL config (reads env vars)
│   │   └── MsalProviderWrapper.tsx   # Wraps app in MsalProvider
│   ├── components/
│   │   ├── AppHeader.tsx             # Top bar: app name + login/logout button
│   │   ├── QueryBar.tsx              # Method dropdown + URL input + Run button
│   │   ├── RequestEditor.tsx         # Tabs: Headers | Body (Monaco editor)
│   │   ├── ResponseViewer.tsx        # Tabs: Response (JSON) | Headers | Status
│   │   └── SampleQueriesSidebar.tsx  # Collapsible list of sample queries
│   ├── config/
│   │   └── sampleQueries.ts          # ← Teams customize this file when forking
│   ├── hooks/
│   │   └── useApiRequest.ts          # Executes fetch with Bearer token
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example                       # Documents all required env vars
├── .gitignore
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # CI/CD pipeline
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## Environment Variables
```
NAAPIE_API_BASE_URL=https://graph.microsoft.com/v1.0  # Target API base URL
VITE_CLIENT_ID=<AAD app registration client ID>
VITE_TENANT_ID=<AAD tenant ID, or "common" for multi-tenant>
VITE_REDIRECT_URI=http://localhost:5173               # Override for local dev
```

## Core Features (v1)
1. **Microsoft login** – MSAL PKCE flow; login/logout button in header; Bearer token auto-attached to requests
2. **Query bar** – HTTP method selector (GET/POST/PUT/PATCH/DELETE) + URL path input (appended to base URL) + "Run query" button
3. **Request editor** – Tab for custom headers (key/value pairs) and tab for request body (Monaco JSON editor)
4. **Response viewer** – JSON-formatted response body, HTTP status badge, response headers tab
5. **Sample queries sidebar** – Collapsible panel; clicking a query populates the query bar and body editor; defined in `sampleQueries.ts`
6. **Anonymous support** – Users can run queries without logging in; token attachment is skipped

## Todos
1. `scaffold` – Bootstrap Vite + React 19 + TypeScript project in `C:\git\naaipe`
2. `deps` – Install all npm dependencies (MSAL, Tailwind, Monaco, etc.)
3. `auth-config` – Implement `authConfig.ts` and `MsalProviderWrapper.tsx`
4. `types` – Define shared TypeScript types (SampleQuery, HttpMethod, RequestState, ResponseState)
5. `sample-queries-config` – Create `sampleQueries.ts` with example entries
6. `app-header` – Build `AppHeader` component with login/logout
7. `query-bar` – Build `QueryBar` component
8. `request-editor` – Build `RequestEditor` with headers + body tabs
9. `response-viewer` – Build `ResponseViewer` with JSON formatting + status badge
10. `sample-sidebar` – Build `SampleQueriesSidebar` component
11. `use-api-request` – Implement `useApiRequest` hook (fetch + MSAL token acquisition)
12. `app-layout` – Wire all components together in `App.tsx`
13. `azure-config` – Add `staticwebapp.config.json` and GitHub Actions CI/CD workflow
14. `env-docs` – Write `.env.example` and `README.md` with fork/customization guide
15. `validate` – Run `npm run build` and verify no TypeScript errors
