import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import i18n from '../../root/i18n';

type Props = {
  i18n: Object,
  t: Function,
}

class Footer extends Component {
  props: Props;

  constructor(props) {
    super(props);

    i18n.on('languageChanged', this.onLanguageChange);
  }

  onLanguageChange = (language) => {
    console.log('Language changed to', language);
  };

  componentWillMount() {
    console.log(this.props.i18n.language);
  }

  render() {
    const {t} = this.props;

    return (
      <footer className='footer text-center'>
        <p>{t('appName')}</p>
      </footer>
    );
  }
}

export default flowRight(
  translate(['common', 'general', 'footer']),
  withRouter,
)(Footer);
