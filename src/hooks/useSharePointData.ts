import { useEffect, useMemo, useState } from 'react';
import { AccountInfo, PublicClientApplication } from '@azure/msal-browser';
import { GraphClient } from '../services/graphClient';
import { SharePointService } from '../services/sharepointService';
import { DocumentLibrary, DriveItem, SharePointSite } from '../types';

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
