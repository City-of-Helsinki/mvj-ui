// @flow
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';

import {fetchApplications} from '../actions';

import HandlerForm from './PreparerForm';
import ApplicationList from '../../components/applicationList/ApplicationList';

import {getActiveLanguage} from '../../util/helpers';
import {getApplicationsList, getIsFetching} from '../selectors';
import Hero from '../../components/hero/Hero';

type Props = {
  applications: Array<any>,
  fetchApplications: Function,
  isFetching: boolean,
  params: Object,
  router: Object,
  t: Function,
};

class ApplicationsList extends Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchApplications} = this.props;

    fetchApplications();
  }

  handleItemClick = (applicationId) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/${lang}/applications/${applicationId}`,
      query,
    });
  };

  render() {
    const {applications, isFetching, t, params: {applicationId}} = this.props;

    return (
      <div className={classNames('applications', {'applications--form-open': !!applicationId})}>
        <div className="applications__list">
          <Hero>
            <h1>{t('applications:title')}</h1>
          </Hero>
          <ApplicationList
            active={applicationId}
            data={applications}
            handleItemClick={this.handleItemClick}
            isFetching={isFetching}
          />
        </div>

        {applicationId &&
        <div className="applications__form">
          <HandlerForm
            applicationId={applicationId}
          />
        </div>
        }

      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        applications: getApplicationsList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchApplications,
    },
  ),
  translate(['applications'])
)(ApplicationsList);
