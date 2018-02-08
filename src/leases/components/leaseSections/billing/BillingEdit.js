// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import BillsTableEdit from './BillsTableEdit';
import FieldTypeSwitch from '../../../../components/form/FieldTypeSwitch';

type Props = {
  billing: Object,
  dispatch: Function,
  handleSubmit: Function,
}

const BillingEdit = ({billing, dispatch, handleSubmit}: Props) => {
  return (
    <form onSubmit={handleSubmit} className='lease-section-edit'>
      <Row>
        <Column medium={9}><h1>Laskutus</h1></Column>
        <Column medium={3}>
          <Field
            component={FieldTypeSwitch}
            name="billing.billing_started"
            optionLabel="Laskutus käynnissä"
          />
        </Column>
      </Row>
      <Row><Column><div className="separator-line"></div></Column></Row>
      <Row><Column><h2>Laskut</h2></Column></Row>
      <Row>
        <Column>
          <FieldArray
            name="billing.bills"
            bills={get(billing, 'bills')}
            component={BillsTableEdit}
            dispatch={dispatch}
            headers={[
              'Vuokraaja',
              'Osuus',
              'Eräpäivä',
              'Laskun numero',
              'Laskutuskausi',
              'Saamislaji',
              'Laskun tila',
              'Laskutettu',
              'Maksamatta',
              'Tiedote',
              'Läh. SAP:iin',
            ]}
          />
        </Column>
      </Row>
    </form>
  );
};

const formName = 'billing-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect((state) => {
    return {
      billing: selector(state, 'billing'),
    };
  }),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(BillingEdit);
