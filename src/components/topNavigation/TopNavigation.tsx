import React, { Component } from "react";
import classNames from "classnames";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { IconMenuDots } from "hds-react";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import MainMenuIcon from "../icons/MainMenuIcon";
import SearchInput from "../inputs/SearchInput";
import UserServiceUnitSelectInput from "../inputs/UserServiceUnitSelectInput";
import { ConfirmationModalTexts } from "enums";
import { ButtonColors } from "/src/components/enums";
import { hasAnyPageDirtyForms } from "/src/util/forms";
import { getSearchQuery, getUrlParams } from "/src/util/helpers";
import { getRouteById, Routes } from "/src/root/routes";

import type { UserGroups, UserServiceUnit, UserServiceUnits } from "/src/usersPermissions/types";

type Props = {
  history: Record<string, any>;
  isMenuOpen: boolean;
  linkUrl: string;
  location: Record<string, any>;
  onLogout: (...args: Array<any>) => any;
  pageTitle: string;
  showSearch: boolean;
  toggleSideMenu: (...args: Array<any>) => any;
  toggleDisplayUserGroups: () => void,
  userActiveServiceUnit: UserServiceUnit;
  userServiceUnits: UserServiceUnits;
  username: string;
};
type State = {
  search: string;
};

class TopNavigation extends Component<Props, State> {
  state = {
    search: ''
  };

  componentDidMount() {
    this.setInitialSearchValue();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      location: {
        pathname
      }
    } = this.props;

    if (pathname !== prevProps.location.pathname) {
      this.setInitialSearchValue();
    }
  }

  setInitialSearchValue = () => {
    const {
      location: {
        search
      }
    } = this.props;
    const query = getUrlParams(search);
    this.setState({
      search: query.search || ''
    });
  };
  handleSearchChange = (e: any) => {
    this.setState({
      search: e.target.value
    });
  };
  moveSearchPage = () => {
    const {
      history
    } = this.props;
    const {
      search
    } = this.state;

    if (search) {
      const query = {
        search: search
      };
      return history.push({
        pathname: getRouteById(Routes.LEASES),
        search: getSearchQuery(query)
      });
    }
  };

  render() {
    const {
      isMenuOpen,
      linkUrl,
      pageTitle,
      showSearch,
      toggleSideMenu,
      toggleDisplayUserGroups,
      userActiveServiceUnit,
      userServiceUnits,
      username,
    } = this.props;
    const {
      search
    } = this.state;
    return <AppConsumer>
        {({
        dispatch
      }) => {
        const handleLinkClick = (e: any) => {
          const hasDirtyPages = hasAnyPageDirtyForms();

          if (hasDirtyPages) {
            const target = e.target;
            e.preventDefault();
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                const {
                  history
                } = this.props;
                const relativeUrl = target.href.replace(location.origin, '');
                history.push(relativeUrl);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE
            });
          }
        };

        const handleSearch = () => {
          const hasDirtyPages = hasAnyPageDirtyForms();

          if (hasDirtyPages) {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.moveSearchPage();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE
            });
          } else {
            this.moveSearchPage();
          }
        };

        const handleSearchKeyUp = (e: any) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        };

        const handleLogout = () => {
          const {
            onLogout
          } = this.props,
                hasDirtyPages = hasAnyPageDirtyForms();

          if (hasDirtyPages) {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                onLogout();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE
            });
          } else {
            onLogout();
          }
        };

        return <section className="top-navigation">
              <div className="top-navigation__left-wrapper">
                <div className={classNames('top-navigation__title', {
              'is-open': isMenuOpen
            })}>
                  <button className='top-navigation__title_button' onClick={toggleSideMenu} tabIndex={0}>
                    <span>Maanvuokrausjärjestelmä</span>
                    <MainMenuIcon />
                  </button>
                </div>
                <div className="page-title">
                  <Link onClick={handleLinkClick} to={linkUrl || ''}>{pageTitle}</Link>
                </div>
              </div>
              <div className="top-navigation__right-wrapper">
                {!!showSearch && <div className="search">
                    <SearchInput onChange={this.handleSearchChange} onKeyUp={handleSearchKeyUp} onSubmit={handleSearch} value={search} />
                  </div>}

                {!!userServiceUnits.length && userActiveServiceUnit && <div className="user-service-unit">
                    {userServiceUnits.length > 1 ? <UserServiceUnitSelectInput userServiceUnits={userServiceUnits} userActiveServiceUnit={userActiveServiceUnit} /> : <div className="user-service-unit-text">
                        <div className="service-unit-label">Oma palvelukokonaisuus</div>
                        <div className="service-unit-name">{userActiveServiceUnit.name}</div>
                      </div>}
                  </div>}

                <div className="username-wrapper">
                  <p className="username">
                    {username} <button className={"user-group-button"} onClick={toggleDisplayUserGroups}><IconMenuDots color="white" size="xs" /></button>                  </p>
                  <button className='logout-link' onClick={handleLogout}>Kirjaudu ulos</button>
                </div>
              </div>
            </section>;
      }}
      </AppConsumer>;
  }

}

export default withRouter(TopNavigation);