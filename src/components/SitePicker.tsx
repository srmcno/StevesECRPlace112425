import { DocumentLibrary, SharePointSite } from '../types';

interface SitePickerProps {
  sites: SharePointSite[];
  libraries: DocumentLibrary[];
  selectedSiteId: string;
  selectedLibraryId: string;
  onSelectSite: (siteId: string) => void;
  onSelectLibrary: (libraryId: string) => void;
}

/**
 * Renders a "Data Source" panel that lets the user choose a SharePoint site and a dependent document library.
 *
 * The library dropdown is disabled until a site is selected. Selecting a site or library calls the corresponding callback with the selected ID.
 *
 * @param sites - Available SharePoint sites displayed in the site select
 * @param libraries - Document libraries displayed in the library select
 * @param selectedSiteId - Currently selected site ID (empty string when none)
 * @param selectedLibraryId - Currently selected library ID (empty string when none)
 * @param onSelectSite - Callback invoked with the selected site ID when the site changes
 * @param onSelectLibrary - Callback invoked with the selected library ID when the library changes
 * @returns A JSX element containing the site and library selection UI
 */
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
