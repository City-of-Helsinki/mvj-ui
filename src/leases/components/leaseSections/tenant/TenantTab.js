// @flow
import React from 'react';
import get from 'lodash/get';

import Collapse from '../../../../components/Collapse';
import Tenant from './Tenant';
import {Row, Column} from 'react-foundation';

type Props = {
  tenants: Array<Object>,
  oldTenants: Array<Object>,
}
const TenantTab = ({tenants, oldTenants}: Props) => {
  console.log(oldTenants);
  return (
    <div className='tenant-tab'>
      {tenants && tenants.length > 0 && tenants.map((tenant, index) =>
        <Collapse key={index}
          header={
            <Row>
              <Column small={5}><span className='collapse__header-title'>{get(tenant, 'tenant.name')}</span></Column>
              <Column small={7}><span className='collapse__header-subtitle'>{index + 1}/{tenants.length}</span></Column>
            </Row>
          }
        >
          <Tenant tenant={tenant} />
        </Collapse>
      )}
      {oldTenants && oldTenants.length > 0 &&
        <Collapse
          header={
            <Row>
              <Column small={12}><span className='collapse__header-title'>Vanhat vuokralaiset</span></Column>
            </Row>
          }
        >
        </Collapse>
      }
    </div>
  );
};

export default TenantTab;
