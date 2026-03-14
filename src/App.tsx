import { useEffect, useMemo, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { Header } from './components/Header';
import { SitePicker } from './components/SitePicker';
import { MetricsPanel } from './components/MetricsPanel';
import { LibraryExplorer } from './components/LibraryExplorer';
import { graphScopes, msalConfig } from './config';
import { useSharePointData } from './hooks/useSharePointData';

const msal = new PublicClientApplication(msalConfig);

/**
 * Root React component that manages authentication, site and library selection, and SharePoint data loading, and renders the application UI.
 *
 * @returns The root JSX element for the application UI
 */
export default function App() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [selectedLibraryId, setSelectedLibraryId] = useState('');

  const account = useMemo(
    () => msal.getAllAccounts().find((candidate) => candidate.homeAccountId === accountId) ?? null,
    [accountId]
  );

  const { sites, libraries, items, loading, error, loadLibraries, loadItems } = useSharePointData(msal, account);

  useEffect(() => {
    const bootstrap = async () => {
      await msal.initialize();
      const accounts = msal.getAllAccounts();
      if (accounts.length > 0) {
        setAccountId(accounts[0].homeAccountId);
      }
      setIsReady(true);
    };

    void bootstrap();
  }, []);

  const handleSignIn = async () => {
    const loginResult = await msal.loginPopup({ scopes: graphScopes });
    setAccountId(loginResult.account.homeAccountId);
  };

  const handleSignOut = async () => {
    if (!account) {
      return;
    }

    await msal.logoutPopup({
      account
    });

    setAccountId(null);
    setSelectedSiteId('');
    setSelectedLibraryId('');
  };

  const handleSelectSite = async (siteId: string) => {
    setSelectedSiteId(siteId);
    setSelectedLibraryId('');
    if (siteId) {
      await loadLibraries(siteId);
    }
  };

  const handleSelectLibrary = async (libraryId: string) => {
    setSelectedLibraryId(libraryId);
    if (selectedSiteId && libraryId) {
      await loadItems(selectedSiteId, libraryId);
    }
  };

  return (
    <main className="app-shell">
      <Header account={account} onSignIn={handleSignIn} onSignOut={handleSignOut} />

      {!isReady && <div className="loading-pill">Initializing secure session…</div>}

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-pill">Fetching data from Microsoft Graph…</div>}

      <MetricsPanel sites={sites} libraries={libraries} items={items} />

      <SitePicker
        sites={sites}
        libraries={libraries}
        selectedSiteId={selectedSiteId}
        selectedLibraryId={selectedLibraryId}
        onSelectSite={(siteId) => void handleSelectSite(siteId)}
        onSelectLibrary={(libraryId) => void handleSelectLibrary(libraryId)}
      />

      <LibraryExplorer items={items} />
    </main>
  );
}
