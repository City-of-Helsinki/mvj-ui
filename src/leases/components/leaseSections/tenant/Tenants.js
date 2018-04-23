// @flow
import React from 'react';
import {connect} from 'react-redux';

import Tenant from './Tenant';
import {getContentTenants} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
}

const Tenants = ({
  currentLease,
}: Props) => {
  const tenants = getContentTenants(currentLease);

  return (
    <div>
      {(!tenants || !tenants.length) &&
        <p className='no-margin'>Ei vuokralaisia</p>
      }
      {tenants && !!tenants.length && tenants.map((tenant) =>
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
