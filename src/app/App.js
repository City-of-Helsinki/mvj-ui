// @flow

import React, {Component} from 'react';
import i18n from '../root/i18n';

import TopNavigation from '../components/topNavigation/TopNavigation';
import {isAllowedLanguage} from '../util/helpers';
import {Languages} from '../constants';

type Props = {
  children: any,
  params: Object,
};

class App extends Component {
  props: Props

  componentDidMount() {
    const {params: {language}} = this.props;

    if (language !== i18n.language) {
      if (isAllowedLanguage(language)) {
        i18n.changeLanguage(language);
      } else {
        i18n.changeLanguage(Languages.EN);
      }
    }
  }

  render() {
    const {children} = this.props;
    return (
      <div className={'app'}>
        <TopNavigation />
        <section className="app__content">
          {children}
        </section>
      </div>
    );
  }
}

export default App;
