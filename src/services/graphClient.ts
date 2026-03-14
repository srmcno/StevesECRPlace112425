import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { graphScopes } from '../config';

const graphBaseUrl = 'https://graph.microsoft.com/v1.0';

export class GraphClient {
  constructor(private readonly msal: PublicClientApplication) {}

  private async getAccessToken(account: AccountInfo): Promise<string> {
    const tokenResult = await this.msal.acquireTokenSilent({
      account,
      scopes: graphScopes
    });

    return tokenResult.accessToken;
  }

  async get<T>(path: string, account: AccountInfo): Promise<T> {
    const token = await this.getAccessToken(account);
    const response = await fetch(`${graphBaseUrl}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Graph request failed (${response.status}): ${errorBody}`);
    }

    return (await response.json()) as T;
  }
}
