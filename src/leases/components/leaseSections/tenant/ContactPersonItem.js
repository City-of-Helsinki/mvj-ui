// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import * as helpers from '../../../helpers';
import * as utilHelpers from '../../../../util/helpers';

type Props = {
  customer: Object,
};

const ContactPersonItem = ({customer}: Props) => {
  const formatedDate = utilHelpers.formatDate(customer.start_date);
  const fullAddress = helpers.getFullAddress(customer);

  return (
    <div className='section-item'>
      <Row>
        <Column medium={5}>
          <Row>
            <Column>
              <p className='subtitle'>{get(customer, 'lastname')} {get(customer, 'firstname')}</p>
              <div className='contact'>
                <p>{fullAddress}</p>
                <p>{get(customer, 'phone')}</p>
                <p>{get(customer, 'email')}</p>
              </div>
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
                  <label>Kieli</label>
                  <p>{get(customer, 'language', '')}</p>

                  <label>Alkupäivämäärä</label>
                  <p>{formatedDate}</p>
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
                </Column>
              </Row>
            </Column>
          </Row>
        </Column>
      </Row>
    </div>
  );
};

export default ContactPersonItem;
