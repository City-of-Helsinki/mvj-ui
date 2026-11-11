import React from "react";
import {
  useAuthenticatedUser,
  useOidcClient,
  SideNavigation,
  Header,
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
  const permissionsQuery = useQuery({
    queryKey: ["land-use", "user-permissions"],
    queryFn: getUserPermissions,
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
    <Header
      className="landuse-header"
      theme={{
        "--actionbar-background-color": "var(--color-tram)",
        "--header-background-color": "var(--color-tram)",
        "--header-color": "var(--color-white)",
      }}
    >
      <SideNavigation
        className="landuse-header__app-navigation"
        id="landuse-app-navigation"
        aria-label="Sovellukset"
        toggleButtonLabel="Maanvuokrausjärjestelmä"
      >
        <SideNavigation.MainLevel
          id="landuse-app-navigation-landuse"
          label="Maankäyttösopimukset"
          href="/maankayttosopimukset"
          active
        />
        <SideNavigation.MainLevel
          id="landuse-app-navigation-leasing"
          label="Vuokraukset"
          href="/vuokraukset"
        />
      </SideNavigation>
      <Header.ActionBar
        className="landuse-header__action-bar"
        title="Maankäyttösopimukset"
        titleHref="/maankayttosopimukset"
        frontPageLabel="Maankäyttösopimukset"
        logo={<span />}
        menuButtonAriaLabel="Valikko"
      >
        <Header.ActionBarItem
          id="landuse-user-menu"
          label="Käyttäjävalikko"
          avatar={getUserInitials()}
          dropdownClassName="landuse-header__user-menu"
        >
          <li>
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
          </li>
        </Header.ActionBarItem>
      </Header.ActionBar>
    </Header>
  );
};

export default LandUseHeader;
