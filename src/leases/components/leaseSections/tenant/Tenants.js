// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';

import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import Tenant from './Tenant';
import {getContentTenantsFormData} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
}

const Tenants = ({currentLease}: Props) => {
  const tenantsData = getContentTenantsFormData(currentLease);
  const tenants = tenantsData.tenants;
  const tenantsArchived = tenantsData.tenantsArchived;

  return (
    <Fragment>
      <h2>Vuokralaiset</h2>
      <Divider />
      {(!tenants.length) && <FormText className='no-margin'>Ei vuokralaisia</FormText>}
      {!!tenants.length && tenants.map((tenant) => <Tenant key={tenant.id} tenant={tenant} />)}

      {!!tenantsArchived.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
      {!!tenantsArchived.length && tenantsArchived.map((tenant) => <Tenant key={tenant.id} tenant={tenant} />)}
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
    };
  }
)(Tenants);
