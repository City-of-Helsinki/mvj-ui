// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import MainMenuIcon from '../icons/MainMenuIcon';
import SearchInput from '../inputs/SearchInput';
import {CancelChangesModalTexts} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
import {getSearchQuery, getUrlParams} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';

import type {UserGroups} from '$src/usersPermissions/types';

type Props = {
  history: Object,
  isMenuOpen: boolean,
  linkUrl: string,
  location: Object,
  onLogout: Function,
  pageTitle: string,
  showSearch: boolean,
  toggleSideMenu: Function,
  userGroups: UserGroups,
  username: string,
}

type State = {
  identifier: string,
}

class TopNavigation extends Component<Props, State> {
  state = {
    identifier: '',
  }

  componentDidMount() {
    this.setInitialSearchValue();
  }

  componentDidUpdate(prevProps: Props) {
    const {location: {pathname}} = this.props;

    if(pathname !== prevProps.location.pathname) {
      this.setInitialSearchValue();
    }
  }

  setInitialSearchValue = () => {
    const {location: {search}} = this.props;
    const query = getUrlParams(search);

    this.setState({identifier: query.identifier || ''});
  }

  handleSearchChange = (e: any) => {
    this.setState({identifier: e.target.value});
  }

  moveSearchPage = () => {
    const {history} = this.props;
    const {identifier} = this.state;

    if(identifier) {
      const query = {identifier: identifier};

      return history.push({
        pathname: getRouteById(Routes.LEASES),
        search: getSearchQuery(query),
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
      userGroups,
      username,
    } = this.props;
    const {identifier} = this.state;

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
                  const {history} = this.props;
                  const relativeUrl = target.href.replace(location.origin, '');

                  history.push(relativeUrl);
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
                  <Link onClick={handleLinkClick} to={linkUrl || ''}>{pageTitle}</Link>
                </div>
              </div>
              <div className="top-navigation__right-wrapper">
                {!!showSearch &&
                  <div className="search">
                    <SearchInput
                      onChange={this.handleSearchChange}
                      onKeyUp={handleSearchKeyUp}
                      onSubmit={handleSearch}
                      value={identifier}
                    />
                  </div>
                }

                <div className="username-wrapper">
                  <p className="username">{username}{!!userGroups && !!userGroups.length && ` (${userGroups.join(', ')})`}</p>
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

// $FlowFixMe
export default withRouter(TopNavigation);
