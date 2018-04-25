// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import PlotItemsEdit from './PlotItemsEdit';
import PlanUnitItemsEdit from './PlanUnitItemsEdit';
import RemoveButton from '$components/form/RemoveButton';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveLeaseAreasFormValid} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getAreasSum, getContentLeaseAreas} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes, getCurrentLease, getIsLeaseAreasFormValid} from '$src/leases/selectors';
import {genericValidator} from '$components/form/validations';

import type {Attributes, Lease} from '$src/leases/types';

type AreaItemProps = {
  attributes: Attributes,
  fields: any,
}

const LeaseAreaItems = ({
  attributes,
  fields,
}: AreaItemProps) => {
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <div>
      {fields && !!fields.length && fields.map((area, index) => {
        return (
          <Collapse
            key={index}
            defaultOpen={true}
            headerTitle={
              <h3 className='collapse__header-title'>Vuokra-alue {index + 1}</h3>
            }
          >
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright'
                onClick={() => fields.remove(index)}
                title="Poista vuokra-alue"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Kohteen tunnus'
                    name={`${area}.identifier`}
                    type="text"
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'lease_areas.child.children.identifier')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Selite'
                    name={`${area}.type`}
                    options={typeOptions}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'lease_areas.child.children.type')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label="Pinta-ala"
                    name={`${area}.area`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'lease_areas.child.children.area')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Sijainti'
                    name={`${area}.location`}
                    options={locationOptions}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'lease_areas.child.children.location')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={12} large={4}>
                  <Field
                    component={FieldTypeText}
                    label="Osoite"
                    name={`${area}.address`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'lease_areas.child.children.address')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label="Postinumero"
                    name={`${area}.postal_code`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'lease_areas.child.children.postal_code')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label="Kaupunki"
                    name={`${area}.city`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'lease_areas.child.children.city')),
                    ]}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
            <FieldArray
              buttonTitle='Lisää kiinteistö/määräala sopimushetkellä'
              component={PlotItemsEdit}
              name={`${area}.plots_contract`}
              title='Kiinteistöt / määräalat sopimushetkellä'
            />
            <FieldArray
              buttonTitle='Lisää kiinteistö/määräala nykyhetkellä'
              component={PlotItemsEdit}
              name={`${area}.plots_current`}
              title='Kiinteistöt / määräalat nykyhetkellä'
            />
            <FieldArray
              buttonTitle='Lisää kaavayksiköt sopimushetkellä'
              component={PlanUnitItemsEdit}
              name={`${area}.plan_units_contract`}
              title='Kaavayksiköt sopimushetkellä'
            />
            <FieldArray
              buttonTitle='Lisää kaavayksiköt nykyhetkellä'
              component={PlanUnitItemsEdit}
              name={`${area}.plan_units_current`}
              title='Kaavayksiköt nykyhetkellä'
            />
          </Collapse>
        );
      })}
      <Row>
        <Column>
          <AddButton
            label='Lisää uusi kohde'
            onClick={() => fields.push({})}
            title='Lisää uusi kohde'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  handleSubmit: Function,
  isLeaseAreasFormValid: boolean,
  receiveLeaseAreasFormValid: Function,
  valid: boolean,
}

class LeaseAreasEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isLeaseAreasFormValid, receiveLeaseAreasFormValid, valid} = this.props;
    if(isLeaseAreasFormValid !== valid) {
      receiveLeaseAreasFormValid(valid);
    }
  }

  render () {
    const {attributes, currentLease, handleSubmit} = this.props;
    const areas = getContentLeaseAreas(currentLease);
    const areasSum = getAreasSum(areas);

    return (
      <form onSubmit={handleSubmit}>
        <h2>Vuokra-alue</h2>
        <RightSubtitle
          text={<span>{areasSum || '-'} m<sup>2</sup></span>}
        />
        <Divider />

        <FormSection>
          <FieldArray
            attributes={attributes}
            component={LeaseAreaItems}
            name="lease_areas"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.LEASE_AREAS;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        isLeaseAreasFormValid: getIsLeaseAreasFormValid(state),
      };
    },
    {
      receiveLeaseAreasFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(LeaseAreasEdit);
