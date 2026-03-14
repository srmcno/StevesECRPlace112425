import { DocumentLibrary, SharePointSite } from '../types';

interface SitePickerProps {
  sites: SharePointSite[];
  libraries: DocumentLibrary[];
  selectedSiteId: string;
  selectedLibraryId: string;
  onSelectSite: (siteId: string) => void;
  onSelectLibrary: (libraryId: string) => void;
}

export function SitePicker({
  sites,
  libraries,
  selectedSiteId,
  selectedLibraryId,
  onSelectSite,
  onSelectLibrary
}: SitePickerProps) {
  return (
    <section className="panel">
      <h2>Data Source</h2>
      <div className="form-grid">
        <label>
          SharePoint Site
          <select value={selectedSiteId} onChange={(event) => onSelectSite(event.target.value)}>
            <option value="">Select a site...</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.displayName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Document Library
          <select
            value={selectedLibraryId}
            onChange={(event) => onSelectLibrary(event.target.value)}
            disabled={!selectedSiteId}
          >
            <option value="">Select a library...</option>
            {libraries.map((library) => (
              <option key={library.id} value={library.id}>
                {library.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
