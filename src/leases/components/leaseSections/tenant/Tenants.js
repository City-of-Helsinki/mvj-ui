// @flow
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import Divider from '$components/content/Divider';
import Tenant from './Tenant';
import {getContentTenantsFormData} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
}

const Tenants = ({
  currentLease,
}: Props) => {
  const tenantsData = getContentTenantsFormData(currentLease);
  const tenants = get(tenantsData, 'tenants', []);
  const tenantsArchived = get(tenantsData, 'tenantsArchived', []);

  return (
    <div>
      <h2>Vuokralaiset</h2>
      <Divider />
      {(!tenants.length) &&
        <p className='no-margin'>Ei vuokralaisia</p>
      }
      {!!tenants.length && tenants.map((tenant) =>
        <Tenant
          key={tenant.id}
          tenant={tenant}
        />
      )}
      {!!tenantsArchived.length &&   <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
      {!!tenantsArchived.length && tenantsArchived.map((tenant) =>
        <Tenant
          key={tenant.id}
          tenant={tenant}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
    };
  }
)(Tenants);
