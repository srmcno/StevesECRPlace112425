import { useEffect, useMemo, useState } from 'react';
import { AccountInfo, PublicClientApplication } from '@azure/msal-browser';
import { GraphClient } from '../services/graphClient';
import { SharePointService } from '../services/sharepointService';
import { DocumentLibrary, DriveItem, SharePointSite } from '../types';

/**
 * Manages loading SharePoint sites, document libraries, and drive items for a given MSAL account and exposes loading state and errors.
 *
 * @param msal - The MSAL PublicClientApplication instance used to create the Graph client.
 * @param account - The authenticated account to use for requests; when `null` no data is loaded.
 * @returns An object containing:
 *  - `sites`: array of SharePoint sites retrieved for the account
 *  - `libraries`: array of document libraries for the selected site
 *  - `items`: array of drive items for the selected library
 *  - `loading`: `true` while a load operation is in progress, `false` otherwise
 *  - `error`: a descriptive error message when a load fails, or `null`
 *  - `loadSites`: function to load available sites
 *  - `loadLibraries`: function to load libraries for a given `siteId`
 *  - `loadItems`: function to load items for a given `siteId` and `driveId`
 */
export function useSharePointData(msal: PublicClientApplication, account: AccountInfo | null) {
  const service = useMemo(() => new SharePointService(new GraphClient(msal)), [msal]);
  const [sites, setSites] = useState<SharePointSite[]>([]);
  const [libraries, setLibraries] = useState<DocumentLibrary[]>([]);
  const [items, setItems] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSites = async () => {
    if (!account) return;
    setLoading(true);
    setError(null);
    try {
      setSites(await service.getSites(account));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load sites');
    } finally {
      setLoading(false);
    }
  };

  const loadLibraries = async (siteId: string) => {
    if (!account) return;
    setLoading(true);
    setError(null);
    try {
      setLibraries(await service.getLibraries(siteId, account));
      setItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load libraries');
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (siteId: string, driveId: string) => {
    if (!account) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await service.getLibraryItems(siteId, driveId, account));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      void loadSites();
    }
  }, [account]);

  return {
    sites,
    libraries,
    items,
    loading,
    error,
    loadSites,
    loadLibraries,
    loadItems
  };
}
