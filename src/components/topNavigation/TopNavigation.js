// @flow
import React, {Component} from 'react';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import {Link} from 'react-router';
import * as helpers from '../../helpers';

type Props = {
  t: Function,
  toggleSideMenu: Function,
}
type State = {
  logoClass: string,
  logo: string,
}

class TopNavigation extends Component {
  props: Props
  state: State = {
    logo: helpers.getLogo(),
    logoClass: helpers.getLogoClass(),
  }

  render() {
    const {t, toggleSideMenu} = this.props;
    return (
      <section className="top-navigation">
        <svg className="menuIcon" viewBox="0 0 27 27" onClick={toggleSideMenu}>
          <path d="M1.5,2.9h27v2.2h-27V2.9z M1.5,11.9h27v2.2h-27V11.9z M1.5,20.9h27v2.2h-27V20.9z"/>
        </svg>
        <div className="title">
          <Link to="/beta/">{t('appName')}</Link>
        </div>
        <div className="flag">
          <svg className="flagIcon" viewBox="0 0 27 27">
            <path d="M2.62 1.5h13.5v15.75H4.88V28.5H2.62v-27zm14.63 3.38h10.13v15.74H17.25z"/>
          </svg>
          <div className="circle">23</div>
        </div>
        <div className="username">Katja Immonen</div>
        <svg className="userIcon" viewBox="0 0 27 27">
          <path d="M9.45 5A7.55 7.55 0 0 1 15 2.62 7.55 7.55 0 0 1 20.55 5a7.55 7.55 0 0 1 2.33 5.55 7.78 7.78 0 0 1-.95 3.73A7.65 7.65 0 0 1 19.36 17a11.38 11.38 0 0 1 5 4.11 10.76 10.76 0 0 1 1.9 6.23H24A8.68 8.68 0 0 0 21.36 21 8.64 8.64 0 0 0 15 18.38 8.63 8.63 0 0 0 8.64 21 8.68 8.68 0 0 0 6 27.38H3.75a10.76 10.76 0 0 1 1.9-6.23 11.38 11.38 0 0 1 5-4.11 7.65 7.65 0 0 1-2.57-2.81 7.78 7.78 0 0 1-1-3.73A7.55 7.55 0 0 1 9.45 5zM19 6.53a5.41 5.41 0 0 0-4-1.65 5.41 5.41 0 0 0-4 1.65 5.41 5.41 0 0 0-1.65 4 5.41 5.41 0 0 0 1.65 4 5.41 5.41 0 0 0 4 1.65 5.41 5.41 0 0 0 4-1.65 5.41 5.41 0 0 0 1.65-4 5.41 5.41 0 0 0-1.65-4z"/>
        </svg>
      </section>
    );
  }
}

export default flowRight(
  translate(['common', 'roles'])
)(TopNavigation);
