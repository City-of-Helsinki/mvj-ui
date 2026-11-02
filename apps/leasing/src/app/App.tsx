import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { get } from "lodash-es";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { setNavigate } from "@/root/navigationService";
import { ActionTypes, ModalConsumer, ModalProvider } from "@/app/ModalContext";
import ApiErrorModal from "@/api/ApiErrorModal";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import Loader from "@/components/loader/Loader";
import NotificationCenter from "@/components/notification/NotificationCenter";
import useAuth from "@/auth/useAuth";
import LoginPage from "@/auth/components/LoginPage";
import SideMenu from "@/components/sideMenu/SideMenu";
import TopNavigation from "@/components/topNavigation/TopNavigation";
import { Routes, getRouteById } from "@/root/routes";
import { clearError } from "@/api/slice";
import { getError } from "@/api/selectors";
import useActiveServiceUnitSync from "@/usersPermissions/useActiveServiceUnitSync";
import {
  getLinkUrl,
  getPageTitle,
  getShowSearch,
} from "@/components/topNavigation/selectors";
import {
  getUserGroups,
  getUserActiveServiceUnit,
  getUserServiceUnits,
} from "@/usersPermissions/selectors";
import "@/main.scss";

const url = window.location.toString();
const IS_DEVELOPMENT_URL = url.includes("ninja") || url.includes("localhost");
type Props = {
  children: JSX.Element;
};

const App: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [displaySideMenu, setDisplaySideMenu] = useState(false);
  const [displayUserGroups, setDisplayUserGroups] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { loggedIn, authenticatedUser, login, logout } = useAuth();
  const navigate = useNavigate();

  const apiError = useAppSelector(getError);
  const linkUrl = useAppSelector(getLinkUrl);
  const pageTitle = useAppSelector(getPageTitle);
  const showSearch = useAppSelector(getShowSearch);
  const userGroups = useAppSelector(getUserGroups);
  const userServiceUnits = useAppSelector(getUserServiceUnits);
  const userActiveServiceUnit = useAppSelector(getUserActiveServiceUnit);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  useActiveServiceUnitSync();

  const handleLogin = () => {
    const { pathname, search } = location;
    const redirectPath = `${pathname}${search}`;
    setIsLoggingIn(true);
    login(redirectPath);
  };

  const logOut = () => {
    logout();
  };

  const toggleSideMenu = () => {
    setDisplaySideMenu(!displaySideMenu);
  };

  const toggleDisplayUserGroups = () => {
    setDisplayUserGroups(!displayUserGroups);
  };

  const handleDismissErrorModal = () => {
    dispatch(clearError());
  };

  const appStyle = IS_DEVELOPMENT_URL ? "app-dev" : "app";

  if (!loggedIn) {
    return (
      <div className={appStyle}>
        <NotificationCenter />

        <ApiErrorModal
          data={apiError}
          isOpen={Boolean(apiError)}
          handleDismiss={handleDismissErrorModal}
        />

        <LoginPage buttonDisabled={isLoggingIn} onLoginClick={handleLogin} />
        <Loader isLoading={!loggedIn && isLoggingIn} />

        {location.pathname === getRouteById(Routes.CALLBACK) && children}
      </div>
    );
  }

  return (
    <ModalProvider>
      <ModalConsumer>
        {({
          isConfirmationModalOpen,
          confirmationFunction,
          confirmationModalButtonClassName,
          confirmationModalButtonText,
          confirmationModalLabel,
          confirmationModalTitle,
          modalDispatch,
        }) => {
          const handleConfirmation = () => {
            confirmationFunction?.();
            handleHideConfirmationModal();
          };

          const handleHideConfirmationModal = () => {
            modalDispatch({
              type: ActionTypes.HIDE_CONFIRMATION_MODAL,
            });
          };

          return (
            <div className={appStyle}>
              <ApiErrorModal
                data={apiError}
                isOpen={Boolean(apiError)}
                handleDismiss={handleDismissErrorModal}
              />

              <ConfirmationModal
                confirmButtonClassName={confirmationModalButtonClassName}
                confirmButtonLabel={confirmationModalButtonText}
                isOpen={isConfirmationModalOpen}
                label={confirmationModalLabel}
                onCancel={handleHideConfirmationModal}
                onClose={handleHideConfirmationModal}
                onSave={handleConfirmation}
                title={confirmationModalTitle || ""}
              />

              <NotificationCenter />

              <TopNavigation
                isMenuOpen={displaySideMenu}
                linkUrl={linkUrl}
                onLogout={logOut}
                pageTitle={pageTitle}
                showSearch={showSearch}
                toggleSideMenu={toggleSideMenu}
                toggleDisplayUserGroups={toggleDisplayUserGroups}
                username={get(authenticatedUser, "profile.name")}
                userServiceUnits={userServiceUnits}
                userActiveServiceUnit={userActiveServiceUnit}
              />

              {displayUserGroups && (
                <section className="app__usergroup-list">
                  <strong>Käyttäjäryhmät ja palvelukokonaisuudet</strong>
                  {userGroups &&
                    userGroups.length > 1 &&
                    userGroups.map((group, index) => {
                      return (
                        <p className="usergroup-list-item" key={group}>
                          {group}
                        </p>
                      );
                    })}
                </section>
              )}

              <section className="app__content">
                <SideMenu
                  isOpen={displaySideMenu}
                  onLinkClick={toggleSideMenu}
                />
                <div className="wrapper">{children}</div>
              </section>
            </div>
          );
        }}
      </ModalConsumer>
    </ModalProvider>
  );
};

export default App;
