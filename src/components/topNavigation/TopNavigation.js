// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import MainMenuIcon from '../icons/MainMenuIcon';
import SearchInput from '../inputs/SearchInput';
import {CancelChangesModalTexts} from '$src/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
import {getRouteById} from '$src/root/routes';

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
        pathname: getRouteById('leases'),
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
                {/* <div className="user-icon-wrapper">
                  <svg className="userIcon" focusable='false' viewBox="0 0 27 27">
                    <path d="M9.45 5A7.55 7.55 0 0 1 15 2.62 7.55 7.55 0 0 1 20.55 5a7.55 7.55 0 0 1 2.33 5.55 7.78 7.78 0 0 1-.95 3.73A7.65 7.65 0 0 1 19.36 17a11.38 11.38 0 0 1 5 4.11 10.76 10.76 0 0 1 1.9 6.23H24A8.68 8.68 0 0 0 21.36 21 8.64 8.64 0 0 0 15 18.38 8.63 8.63 0 0 0 8.64 21 8.68 8.68 0 0 0 6 27.38H3.75a10.76 10.76 0 0 1 1.9-6.23 11.38 11.38 0 0 1 5-4.11 7.65 7.65 0 0 1-2.57-2.81 7.78 7.78 0 0 1-1-3.73A7.55 7.55 0 0 1 9.45 5zM19 6.53a5.41 5.41 0 0 0-4-1.65 5.41 5.41 0 0 0-4 1.65 5.41 5.41 0 0 0-1.65 4 5.41 5.41 0 0 0 1.65 4 5.41 5.41 0 0 0 4 1.65 5.41 5.41 0 0 0 4-1.65 5.41 5.41 0 0 0 1.65-4 5.41 5.41 0 0 0-1.65-4z"/>
                  </svg>
                  <div className="badge">23</div>
                </div> */}

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
