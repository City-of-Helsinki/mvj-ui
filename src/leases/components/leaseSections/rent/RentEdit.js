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
import FormSectionComponent from '../../../../components/form/FormSection';
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
    const rentType = get(rents, 'basic_info.type');
    return (
      <form onSubmit={handleSubmit}>
        <FormSectionComponent>
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

          <FormSection name="rents.basic_info">
            <h2>Vuokran perustiedot</h2>
            <BasicInfoEdit basicInfo={get(rents, 'basic_info', {})} />
          </FormSection>

          {(rentType === '0' || rentType === '2' || rentType === '4') &&
            <Row>
              <Column>
                <h2>Sopimusvuokra</h2>
                <FieldArray component={ContractRentsEdit} name="rents.contract_rents" rentType={rentType} />
              </Column>
            </Row>
          }

          {(rentType === '0' ||rentType === '4') &&
            <Row>
              <Column>
                <h2>Indeksitarkistettu vuokra</h2>
                <FieldArray
                  component={IndexAdjustedRentsEdit}
                  name="rents.index_adjusted_rents"
                />
              </Column>
            </Row>
          }

          {(rentType === '0' || rentType === '2' || rentType === '4') &&
            <Row>
              <Column>
                <h2>Alennukset ja korotukset</h2>
                <FieldArray name="rents.discounts" component={DiscountsEdit}/>
              </Column>
            </Row>
          }

          {(rentType === '0' || rentType === '2' || rentType === '4') &&
            <Row>
              <Column>
                <h2>Perittävä vuokra</h2>
                <FieldArray
                  component={ChargedRentsEdit}
                  name="rents.charged_rents"
                />
              </Column>
            </Row>
          }

          {(rentType === '0' || rentType === '1' || rentType === '2' || rentType === '4') &&
            <Row>
              <Column>
                <h2>Vuokranperusteet</h2>
                <FieldArray name="rents.criterias" component={CriteriasEdit}/>
              </Column>
            </Row>
          }
        </FormSectionComponent>
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
