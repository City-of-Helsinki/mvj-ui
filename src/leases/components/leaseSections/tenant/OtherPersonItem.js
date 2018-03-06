// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import {formatDate} from '$util/helpers';
import {getFullAddress} from '$src/leases/helpers';

type AddressProps = {
  address: ?string,
  comment: ?string,
  email: ?string,
  name: ?string,
  phone: ?string,
  protectionOrder: ?boolean,
  socialSecurityNumber: ?string,
}

const Address = ({
  address,
  comment,
  email,
  name,
  phone,
  protectionOrder,
  socialSecurityNumber,
}: AddressProps) =>
  <div className='tenants__address'>
    {name && <p className='subtitle'>{name}</p>}
    <div className='contact'>
      {address && <p>{address}</p>}
      {phone && <p>{phone}</p>}
      {email && <p>{email}</p>}
    </div>
    {socialSecurityNumber && <p>{socialSecurityNumber}</p>}
    {protectionOrder && <p className='alert'><i/><span>Turvakielto</span></p>}
    <p className='comment'>{comment || '-'}</p>
  </div>;

type Props = {
  customer: Object,
};

const OtherPersonItem = ({customer}: Props) => {
  const formatedDate = formatDate(customer.start_date);
  const fullAddress = getFullAddress(customer);

  return (
    <div className='section-item'>
      <Row>
        <Column medium={4}>
          <Address
            address={fullAddress}
            comment={get(customer, 'comment')}
            email={get(customer, 'email')}
            name={`${get(customer, 'lastname')} ${get(customer, 'firstname')}`}
            phone={get(customer, 'phone')}
            protectionOrder={get(customer, 'protection_order')}
            socialSecurityNumber={get(customer, 'social_security_number')}
          />
        </Column>
        <Column medium={4}>
          <label>Kieli</label>
          <p>{get(customer, 'language', '')}</p>
          <label>Alkupäivämäärä</label>
          <p>{formatedDate}</p>
        </Column>
        <Column medium={4}>
          <label>Asiakasnumero</label>
          <p>{get(customer, 'customer_id', '')}</p>
          <label>SAP asiakasnumero</label>
          <p>{get(customer, 'SAP_customer_id', '')}</p>
        </Column>
      </Row>
    </div>
  );
};

export default OtherPersonItem;
