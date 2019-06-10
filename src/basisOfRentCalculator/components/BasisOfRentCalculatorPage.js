// @flow 
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import AuthorizationError from '$components/authorization/AuthorizationError';
import BasisOfRentCalculatorForm from './BasisOfRentCalculatorForm';
import ContentContainer from '$components/content/ContentContainer';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {PermissionMissingTexts} from '$src/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  hasPermissions,
  setPageTitle,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions} from '$src/usersPermissions/selectors';
import {withLeaseAttributes} from '$components/attributes/LeaseAttributes';

import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  isFetchingLeaseAttributes: boolean,
  isFetchingUsersPermissions: boolean,
  receiveTopNavigationSettings: Function,
  usersPermissions: UsersPermissionsType,
}

class BasisOfRentCalculatorPage extends PureComponent<Props> {
  componentDidMount() {
    const {receiveTopNavigationSettings} = this.props;

    setPageTitle('Vuokralaskuri');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.BASIS_OF_RENT_CALCULATOR),
      pageTitle: 'Vuokralaskuri',
      showSearch: false,
    });
  }

  render() {
    const {
      isFetchingLeaseAttributes, 
      isFetchingUsersPermissions,
      usersPermissions,
    } = this.props;

    if(isFetchingLeaseAttributes || isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!usersPermissions) return null;

    if(!hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.BASIS_OF_RENT_CALCULATOR} /></PageContainer>;
    return(
      <PageContainer hasTabs>
        <ContentContainer>
          <BasisOfRentCalculatorForm/>
        </ContentContainer>
      </PageContainer>
    );
  }
}

export default flowRight(
  withLeaseAttributes,
  connect(
    (state) => {
      return {
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      receiveTopNavigationSettings,
    }
  ),
)(BasisOfRentCalculatorPage);
