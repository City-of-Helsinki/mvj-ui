// @flow
import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {Link} from 'react-router';
import flowRight from 'lodash/flowRight';

import * as helpers from '../../helpers';

type Props = {
  t: Function,
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
    const {t} = this.props;
    return (
      <section className="top-navigation">
        <div className="logo">
          <Link to="/beta" className={this.state.logoClass}>
            <img src={this.state.logo}/>
          </Link>
        </div>
        <div className="title">
          <span>{t('appName')}</span>
        </div>
      </section>
    );
  }
}

export default flowRight(
  translate(['common', 'roles'])
)(TopNavigation);
