// @flow
import React, {Component, PropTypes} from 'react';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';

import CreateApplicationForm from './CreateApplicationForm';
import {default as List} from '../components/applicationList/ApplicationList';

import {getActiveLanguage, formatUnix} from '../helpers';

const applicationData = [
  {id: 'id1', date: formatUnix(Date.now()), company: 'Eka Oy', name: 'Ville Hakija'},
  {id: 'id2', date: formatUnix(Date.now()), company: 'Toka Oy', name: 'Ville Hakija'},
  {id: 'id3', date: formatUnix(Date.now()), company: 'Kolmas Oy', name: 'Ville Hakija'},
  {id: 'id4', date: formatUnix(Date.now()), company: 'Neljäs Oy', name: 'Ville Hakija'},
  {id: 'id5', date: formatUnix(Date.now()), company: 'Yritys Oy', name: 'Ville Hakija'},
  {id: 'id6', date: formatUnix(Date.now()), company: 'Yritys Oy', name: 'Ville Hakija'},
  {id: 'id7', date: formatUnix(Date.now()), company: 'Yritys Oy', name: 'Ville Hakija'},
  {id: 'id8', date: formatUnix(Date.now()), company: 'Yritys Oy', name: 'Ville Hakija'},
  {id: 'id9', date: formatUnix(Date.now()), company: 'Yritys Oy', name: 'Ville Hakija'},
  {id: 'id10', date: formatUnix(Date.now()), company: 'Yritys Oy', name: 'Ville Hakija'},
];

type Props = {
  params: Object,
  t: Function,
};

class ApplicationsList extends Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.object,
  };

  handleItemClick = (applicationId) => {
    const {router} = this.context;
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/${lang}/applications/${applicationId}`,
    });
  };

  render() {
    const {t, params: {applicationId}} = this.props;
    return (
      <div className={classNames('applications', {'applications--form-open': !!applicationId})}>

        <div className="applications__list">
          <h2>{t('applications:title')}</h2>
          <List handleItemClick={this.handleItemClick}
                data={applicationData}/>
        </div>

        {applicationId &&
        <div className="applications__form">
          <CreateApplicationForm
            applicationId={applicationId}
          />
        </div>
        }

      </div>
    );
  }
}

export default flowRight(
  translate(['applications'])
)(ApplicationsList);
