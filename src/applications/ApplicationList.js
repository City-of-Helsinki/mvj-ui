// @flow
import React, {Component, PropTypes} from 'react';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';

import ApplicationForm from './ApplicationForm';
import Table from '../components/table/Table';

import {getActiveLanguage} from '../helpers';

const tableData = [
  {id: 'id1', data: {data1: 'Data 1 content', data2: 'Data 2 content', data3: 'Data 3 content'}},
  {id: 'id2', data: {data1: 'Data 1 content', data2: 'Data 2 content', data3: 'Data 3 content'}},
  {id: 'id3', data: {data1: 'Data 1 content', data2: 'Data 2 content', data3: 'Data 3 content'}},
  {id: 'id4', data: {data1: 'Data 1 content', data2: 'Data 2 content', data3: 'Data 3 content'}},
  {id: 'id5', data: {data1: 'Data 1 content', data2: 'Data 2 content', data3: 'Data 3 content'}},
];

type Props = {
  params: Object,
  t: Function,
};

class ApplicationList extends Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.object,
  };

  handleRowClick = (applicationId) => {
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
          <div className="table-scroll">
            <Table
              data={tableData}
              horizontalScroll={true}
              onRowClick={(id) => this.handleRowClick(id)}
              headers={['Data 1', 'Data 2', 'Data 4']}
            />
          </div>
        </div>

        {applicationId &&
        <ApplicationForm
          applicationId={applicationId}
        />
        }

      </div>
    );
  }
}

export default flowRight(
  translate(['applications'])
)(ApplicationList);
