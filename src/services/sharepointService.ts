import { AccountInfo } from '@azure/msal-browser';
import { GraphClient } from './graphClient';
import { DocumentLibrary, DriveItem, SharePointSite } from '../types';

interface GraphListResponse<T> {
  value: T[];
}

interface GraphDriveItem extends Omit<DriveItem, 'isFolder'> {
  folder?: unknown;
}

export class SharePointService {
  constructor(private readonly graphClient: GraphClient) {}

  async getSites(account: AccountInfo): Promise<SharePointSite[]> {
    const response = await this.graphClient.get<GraphListResponse<SharePointSite>>(
      '/sites?search=*',
      account
    );

    return response.value;
  }

  async getLibraries(siteId: string, account: AccountInfo): Promise<DocumentLibrary[]> {
    const response = await this.graphClient.get<GraphListResponse<DocumentLibrary>>(
      `/sites/${siteId}/drives`,
      account
    );

    return response.value;
  }

  async getLibraryItems(siteId: string, driveId: string, account: AccountInfo): Promise<DriveItem[]> {
    const response = await this.graphClient.get<GraphListResponse<GraphDriveItem>>(
      `/sites/${siteId}/drives/${driveId}/root/children`,
      account
    );

    return response.value.map((item) => ({
      id: item.id,
      name: item.name,
      webUrl: item.webUrl,
      size: item.size,
      lastModifiedDateTime: item.lastModifiedDateTime,
      isFolder: Boolean(item.folder)
    }));
  }
}
