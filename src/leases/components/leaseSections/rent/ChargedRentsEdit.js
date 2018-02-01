// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import TableFixedHeader from '../../../../components/TableFixedHeader';

const getTableBody = (fields) => {
  if(fields && fields.length > 0) {
    return (
      <tbody>
        {fields.map((item, index) => (
          <tr key={index}>
            <td>
              <Field
                component={FieldTypeText}
                inputClassName="no-margin"
                name={`${item}.rent`}
              />
            </td>
            <td style={{width: '202px'}}>
              <Row>
                <Column style={{padding: '0 0.25rem 0 0.9375rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    name={`${item}.start_date`}
                  />
                </Column>
                <Column style={{padding: '0 0.9375rem 0 0.25rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    name={`${item}.end_date`}
                  />
                </Column>
              </Row>
            </td>
            <td>
              <Field
                component={FieldTypeText}
                inputClassName="no-margin"
                name={`${item}.difference`}
              />
            </td>
            <td>
              <Field
                component={FieldTypeText}
                inputClassName="no-margin"
                name={`${item}.calendar_year_rent`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
  else {
    return (
      <tbody></tbody>
    );
  }
};

type Props = {
  fields: any,
}

const ChargedRentsEdit = ({fields}: Props) => {
  return (
    <div>
      <TableFixedHeader
        headers={[
          'Perittävä vuokra (€)',
          'Voimassaoloaika',
          'Nousu %',
          'Kalenterivuosivuokra',
        ]}
        body={
          getTableBody(fields)
        }
      />
    </div>
  );
};

export default ChargedRentsEdit;
