// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import Collapse from '../../../../components/Collapse';
import TenantItem from './TenantItem';
import OtherPersonItem from './OtherPersonItem';
import {getLabelOfOption} from '../../../../util/helpers';
import {tenantsRolesOptions} from '../constants';

type Props = {
  tenant: Object,
}

const Tenant = ({tenant}: Props) => {
  const {other_persons} = tenant;

  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Vuokralainen</span></Column>
          </Row>
        }
      >
        <TenantItem customer={get(tenant, 'tenant')} />
      </Collapse>
      {other_persons && other_persons.length && other_persons.map((person, index) => {
        const {roles} = person;
        return (
          <Collapse
            key={index}
            className='collapse__secondary'
            defaultOpen={true}
            header={
              <Row>
                <Column small={6}>
                  <span className='collapse__header-title-nocap'>
                    {roles && roles.length > 0 &&
                      roles.map((role, index) => {
                        if(index > 0) {
                          return (<span key={index}>&nbsp;/ {getLabelOfOption(tenantsRolesOptions, role)}</span>);
                        }
                        return (<span key={index}>{getLabelOfOption(tenantsRolesOptions, role)}</span>);
                      })
                    }
                  </span></Column>
              </Row>
            }>
              <OtherPersonItem customer={person} />
            </Collapse>
        );
      })}
    </div>
  );
};

export default Tenant;
