// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import TenantItem from './TenantItem';
import classnames from 'classnames';

// import OtherPersonItem from './OtherPersonItem';
// import {getLabelOfOption} from '$util/helpers';
// import {tenantsRolesOptions} from '../constants';

import type {ContactList} from '$src/contacts/types';
import type {Attributes as ContactAttributes} from '$src/contacts/types';

type Props = {
  allContacts: ContactList,
  contactAttributes: ContactAttributes,
  tenant: Object,
}

const Tenant = ({
  allContacts,
  contactAttributes,
  tenant,
}: Props) => {
  // const {other_persons} = tenant;
  const findContact = () => {
    if(!allContacts || !allContacts.length) {
      return {};
    }
    return allContacts.find((x) => x.id === get(tenant, 'tenant.id'));
  };

  const contact: Object = findContact();

  const getFullName = () => {
    if(!contact) {
      return '';
    }
    return contact.is_business ? contact.business_name : `${contact.last_name} ${contact.first_name}`;
  };

  return (
    <Collapse
      header={
        <Row>
          <Column small={6} medium={4} large={4}>
            <span className='collapse__header-title'>
              {getFullName()}
            </span>
          </Column>
          <Column small={6} medium={6} large={6}>
            <span className={classnames(
              'collapse__header-subtitle',
              // {'alert': (share_count !== tenant.tenant.share_divider)}
            )}>
              <i/> {get(tenant, 'share_numerator', '')} / {get(tenant, 'share_denominator', '')}
            </span>
          </Column>
        </Row>
      }
    >
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={12}><span className='collapse__header-title'>Vuokralainen</span></Column>
          </Row>
        }
      >
        <TenantItem
          contact={contact}
          contactAttributes={contactAttributes}
          tenant={tenant}
        />
      </Collapse>
    </Collapse>

    //   {other_persons && other_persons.length && other_persons.map((person, index) => {
    //     const {roles} = person;
    //     return (
    //       <Collapse
    //         key={index}
    //         className='collapse__secondary'
    //         defaultOpen={true}
    //         header={
    //           <Row>
    //             <Column small={6}>
    //               <span className='collapse__header-title-nocap'>
    //                 {roles && roles.length > 0 &&
    //                   roles.map((role, index) => {
    //                     if(index > 0) {
    //                       return (<span key={index}>&nbsp;/ {getLabelOfOption(tenantsRolesOptions, role)}</span>);
    //                     }
    //                     return (<span key={index}>{getLabelOfOption(tenantsRolesOptions, role)}</span>);
    //                   })
    //                 }
    //               </span></Column>
    //           </Row>
    //         }>
    //           <OtherPersonItem customer={person} />
    //         </Collapse>
    //     );
    //   })}
    // </div>
  );
};

export default Tenant;
