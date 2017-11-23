// @flow
import React from 'react';
import get from 'lodash/get';

import Collapse from '../../../components/Collapse';
import {Row, Column} from 'react-foundation';

type Props = {
  tenants: Array<Object>,
  oldTenants: Array<Object>,
}
const TenantTab = ({tenants, oldTenants}: Props) => {
  console.log(oldTenants);
  return (
    <div className='tenants.tab'>
      {tenants && tenants.length > 0 && tenants.map((tenant, index) =>
        <Collapse key={index}
          header={
            <Row>
              <Column small={6}><span className='collapse__header-title'>{get(tenant, 'tenant.name')}</span></Column>
              <Column small={6}><span className='collapse__header-subtitle'>{index + 1}/{tenants.length}</span></Column>
            </Row>
          }
        >
          <h1>TenantTabContent</h1>
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
