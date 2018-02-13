// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import TableFixedHeader from '../../../../components/TableFixedHeader';
import {rentIndexAdjustedRentPurposeOptions} from '../constants';


const getTableBody = (fields) => {
  if(fields && fields.length > 0) {
    return (
      <tbody>
        {fields.map((item, index) => (
          <tr key={index}>
            <td style={{width: '25%'}}>
              <Field
                component={FieldTypeText}
                inputClassName="width-small no-margin"
                name={`${item}.rent`}
              />
            </td>
            <td style={{width: '25%'}}>
              <Field
                component={FieldTypeSelect}
                className="no-margin"
                name={`${item}.purpose`}
                options={rentIndexAdjustedRentPurposeOptions}
              />
            </td>
            <td style={{width: '25%'}}>
              <Row style={{width: '250px'}}>
                <Column style={{padding: '0 0.25rem 0 0.9375rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    className="width-small no-margin"
                    name={`${item}.start_date`}
                  />
                </Column>
                <Column style={{padding: '0 0.9375rem 0 0.25rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    className="width-small no-margin"
                    name={`${item}.end_date`}
                  />
                </Column>
              </Row>
            </td>
            <td style={{width: '25%'}}>
              <Field
                component={FieldTypeText}
                inputClassName="width-xsmall no-margin"
                name={`${item}.calculation_factor`}
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

const IndexAdjustedRentsEdit = ({fields}: Props) => {
  return (
    <div>
      <TableFixedHeader
        headers={[
          'Ind. tark. vuokra (€)',
          'Käyttötarkoitus',
          'Voimassaoloaika',
          'Laskentak.',
        ]}
        body={
          getTableBody(fields)
        }
      />
    </div>
  );
};

export default IndexAdjustedRentsEdit;
