// @flow

import React, {Component} from 'react';
import {Link} from 'react-router';
import {translate} from 'react-i18next';
import LanguageSwitcher from './languageSwitcher/LanguageSwitcher';

type Props = {
  i18n: Object,
  t: Function,
}

class TopNavigation extends Component {
  props: Props;

  render() {
    const {t} = this.props;

    return (
      <section className="top-navigation">
        <div className="title">
          <Link to="/">{t('appName')}</Link>
        </div>
        <LanguageSwitcher/>
      </section>
    );
  }
}

export default translate(['common'])(TopNavigation);
