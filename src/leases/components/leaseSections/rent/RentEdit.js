// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {formValueSelector, reduxForm, Field, FieldArray, FormSection} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BasicInfoEdit from './BasicInfoEdit';
import BasisOfRentsEdit from './BasisOfRentsEdit';
import ContractRentsEdit from './ContractRentsEdit';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormSectionComponent from '$components/form/FormSection';
import IndexAdjustedRents from './IndexAdjustedRents';
import FieldTypeSwitch from '$components/form/FieldTypeSwitch';
import PayableRents from './PayableRents';
import RentAdjustmentsEdit from './RentAdjustmentsEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {RentTypes} from '$src/leases/enums';
import {fetchDecisions, receiveRentsFormValid} from '$src/leases/actions';
import {getDecisions, getIsRentsFormValid} from '$src/leases/selectors';
import {getDecisionsOptions, getSearchQuery} from '$util/helpers';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisionsOptionData: Array<Object>,
  fetchDecisions: Function,
  handleSubmit: Function,
  isRentsFormValid: boolean,
  params: Object,
  receiveRentsFormValid: Function,
  rents: Object,
  valid: boolean,
}

class RentEdit extends Component {
  props: Props

  componentWillMount() {
    const {
      fetchDecisions,
      params: {leaseId},
    } = this.props;
    const query = {
      lease: leaseId,
      imit: 1000,
    };
    const search = getSearchQuery(query);
    fetchDecisions(search);
  }

  componentDidUpdate() {
    const {isRentsFormValid, receiveRentsFormValid, valid} = this.props;
    if(isRentsFormValid !== valid) {
      receiveRentsFormValid(valid);
    }
  }

  render() {
    const {attributes, decisionsOptionData, handleSubmit, rents} = this.props;
    const decisionOptions = getDecisionsOptions(decisionsOptionData);
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
                    name="rents.is_active"
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
                attributes={attributes}
                rents={rents}
                rentType={rentType}
              />
            </FormSection>
          </Collapse>

          {(rentType === RentTypes.INDEX ||
            rentType === RentTypes.FIXED ||
            rentType === RentTypes.MANUAL
          ) &&
            <Collapse
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Sopimusvuokra</h3></Column>
                </Row>
              }>
              <FieldArray
                attributes={attributes}
                component={ContractRentsEdit}
                name="rents.contract_rents"
                rentType={rentType}
              />
            </Collapse>
          }

          {(rentType === RentTypes.INDEX ||
            rentType === RentTypes.MANUAL
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
            rentType === RentTypes.FIXED ||
            rentType === RentTypes.MANUAL
          ) &&
            <Collapse
              className='no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column><h3 className='collapse__header-title'>Alennukset ja korotukset</h3></Column>
                </Row>
              }>
              <FieldArray
                attributes={attributes}
                component={RentAdjustmentsEdit}
                decisionOptions={decisionOptions}
                name="rents.rent_adjustments"
              />
            </Collapse>
          }

          {(rentType === RentTypes.INDEX ||
            rentType === RentTypes.FIXED ||
            rentType === RentTypes.MANUAL
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
        decisionsOptionData: getDecisions(state),
        isRentsFormValid: getIsRentsFormValid(state),
        rents: selector(state, 'rents'),
      };
    },
    {
      fetchDecisions,
      receiveRentsFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
  withRouter,
)(RentEdit);
