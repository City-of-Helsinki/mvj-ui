// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray, FormSection} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BasicInfoEdit from './BasicInfoEdit';
import BasisOfRentsEdit from './BasisOfRentsEdit';
import ContractRentsEdit from './ContractRentsEdit';
import Collapse from '$components/collapse/Collapse';
import DiscountsEdit from './DiscountsEdit';
import Divider from '$components/content/Divider';
import FormSectionComponent from '$components/form/FormSection';
import IndexAdjustedRents from './IndexAdjustedRents';
import FieldTypeSwitch from '$components/form/FieldTypeSwitch';
import PayableRents from './PayableRents';
import RightSubtitle from '$components/content/RightSubtitle';
import {RentTypes} from '$src/leases/enums';
import {receiveRentsFormValid} from '$src/leases/actions';
import {getIsRentsFormValid} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  handleSubmit: Function,
  isRentsFormValid: boolean,
  receiveRentsFormValid: Function,
  rents: Object,
  valid: boolean,
}

class RentEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isRentsFormValid, receiveRentsFormValid, valid} = this.props;
    if(isRentsFormValid !== valid) {
      receiveRentsFormValid(valid);
    }
  }

  render() {
    const {attributes, handleSubmit, rents} = this.props;
    const rentType = get(rents, 'type');

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
            <FormSection name='rents'>
              <BasicInfoEdit
                basicInfo={get(rents, 'basic_info', {})}
              />
            </FormSection>
          </Collapse>

          {(rentType === RentTypes.INDEX ||
            rentType === '2' ||
            rentType === '4'
          ) &&
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

          {(rentType === RentTypes.INDEX ||
            rentType === '4'
          ) &&
            <Collapse
              className='no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Indeksitarkistettu vuokra</h3></Column>
                </Row>
              }>
              <IndexAdjustedRents
                attributes={attributes}
                indexAdjustedRents={get(rents, 'index_adjusted_rents', [])}
              />
            </Collapse>
          }

          {(rentType === RentTypes.INDEX ||
            rentType === '2' ||
            rentType === '4'
          ) &&
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

          {(rentType === RentTypes.INDEX ||
            rentType === '2' ||
            rentType === '4'
          ) &&
            <Collapse
              className='no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Perittävä vuokra</h3></Column>
                </Row>
              }>
              <PayableRents
                payableRents={get(rents, 'payable_rents', [])}
              />
            </Collapse>
          }

          {(rentType === RentTypes.INDEX ||
            rentType === '1' ||
            rentType === '2' ||
            rentType === '4'
          ) &&
            <Collapse
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Vuokranperusteet</h3></Column>
                </Row>
              }>
              <FieldArray
                attributes={attributes}
                component={BasisOfRentsEdit}
                name="basis_of_rents"
              />
            </Collapse>
          }
        </FormSectionComponent>
      </form>
    );
  }
}

const formName = 'rents-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        isRentsFormValid: getIsRentsFormValid(state),
        rents: selector(state, 'rents'),
      };
    },
    {
      receiveRentsFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(RentEdit);
