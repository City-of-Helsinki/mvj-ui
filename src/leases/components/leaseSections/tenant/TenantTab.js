// @flow
import React from 'react';
import get from 'lodash/get';

import Collapse from '../../../../components/Collapse';
import Tenant from './Tenant';
import {Row, Column} from 'react-foundation';
import classnames from 'classnames';

type Props = {
  tenants: Array<Object>,
  oldTenants: Array<Object>,
}

const TenantTab = ({tenants, oldTenants}: Props) => {
  let share_count = 0;
  tenants && tenants.length > 0 && tenants.map((tenant) =>
    share_count = tenant.tenant.share + share_count
  );

  return (
    <div className='lease-section'>
      {tenants && tenants.length > 0 && tenants.map((tenant, index) =>
        <Collapse key={index}
          header={
            <Row>
              <Column small={5}><span className='collapse__header-title'>{get(tenant, 'tenant.firstname')} {get(tenant, 'tenant.lastname')}</span></Column>
              <Column small={7}><span className={classnames('collapse__header-subtitle', {'alert': (share_count === tenant.tenant.share_divider)})}><i/> {get(tenant, 'tenant.share')}/{get(tenant, 'tenant.share_divider')}</span></Column>
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
              <Column small={12}><span className='collapse__header-title'>Entiset vuokralaiset</span></Column>
            </Row>
          }
        >
        </Collapse>
      }
    </div>
  );
};

export default TenantTab;
