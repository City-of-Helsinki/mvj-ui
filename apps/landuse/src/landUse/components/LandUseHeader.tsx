import React, { useState } from "react";
import {
  useAuthenticatedUser,
  useOidcClient,
  Logo,
  LogoSize,
  logoFiDark,
  IconAngleDown,
} from "hds-react";
// TODO: Implement ME
const LandUseHeader: React.FC = () => {
  const authenticatedUser = useAuthenticatedUser();
  const { logout } = useOidcClient();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserInitials = () => {
    if (!authenticatedUser) return "U";
    const user = authenticatedUser as any;
    const name =
      user.given_name && user.family_name
        ? `${user.given_name} ${user.family_name}`
        : user.email || user.sub || "User";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="landuse-header">
      <div className="landuse-header__left">
        <Logo src={logoFiDark} size={LogoSize.Medium} alt="Helsinki" />
        <h1 className="landuse-header__title">Maankäyttösopimukset</h1>
      </div>
      <div className="landuse-header__right">
        <div className="landuse-header__user">
          <button
            className="landuse-header__user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-expanded={showUserMenu}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span className="landuse-header__user-initials">
              {getUserInitials()}
            </span>
            <IconAngleDown aria-hidden="true" />
          </button>
          {showUserMenu && (
            <div className="landuse-header__user-menu">
              <div className="landuse-header__user-info">
                {(authenticatedUser as any)?.given_name ||
                  (authenticatedUser as any)?.email ||
                  "User"}
              </div>
              <button
                className="landuse-header__user-menu-item"
                onClick={handleLogout}
              >
                Kirjaudu ulos
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandUseHeader;
