// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AuthorizationError from '$components/authorization/AuthorizationError';
import GreenBox from '$components/content/GreenBox';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SortableTable from '$components/table/SortableTable';
import {PermissionMissingTexts} from '$src/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {hasPermissions} from '$util/helpers';
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from '$src/usersPermissions/selectors';
import {withBatchrunJobTabAttributes} from '$components/attributes/BatchrunJobsTabAttributes';

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
  isFetchingBatchrunJobAttributes: boolean,
  isFetchingUsersPermissions: boolean,
  usersPermissions: UsersPermissionsType,
}

class Jobs extends PureComponent<Props> {
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
      isFetchingBatchrunJobAttributes,
      isFetchingUsersPermissions,
      usersPermissions,
    } = this.props;
    const columns = this.getColumns();

    if(isFetchingBatchrunJobAttributes || isFetchingUsersPermissions) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;

    if(isEmpty(usersPermissions)) return null;

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
  withBatchrunJobTabAttributes,
  connect(
    (state) => {
      return {
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
  ),
)(Jobs);
