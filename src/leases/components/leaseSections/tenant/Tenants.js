// @flow
import React from 'react';

import Tenant from './Tenant';

import type {ContactList} from '$src/contacts/types';
import type {Attributes as ContactAttributes} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  tenants: Array<Object>,
}

const Tenants = ({
  allContacts,
  attributes,
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
          attributes={attributes}
          contactAttributes={contactAttributes}
          tenant={tenant}
        />
      )}
    </div>
  );
};

export default Tenants;
