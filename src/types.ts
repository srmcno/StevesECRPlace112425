export interface SharePointSite {
  id: string;
  displayName: string;
  webUrl: string;
}

export interface DocumentLibrary {
  id: string;
  name: string;
  driveType: string;
}

export interface DriveItem {
  id: string;
  name: string;
  webUrl: string;
  size?: number;
  lastModifiedDateTime?: string;
  isFolder: boolean;
}
