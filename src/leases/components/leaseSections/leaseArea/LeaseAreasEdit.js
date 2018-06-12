// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import FormSection from '$components/form/FormSection';
import PlotItemsEdit from './PlotItemsEdit';
import PlanUnitItemsEdit from './PlanUnitItemsEdit';
import RemoveButton from '$components/form/RemoveButton';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags} from '$src/leases/actions';
import {AreaLocation, FormNames} from '$src/leases/enums';
import {getAreasSum, getContentLeaseAreas} from '$src/leases/helpers';
import {formatNumber} from '$util/helpers';
import {getAttributes, getCurrentLease, getErrorsByFormName} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type AddressesProps = {
  attributes: Attributes,
  fields: any,
}

const AddressItems = ({attributes, fields}: AddressesProps): Element<*> => {
  return (
    <div>
      <Row>
        <Column small={6} large={4}>
          <FormFieldLabel required>Osoite</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel>Postinumero</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel>Kaupunki</FormFieldLabel>
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((field, index) =>
        <Row key={index}>
          <Column small={6} large={4}>
            <FormField
              fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.address')}
              name={`${field}.address`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={3} large={2}>
            <FormField
              fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.postal_code')}
              name={`${field}.postal_code`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={2} large={2}>
            <FormField
              fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.city')}
              name={`${field}.city`}
              overrideValues={{
                label: '',
              }}
            />
          </Column>
          <Column small={1}>
            <RemoveButton
              onClick={() => fields.remove(index)}
              title="Poista osoite"
            />
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää osoite'
            onClick={() => fields.push({})}
            title='Lisää osoite'
          />
        </Column>
      </Row>
    </div>
  );
};

type AreaItemProps = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
}

const LeaseAreaItems = ({
  attributes,
  errors,
  fields,
}: AreaItemProps): Element<*> => {
  return (
    <div>
      {fields && !!fields.length && fields.map((area, index) => {
        const areaErrors = get(errors, area);
        return (
          <Collapse
            key={index}
            defaultOpen={true}
            hasErrors={!isEmpty(areaErrors)}
            headerTitle={
              <h3 className='collapse__header-title'>Kohde {index + 1}</h3>
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
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.identifier')}
                    name={`${area}.identifier`}
                    overrideValues={{
                      label: 'Kohteen tunnus',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.type')}
                    name={`${area}.type`}
                    overrideValues={{
                      label: 'Määritelmä',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.area')}
                    name={`${area}.area`}
                    overrideValues={{
                      label: 'Pinta-ala',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.location')}
                    name={`${area}.location`}
                    overrideValues={{
                      label: 'Sijainti',
                    }}
                  />
                </Column>
              </Row>

              <FieldArray
                attributes={attributes}
                component={AddressItems}
                name={`${area}.addresses`}
              />

            </BoxContentWrapper>
            <Row>
              <Column small={12} large={6}>
                <FieldArray
                  buttonTitle='Lisää kiinteistö/määräala'
                  component={PlotItemsEdit}
                  errors={errors}
                  name={`${area}.plots_contract`}
                  title='Kiinteistöt / määräalat sopimuksessa'
                />
              </Column>
              <Column small={12} large={6}>
                <FieldArray
                  buttonTitle='Lisää kiinteistö/määräala'
                  component={PlotItemsEdit}
                  errors={errors}
                  name={`${area}.plots_current`}
                  title='Kiinteistöt / määräalat nykyhetkellä'
                />
              </Column>
            </Row>
            <Row>
              <Column small={12} large={6}>
                <FieldArray
                  attributes={attributes}
                  buttonTitle='Lisää kaavayksikkö'
                  component={PlanUnitItemsEdit}
                  errors={errors}
                  name={`${area}.plan_units_contract`}
                  title='Kaavayksiköt sopimuksessa'
                />
              </Column>
              <Column small={12} large={6}>
                <FieldArray
                  attributes={attributes}
                  buttonTitle='Lisää kaavayksikkö'
                  component={PlanUnitItemsEdit}
                  errors={errors}
                  name={`${area}.plan_units_current`}
                  title='Kaavayksiköt nykyhetkellä'
                />
              </Column>
            </Row>
          </Collapse>
        );
      })}
      <Row>
        <Column>
          <AddButton
            label='Lisää kohde'
            onClick={() => fields.push({
              addresses: [{}],
              location: AreaLocation.SURFACE,

            })}
            title='Lisää kohde'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  errors: ?Object,
  handleSubmit: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  areasSum: ?number,
  currentLease: ?Lease,
}

class LeaseAreasEdit extends PureComponent<Props, State> {
  state = {
    areasSum: null,
    currentLease: null,
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.currentLease) {
      const areas = getContentLeaseAreas(props.currentLease);
      return {
        areasSum: getAreasSum(areas),
        currentLease: props.currentLease,
      };
    }
    return null;
  }


  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LEASE_AREAS]: this.props.valid,
      });
    }
  }

  render () {
    const {attributes, errors, handleSubmit} = this.props;
    const {areasSum} = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <h2>Vuokra-alue</h2>
        <RightSubtitle
          text={<span>{formatNumber(areasSum) || '-'} m<sup>2</sup></span>}
        />
        <Divider />

        <FormSection>
          <FieldArray
            attributes={attributes}
            component={LeaseAreaItems}
            errors={errors}
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
        errors: getErrorsByFormName(state, formName),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(LeaseAreasEdit);
