# SharePoint Graph Workbench (Vite + React)

A redesigned SharePoint experience rebuilt as a modern Vite + React application. The app uses Microsoft Entra ID (Azure AD) authentication and Microsoft Graph APIs over HTTPS to discover sites, list document libraries, and preview content.

## Highlights

- Modern Vite + React + TypeScript architecture.
- Secure Microsoft Graph integration using MSAL popup sign-in.
- Fast dashboard UX with metrics, data-source picker, and file explorer.
- Responsive, polished UI optimized for desktop and tablet.

## Prerequisites

1. A Microsoft Entra app registration.
2. Delegated Graph permissions:
   - `User.Read`
   - `Sites.Read.All`
   - `Files.Read.All`
3. Redirect URI registered for your dev/prod host.

## Setup

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```
2. Populate values in `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

- `src/config.ts`: Azure AD and Graph scope configuration.
- `src/services/graphClient.ts`: tokenized Graph API client.
- `src/services/sharepointService.ts`: SharePoint-specific Graph queries.
- `src/hooks/useSharePointData.ts`: stateful data loading hook.
- `src/components/*`: modular UI building blocks.

## Notes

- All data access is done over HTTPS through Microsoft Graph (`https://graph.microsoft.com/v1.0`).
- For production, serve over HTTPS and update redirect URIs accordingly.
