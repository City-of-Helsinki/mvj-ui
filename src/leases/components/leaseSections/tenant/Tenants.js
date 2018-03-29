// @flow
import React from 'react';

import Tenant from './Tenant';

import type {ContactList} from '$src/contacts/types';
import type {Attributes as ContactAttributes} from '$src/contacts/types';

type Props = {
  allContacts: ContactList,
  contactAttributes: ContactAttributes,
  tenants: Array<Object>,
}

const Tenants = ({
  allContacts,
  contactAttributes,
  tenants,
}: Props) => {
  return (
    <div>
      {(!tenants || !tenants.length) &&
        <p className='no-margin'>Ei vuokralaisia</p>
      }
      {tenants && !!tenants.length && tenants.map((tenant) =>
        <Tenant
          key={tenant.id}
          allContacts={allContacts}
          contactAttributes={contactAttributes}
          tenant={tenant}
        />
      )}
    </div>
  );
};

export default Tenants;
