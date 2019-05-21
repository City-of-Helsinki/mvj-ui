// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import AuthorizationError from '$components/authorization/AuthorizationError';
import GreenBox from '$components/content/GreenBox';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SortableTable from '$components/table/SortableTable';
import {PermissionMissingTexts} from '$src/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {hasPermissions} from '$util/helpers';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {withBatchrunScheduledJobTabAttributes} from '$components/attributes/BatchrunScheduledJobsTabAttributes';

import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

const data = [
  {
    id: 1,
    status: 'Käytössä',
    months: 'Kaikki',
    days: '1-7',
    week_day: 'su',
    hours: 4,
    minutes: 20,
    text: 'Viitekorkojen päivitys',
  },
  {
    id: 2,
    status: 'Käytössä',
    months: 'Kaikki',
    days: '1-7',
    week_day: 'su',
    hours: 4,
    minutes: 20,
    text: 'Viitekorkojen päivitys',
  },
  {
    id: 3,
    status: 'Käytössä',
    months: 'Kaikki',
    days: '1-7',
    week_day: 'su',
    hours: 4,
    minutes: 20,
    text: 'Viitekorkojen päivitys',
  },
];

type Props = {
  isFetchingBatchrunScheduledJobAttributes: boolean,
  usersPermissions: UsersPermissionsType,
}

class ScheduledJobs extends PureComponent<Props> {
  getColumns = () => {
    const columns = [];

    // TODO: Set correct columns when API is ready
    columns.push({
      key: 'id',
      text: '',
    });

    columns.push({
      key: 'status',
      text: 'Status',
    });

    columns.push({
      key: 'months',
      text: 'Kuukaudet',
    });

    columns.push({
      key: 'days',
      text: 'Päivät',
    });

    columns.push({
      key: 'week_day',
      text: 'Viikonpäivä',
    });

    columns.push({
      key: 'hours',
      text: 'tunnit',
    });

    columns.push({
      key: 'minutes',
      text: 'Minuutit',
    });

    columns.push({
      key: 'text',
      text: 'Työ',
    });

    return columns;
  }
  render() {
    const {
      isFetchingBatchrunScheduledJobAttributes,
      usersPermissions,
    } = this.props;
    const columns = this.getColumns();

    if(isFetchingBatchrunScheduledJobAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_JOB)) return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;

    return(
      <GreenBox>
        <SortableTable
          columns={columns}
          data={data}
          style={{marginBottom: 10}}
        />
      </GreenBox>
    );
  }
}

export default flowRight(
  withBatchrunScheduledJobTabAttributes,
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
      };
    },
  ),
)(ScheduledJobs);
