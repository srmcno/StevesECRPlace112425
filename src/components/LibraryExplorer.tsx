import { DriveItem } from '../types';

interface LibraryExplorerProps {
  items: DriveItem[];
}

const sizeFormatter = new Intl.NumberFormat('en-US');

export function LibraryExplorer({ items }: LibraryExplorerProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Library Contents</h2>
        <p>Snapshot of the selected drive root folder</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Last Modified</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <a href={item.webUrl} target="_blank" rel="noreferrer">
                      {item.name}
                    </a>
                  </td>
                  <td>{item.isFolder ? 'Folder' : 'File'}</td>
                  <td>{item.lastModifiedDateTime ? new Date(item.lastModifiedDateTime).toLocaleString() : '—'}</td>
                  <td>{item.size ? `${sizeFormatter.format(item.size)} B` : '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="empty-state">
                  Choose a site and library to preview files.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
