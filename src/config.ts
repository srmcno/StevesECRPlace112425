import { Configuration } from '@azure/msal-browser';

const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI ?? window.location.origin;

if (!tenantId || !clientId) {
  // eslint-disable-next-line no-console
  console.warn('Missing Azure AD config. Set VITE_AZURE_TENANT_ID and VITE_AZURE_CLIENT_ID.');
}

export const msalConfig: Configuration = {
  auth: {
    clientId: clientId ?? '',
    authority: `https://login.microsoftonline.com/${tenantId ?? 'common'}`,
    redirectUri
  },
  cache: {
    cacheLocation: 'sessionStorage'
  }
};

export const graphScopes = ['User.Read', 'Sites.Read.All', 'Files.Read.All'];
