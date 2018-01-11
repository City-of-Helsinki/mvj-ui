// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import {formatDate} from '../../../../util/helpers';
import {getFullAddress} from '../../../helpers';

type Props = {
  customer: Object,
};

const TenantItem = ({customer}: Props) => {
  const formatedDate = formatDate(customer.start_date);
  const fullAddress = getFullAddress(customer);

  return (
    <div className='section-item'>
      <Row>
        <Column medium={5}>
          <Row>
            <Column>
              <p className='subtitle'>{get(customer, 'name')}</p>
              <div className='contact'>
                <p>{fullAddress}</p>
                <p>{get(customer, 'phone')}</p>
                <p>{get(customer, 'email')}</p>
              </div>
              <p>{get(customer, 'social_security_number')}</p>
              {get(customer, 'protection_order') && <p className='alert'><i/><span>Turvakielto</span></p>}

              <p className='comment'>{get(customer, 'comment')}</p>
            </Column>
          </Row>

        </Column>
        <Column medium={7}>
          <Row>
            <Column medium={6}>
              <Row>
                <Column>
                  <label>Osuus murtolukuina</label>
                  <p>{get(customer, 'share', '')}/{get(customer, 'share_divider', '')}</p>

                  <label>Kieli</label>
                  <p>{get(customer, 'language', '')}</p>

                  <label>Aika</label>
                  <p>{formatedDate}</p>

                  <label>Viite</label>
                  <p>{get(customer, 'reference', '')}</p>
                </Column>
              </Row>
            </Column>

            <Column medium={6}>
              <Row>
                <Column>
                  <label>Asiakasnumero</label>
                  <p>{get(customer, 'customer_id', '')}</p>

                  <label>SAP asiakasnumero</label>
                  <p>{get(customer, 'SAP_customer_id', '')}</p>

                  <label>ovt-tunnus</label>
                  <p>{get(customer, 'ovt_identifier', '')}</p>

                  <label>Kumppanikoodi</label>
                  <p>{get(customer, 'partner_code', '')}</p>
                </Column>
              </Row>
            </Column>
          </Row>
        </Column>
      </Row>
    </div>
  );
};

export default TenantItem;
