import { AccountInfo } from '@azure/msal-browser';

interface HeaderProps {
  account: AccountInfo | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export function Header({ account, onSignIn, onSignOut }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">SharePoint + Microsoft Graph</p>
        <h1>Graph Workbench</h1>
        <p className="subtext">
          Explore sites, document libraries, and files through a secure Azure AD connection.
        </p>
      </div>

      <div className="header-actions">
        {account ? (
          <>
            <div className="profile-pill">{account.username}</div>
            <button className="btn btn-secondary" onClick={() => void onSignOut()}>
              Sign Out
            </button>
          </>
        ) : (
          <button className="btn" onClick={() => void onSignIn()}>
            Connect to Microsoft 365
          </button>
        )}
      </div>
    </header>
  );
}
