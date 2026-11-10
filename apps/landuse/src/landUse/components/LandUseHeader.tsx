import React, { useState } from "react";
import {
  useAuthenticatedUser,
  useOidcClient,
  Logo,
  LogoSize,
  logoFiDark,
  IconAngleDown,
  IconSignout,
  IconUser,
  Button,
  ButtonVariant,
  Notification,
} from "hds-react";
import { useQuery } from "@tanstack/react-query";
import { getUserPermissions } from "@/landUse/api/landUseApi";
import { getLanduseApiErrorMessage } from "@/landUse/api/fetchClient";

const LandUseHeader: React.FC = () => {
  const authenticatedUser = useAuthenticatedUser();
  const { logout } = useOidcClient();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const permissionsQuery = useQuery({
    queryKey: ["land-use", "user-permissions"],
    queryFn: getUserPermissions,
    enabled: showUserMenu,
  });

  const getUserInitials = () => {
    if (!authenticatedUser?.profile?.name) return "?";
    const name = authenticatedUser?.profile?.name;
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
            aria-label="Käyttäjävalikko"
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
                <IconUser aria-hidden="true" style={{ flexShrink: 0 }} />
                <span>{authenticatedUser.profile?.name || "?"}</span>
              </div>
              <section
                className="landuse-header__user-groups"
                aria-labelledby="landuse-user-groups-title"
              >
                <h2 id="landuse-user-groups-title">Käyttäjän ryhmät</h2>
                {permissionsQuery.isPending ? (
                  <p role="status">Ladataan...</p>
                ) : permissionsQuery.isError ? (
                  <Notification
                    type="error"
                    label="Käyttäjäryhmien lataaminen epäonnistui"
                  >
                    {getLanduseApiErrorMessage(permissionsQuery.error)}
                  </Notification>
                ) : permissionsQuery.data?.groups?.length ? (
                  <ul>
                    {permissionsQuery.data.groups.map((group) => (
                      <li key={group}>{group}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Ei käyttäjäryhmiä.</p>
                )}
              </section>
              <Button
                type="button"
                variant={ButtonVariant.Supplementary}
                iconStart={<IconSignout />}
                className="landuse-header__user-menu-item"
                onClick={handleLogout}
              >
                Kirjaudu ulos
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandUseHeader;
