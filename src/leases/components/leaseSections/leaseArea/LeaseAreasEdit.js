// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';
import PlotItemsEdit from './PlotItemsEdit';
import PlanUnitItemsEdit from './PlanUnitItemsEdit';
import RemoveButton from '$components/form/RemoveButton';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveLeaseAreasFormValid} from '$src/leases/actions';
import {AreaLocation, FormNames} from '$src/leases/enums';
import {getAreasSum, getContentLeaseAreas} from '$src/leases/helpers';
import {formatNumber} from '$util/helpers';
import {getAttributes, getCurrentLease, getIsLeaseAreasFormValid} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type AreaItemProps = {
  attributes: Attributes,
  fields: any,
}

const LeaseAreaItems = ({
  attributes,
  fields,
}: AreaItemProps): Element<*> => {
  return (
    <div>
      {fields && !!fields.length && fields.map((area, index) => {
        return (
          <Collapse
            key={index}
            defaultOpen={true}
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
              <Row>
                <Column small={12} medium={12} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.address')}
                    name={`${area}.address`}
                    overrideValues={{
                      label: 'Osoite',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.postal_code')}
                    name={`${area}.postal_code`}
                    overrideValues={{
                      label: 'Postinumero',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.city')}
                    name={`${area}.city`}
                    overrideValues={{
                      label: 'Kaupunki',
                    }}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
            <Row>
              <Column small={12} medium={6}>
                <FieldArray
                  buttonTitle='Lisää kiinteistö/määräala'
                  component={PlotItemsEdit}
                  name={`${area}.plots_contract`}
                  title='Kiinteistöt / määräalat sopimuksessa'
                />
              </Column>
              <Column small={12} medium={6}>
                <FieldArray
                  buttonTitle='Lisää kiinteistö/määräala'
                  component={PlotItemsEdit}
                  name={`${area}.plots_current`}
                  title='Kiinteistöt / määräalat nykyhetkellä'
                />
              </Column>
            </Row>
            <Row>
              <Column small={12} medium={6}>
                <FieldArray
                  buttonTitle='Lisää kaavayksikkö'
                  component={PlanUnitItemsEdit}
                  name={`${area}.plan_units_contract`}
                  title='Kaavayksiköt sopimuksessa'
                />
              </Column>
              <Column small={12} medium={6}>
                <FieldArray
                  buttonTitle='Lisää kaavayksikkö'
                  component={PlanUnitItemsEdit}
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
            label='Lisää uusi kohde'
            onClick={() => fields.push({
              location: AreaLocation.SURFACE,
            })}
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

class LeaseAreasEdit extends Component<Props> {
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
          text={<span>{formatNumber(areasSum) || '-'} m<sup>2</sup></span>}
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
