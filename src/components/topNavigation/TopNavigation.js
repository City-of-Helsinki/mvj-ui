// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';

import {getRouteById} from '$src/root/routes';
import SearchInput from '../inputs/SearchInput';

type Props = {
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

  onKeyUp = (e: any) => {
    if(e.key === 'Enter'){
      this.search();
    }
  }

  search = () => {
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
      linkUrl,
      onLogout,
      pageTitle,
      showSearch,
      toggleSideMenu,
      username,
    } = this.props;
    const {search} = this.state;

    return (
      <section className="top-navigation">
        <div className="top-navigation__left-wrapper">
          <svg className="menuIcon" viewBox="0 0 27 27" onClick={toggleSideMenu}>
            <path d="M1.5,2.9h27v2.2h-27V2.9z M1.5,11.9h27v2.2h-27V11.9z M1.5,20.9h27v2.2h-27V20.9z"/>
          </svg>
          <div className="title">
            <span>Maanvuokrausjärjestelmä</span>
          </div>
          <div className="page-title">
            <Link to={linkUrl}>{pageTitle}</Link>
          </div>
        </div>
        <div className="top-navigation__right-wrapper">
          {!!showSearch &&
            <div className="search">
              <SearchInput
                onChange={this.handleSearchChange}
                onKeyUp={this.onKeyUp}
                onSubmit={this.search}
                value={search}
              />
            </div>
          }
          <div className="user-icon-wrapper">
            <svg className="userIcon" viewBox="0 0 27 27">
              <path d="M9.45 5A7.55 7.55 0 0 1 15 2.62 7.55 7.55 0 0 1 20.55 5a7.55 7.55 0 0 1 2.33 5.55 7.78 7.78 0 0 1-.95 3.73A7.65 7.65 0 0 1 19.36 17a11.38 11.38 0 0 1 5 4.11 10.76 10.76 0 0 1 1.9 6.23H24A8.68 8.68 0 0 0 21.36 21 8.64 8.64 0 0 0 15 18.38 8.63 8.63 0 0 0 8.64 21 8.68 8.68 0 0 0 6 27.38H3.75a10.76 10.76 0 0 1 1.9-6.23 11.38 11.38 0 0 1 5-4.11 7.65 7.65 0 0 1-2.57-2.81 7.78 7.78 0 0 1-1-3.73A7.55 7.55 0 0 1 9.45 5zM19 6.53a5.41 5.41 0 0 0-4-1.65 5.41 5.41 0 0 0-4 1.65 5.41 5.41 0 0 0-1.65 4 5.41 5.41 0 0 0 1.65 4 5.41 5.41 0 0 0 4 1.65 5.41 5.41 0 0 0 4-1.65 5.41 5.41 0 0 0 1.65-4 5.41 5.41 0 0 0-1.65-4z"/>
            </svg>
            <div className="badge">23</div>
          </div>

          <div className="username-wrapper">
            <p className="username">{username}</p>
            <a className='logout-link' onClick={onLogout}>Kirjaudu ulos</a>
          </div>
        </div>
      </section>
    );
  }
}

export default TopNavigation;
