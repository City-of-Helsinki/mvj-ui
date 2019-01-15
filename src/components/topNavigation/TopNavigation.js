// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import MainMenuIcon from '../icons/MainMenuIcon';
import SearchInput from '../inputs/SearchInput';
import {CancelChangesModalTexts} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
import {getRouteById, Routes} from '$src/root/routes';

type Props = {
  isMenuOpen: boolean,
  linkUrl: string,
  onLogout: Function,
  pageTitle: string,
  showSearch: boolean,
  toggleSideMenu: Function,
  username: string,
}

type State = {
  search: string,
}

class TopNavigation extends Component<Props, State> {
  state = {
    search: '',
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  handleSearchChange = (e: any) => {
    this.setState({search: e.target.value});
  }

  moveSearchPage = () => {
    const {search} = this.state,
      {router} = this.context;

    if(search) {
      const query = {search: search};

      return router.push({
        pathname: getRouteById(Routes.LEASES),
        query,
      });
    }
  }

  render() {
    const {
      isMenuOpen,
      linkUrl,
      pageTitle,
      showSearch,
      toggleSideMenu,
      username,
    } = this.props;
    const {search} = this.state;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleLinkClick = (e: any) => {
            const hasDirtyPages = hasAnyPageDirtyForms();

            if(hasDirtyPages) {
              const target = e.target;

              e.preventDefault();

              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  const {router} = this.context;
                  router.push(target.href);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: CancelChangesModalTexts.BUTTON,
                confirmationModalLabel: CancelChangesModalTexts.LABEL,
                confirmationModalTitle: CancelChangesModalTexts.TITLE,
              });
            }
          };

          const handleSearch = () => {
            const hasDirtyPages = hasAnyPageDirtyForms();

            if(hasDirtyPages) {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  this.moveSearchPage();
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: CancelChangesModalTexts.BUTTON,
                confirmationModalLabel: CancelChangesModalTexts.LABEL,
                confirmationModalTitle: CancelChangesModalTexts.TITLE,
              });
            } else {
              this.moveSearchPage();
            }
          };

          const handleSearchKeyUp = (e: any) => {
            if(e.key === 'Enter'){
              handleSearch();
            }
          };

          const handleLogout = () => {
            const {onLogout} = this.props,
              hasDirtyPages = hasAnyPageDirtyForms();

            if(hasDirtyPages) {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  onLogout();
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: CancelChangesModalTexts.BUTTON,
                confirmationModalLabel: CancelChangesModalTexts.LABEL,
                confirmationModalTitle: CancelChangesModalTexts.TITLE,
              });
            } else {
              onLogout();
            }
          };

          return(
            <section className="top-navigation">
              <div className="top-navigation__left-wrapper">
                <div className={classNames('top-navigation__title', {'is-open': isMenuOpen})}>
                  <button
                    className='top-navigation__title_button'
                    onClick={toggleSideMenu}
                    tabIndex={0}
                  >
                    <span>Maanvuokrausjärjestelmä</span>
                    <MainMenuIcon />
                  </button>
                </div>
                <div className="page-title">
                  <Link onClick={handleLinkClick} to={linkUrl}>{pageTitle}</Link>
                </div>
              </div>
              <div className="top-navigation__right-wrapper">
                {!!showSearch &&
                  <div className="search">
                    <SearchInput
                      onChange={this.handleSearchChange}
                      onKeyUp={handleSearchKeyUp}
                      onSubmit={handleSearch}
                      value={search}
                    />
                  </div>
                }

                <div className="username-wrapper">
                  <p className="username">{username}</p>
                  <button className='logout-link' onClick={handleLogout}>Kirjaudu ulos</button>
                </div>
              </div>
            </section>
          );
        }}
      </AppConsumer>
    );
  }
}

export default TopNavigation;
