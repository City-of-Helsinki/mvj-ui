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
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import PlotItemsEdit from './PlotItemsEdit';
import PlanUnitItemsEdit from './PlanUnitItemsEdit';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {genericValidator} from '$components/form/validations';
import {getIsLeaseAreasFormValid} from '../../../selectors';
import {receiveLeaseAreasFormValid} from '../../../actions';

type AreaItemProps = {
  attributes: Object,
  fields: any,
}

const LeaseAreaItem = ({
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
              attributes={attributes}
              buttonTitle='Lisää kiinteistö/määräala sopimushetkellä'
              component={PlotItemsEdit}
              name={`${area}.plots_contract`}
              title='Kiinteistöt / määräalat sopimushetkellä'
            />
            <FieldArray
              attributes={attributes}
              buttonTitle='Lisää kiinteistö/määräala nykyhetkellä'
              component={PlotItemsEdit}
              name={`${area}.plots_current`}
              title='Kiinteistöt / määräalat nykyhetkellä'
            />
            <FieldArray
              attributes={attributes}
              buttonTitle='Lisää kaavayksiköt sopimushetkellä'
              component={PlanUnitItemsEdit}
              name={`${area}.plan_units_contract`}
              title='Kaavayksiköt sopimushetkellä'
            />
            <FieldArray
              attributes={attributes}
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
  areas: Array<Object>,
  attributes: Object,
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
    const {areas, attributes, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            areas={areas}
            attributes={attributes}
            component={LeaseAreaItem}
            name="lease_areas"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = 'lease-areas-form';

export default flowRight(
  connect(
    (state) => {
      return {
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
