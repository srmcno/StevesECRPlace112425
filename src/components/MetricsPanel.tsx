import { DocumentLibrary, DriveItem, SharePointSite } from '../types';

interface MetricsPanelProps {
  sites: SharePointSite[];
  libraries: DocumentLibrary[];
  items: DriveItem[];
}

/**
 * Render a metrics panel showing counts of sites, libraries, files, and folders.
 *
 * @param sites - Array of SharePoint sites to count and display
 * @param libraries - Array of document libraries to count and display
 * @param items - Array of drive items; items with `isFolder === true` are counted as folders, others as files
 * @returns The React element containing four metric tiles: Sites, Libraries, Files, and Folders
 */
export function MetricsPanel({ sites, libraries, items }: MetricsPanelProps) {
  const fileCount = items.filter((item) => !item.isFolder).length;
  const folderCount = items.filter((item) => item.isFolder).length;

  return (
    <section className="panel metrics-grid">
      <article>
        <p>Sites</p>
        <h3>{sites.length}</h3>
      </article>
      <article>
        <p>Libraries</p>
        <h3>{libraries.length}</h3>
      </article>
      <article>
        <p>Files</p>
        <h3>{fileCount}</h3>
      </article>
      <article>
        <p>Folders</p>
        <h3>{folderCount}</h3>
      </article>
    </section>
  );
}
