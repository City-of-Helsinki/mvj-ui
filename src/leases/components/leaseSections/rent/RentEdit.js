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
import Collapse from '$components/collapse/Collapse';
import CriteriasEdit from './CriteriasEdit';
import DiscountsEdit from './DiscountsEdit';
import Divider from '$components/content/Divider';
import FormSectionComponent from '$components/form/FormSection';
import IndexAdjustedRentsEdit from './IndexAdjustedRentsEdit';
import FieldTypeSwitch from '$components/form/FieldTypeSwitch';
import RightSubtitle from '$components/content/RightSubtitle';

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
            <Column>
              <h2>Vuokra</h2>
              <RightSubtitle
                text={
                  <Field
                    component={FieldTypeSwitch}
                    name="rents.rent_info_ok"
                    optionLabel="Vuokratiedot kunnossa"
                  />
                }
              />
            </Column>
          </Row>
          <Divider />

          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Vuokran perustiedot</h3></Column>
              </Row>
            }>
            <FormSection name="rents.basic_info">
              <BasicInfoEdit basicInfo={get(rents, 'basic_info', {})} />
            </FormSection>
          </Collapse>

          {(rentType === '0' || rentType === '2' || rentType === '4') &&
            <Collapse
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Sopimusvuokra</h3></Column>
                </Row>
              }>
              <FieldArray component={ContractRentsEdit} name="rents.contract_rents" rentType={rentType} />
            </Collapse>
          }

          {(rentType === '0' ||rentType === '4') &&
            <Collapse
              className='no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Indeksitarkistettu vuokra</h3></Column>
                </Row>
              }>
              <FieldArray
                component={IndexAdjustedRentsEdit}
                name="rents.index_adjusted_rents"
              />
            </Collapse>
          }

          {(rentType === '0' || rentType === '2' || rentType === '4') &&
            <Collapse
              className='no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Alennukset ja korotukset</h3></Column>
                </Row>
              }>
              <FieldArray name="rents.discounts" component={DiscountsEdit}/>
            </Collapse>
          }

          {(rentType === '0' || rentType === '2' || rentType === '4') &&
            <Collapse
              className='no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Perittävä vuokra</h3></Column>
                </Row>
              }>
              <FieldArray
                component={ChargedRentsEdit}
                name="rents.charged_rents"
              />
            </Collapse>
          }

          {(rentType === '0' || rentType === '1' || rentType === '2' || rentType === '4') &&
            <Collapse
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Vuokranperusteet</h3></Column>
                </Row>
              }>
              <FieldArray name="rents.criterias" component={CriteriasEdit}/>
            </Collapse>
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
