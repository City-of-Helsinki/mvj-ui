// @flow
import React, {Component, PropTypes} from 'react';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
// import classNames from 'classnames';

import {getActiveLanguage} from '../helpers';

type Props = {
  applicationId: String,
  t: Function,
};

class ApplicationForm extends Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.object,
  };

  goBack = () => {
    const {router} = this.context;
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/${lang}/applications`,
    });
  };

  render() {
    const {t, applicationId} = this.props;
    return (
      <div className="applications__form">
        <header className="hero">
          <h2 onClick={() => this.goBack()}>{t('single')} {applicationId}</h2>
        </header>
      </div>
    );
  }
}

export default flowRight(
  translate(['applications'])
)(ApplicationForm);
