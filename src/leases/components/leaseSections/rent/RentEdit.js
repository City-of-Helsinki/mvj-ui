// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray, FormSection} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BasicInfoEdit from './BasicInfoEdit';
import ContractRentsEdit from './ContractRentsEdit';
import ChargedRentsEdit from './ChargedRentsEdit';
import CriteriasEdit from './CriteriasEdit';
import DiscountsEdit from './DiscountsEdit';
import IndexAdjustedRentsEdit from './IndexAdjustedRentsEdit';
import FieldTypeSwitch from '../../../../components/form/FieldTypeSwitch';

type Props = {
  handleSubmit: Function,
  rents: Object,
}

class RentEdit extends Component {
  props: Props

  render() {
    const {handleSubmit, rents} = this.props;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <Row>
          <Column medium={9}><h1>Vuokra</h1></Column>
          <Column medium={3}>
            <Field
              component={FieldTypeSwitch}
              name="rents.rent_info_ok"
              optionLabel="Vuokratiedot kunnossa"
            />
          </Column>
        </Row>
        <Row><Column><div className="separator-line no-margin"></div></Column></Row>
        <Row><Column><h2>Vuokranperusteet</h2></Column></Row>
        <Row>
          <Column>
            <FieldArray name="rents.criterias" component={CriteriasEdit}/>
          </Column>
        </Row>

        <Row><Column><h2>Alennukset ja korotukset</h2></Column></Row>
        <Row>
          <Column>
            <FieldArray name="rents.discounts" component={DiscountsEdit}/>
          </Column>
        </Row>

        <Row><Column><h2>Vuokran perustiedot</h2></Column></Row>
        <FormSection name="rents.basic_info">
          <BasicInfoEdit basicInfo={get(rents, 'basic_info', {})} />
        </FormSection>

        <Row><Column><h2>Sopimusvuokra</h2></Column></Row>
        <Row>
          <Column>
            <FieldArray name="rents.contract_rents" component={ContractRentsEdit}/>
          </Column>
        </Row>

        <Row>
          <Column medium={6}>
            <h2>Indeksitarkistettu vuokra</h2>
            <FieldArray
              component={IndexAdjustedRentsEdit}
              name="rents.index_adjusted_rents"
            />
          </Column>
          <Column medium={6}>
            <h2>Perittävä vuokra</h2>
            <FieldArray
              component={ChargedRentsEdit}
              name="rents.charged_rents"
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'rent-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        rents: selector(state, 'rents'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(RentEdit);
