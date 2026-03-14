import { AccountInfo } from '@azure/msal-browser';

interface HeaderProps {
  account: AccountInfo | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

/**
 * Render the application header with branding and sign-in controls.
 *
 * Displays the app title, description, and either a profile pill with a "Sign Out" button
 * when `account` is present or a "Connect to Microsoft 365" button when `account` is null.
 *
 * @param account - The signed-in account information; when provided, `account.username` is shown in the profile pill
 * @param onSignIn - Callback invoked when the user clicks the sign-in button
 * @param onSignOut - Callback invoked when the user clicks the sign-out button
 * @returns The header element containing branding and sign-in/sign-out controls
 */
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
