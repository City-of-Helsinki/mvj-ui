// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';
import RemoveButton from '$components/form/RemoveButton';
import {receiveConstructabilityFormValid} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContentConstructability} from '$src/leases/helpers';
import {getUserOptions} from '$src/users/helpers';
import {formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCurrentLease, getIsConstructabilityFormValid} from '$src/leases/selectors';
import {getUsers} from '$src/users/selectors';

import type {Attributes, Lease} from '$src/leases/types';
import type {UserList} from '$src/users/types';

type CommentProps = {
  attributes: Attributes,
  fields: any,
}

const renderComments = ({attributes, fields}: CommentProps): Element<*> => {
  return (
    <div>
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((comment, index) => {
          return (
            <BoxItem key={index}>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright-no-padding'
                  onClick={() => fields.remove(index)}
                  title="Poista huomautus"
                />
                <Row>
                  <Column small={6} medium={9} large={10}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_descriptions.child.children.text')}
                      name={`${comment}.text`}
                      overrideValues={{
                        label: 'Huomautus',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={3} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_descriptions.child.children.ahjo_reference_number')}
                      name={`${comment}.ahjo_reference_number`}
                      overrideValues={{
                        label: 'AHJO diaarinumero',
                      }}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          );
        })}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää huomautus'
            onClick={() => fields.push({})}
            title='Lisää huomautus'
          />
        </Column>
      </Row>
    </div>
  );
};


type AreaProps = {
  areas: Array<Object>,
  attributes: Attributes,
  fields: any,
  users: UserList,
}

const renderAreas = ({
  areas,
  attributes,
  fields,
  users,
}: AreaProps): Element<*> => {
  const getFullAddress = (item: Object) => {
    return `${item.address}, ${item.postal_code} ${item.city}`;
  };

  const userOptions = getUserOptions(users);
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <div>
      {!fields || !fields.length &&
        <p className='no-margin'>Ei vuokra-alueita</p>
      }
      {areas && !!areas.length &&fields && !!fields.length && fields.map((area, index) => {
        return (
          <Collapse
            key={area.id ? area.id : `index_${index}`}
            defaultOpen={true}
            header={
              <div>
                <Column>
                  <span className='collapse__header-subtitle'>
                    {getLabelOfOption(typeOptions, areas[index].type) || '-'}
                  </span>
                </Column>
                <Column>
                  <span className='collapse__header-subtitle'>
                    {getFullAddress(areas[index])}
                  </span>
                </Column>
                <Column>
                  <span className='collapse__header-subtitle'>
                    {formatNumber(areas[index].area) || '-'} m<sup>2</sup> / {getLabelOfOption(locationOptions, areas[index].location) || '-'}
                  </span>
                </Column>
              </div>
            }
            headerTitle={
              <h3  className='collapse__header-title'>{areas[index].identifier}</h3>
            }
          >
            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              headerTitle={
                <h4 className='collapse__header-title'>Esirakentaminen, johtosiirrot ja kunnallistekniikka</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.preconstruction_state')}
                    name={`${area}.preconstruction_state`}
                    overrideValues={{
                      label: 'Selvitysaste',
                    }}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                name={`${area}.descriptionsPreconstruction`}
                component={renderComments}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              headerTitle={
                <h4 className='collapse__header-title'>Purku</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.demolition_state')}
                    name={`${area}.demolition_state`}
                    overrideValues={{
                      label: 'Selvitysaste',
                    }}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                component={renderComments}
                name={`${area}.descriptionsDemolition`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              headerTitle={
                <h4 className='collapse__header-title'>PIMA</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_state')}
                    name={`${area}.polluted_land_state`}
                    overrideValues={{
                      label: 'Selvitysaste',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_rent_condition_state')}
                    name={`${area}.polluted_land_rent_condition_state`}
                    overrideValues={{
                      label: 'Vuokraehdot',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_rent_condition_date')}
                    name={`${area}.polluted_land_rent_condition_date`}
                    overrideValues={{
                      label: 'Päivämäärä',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_planner')}
                    name={`${area}.polluted_land_planner`}
                    overrideValues={{
                      label: 'PIMA valmistelija',
                      options: userOptions,
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_projectwise_number')}
                    name={`${area}.polluted_land_projectwise_number`}
                    overrideValues={{
                      label: 'ProjectWise kohdenumero',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_matti_report_number')}
                    name={`${area}.polluted_land_matti_report_number`}
                    overrideValues={{
                      label: 'Matti raportti',
                    }}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                component={renderComments}
                name={`${area}.descriptionsPollutedLand`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              headerTitle={
                <h4 className='collapse__header-title'>Rakennettavuusselvitys</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_state')}
                    name={`${area}.constructability_report_state`}
                    overrideValues={{
                      label: 'Selvitysaste',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_investigation_state')}
                    name={`${area}.constructability_report_investigation_state`}
                    overrideValues={{
                      label: 'Selvitys',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_signing_date')}
                    name={`${area}.constructability_report_signing_date`}
                    overrideValues={{
                      label: 'Allekirjoituspäivämäärä',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_signer')}
                    name={`${area}.constructability_report_signer`}
                    overrideValues={{
                      label: 'Allekirjoittaja',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_geotechnical_number')}
                    name={`${area}.constructability_report_geotechnical_number`}
                    overrideValues={{
                      label: 'Geotekninen palvelun tiedosto',
                    }}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                component={renderComments}
                name={`${area}.descriptionsReport`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              headerTitle={
                <h4 className='collapse__header-title'>Muut</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'lease_areas.child.children.other_state')}
                    name={`${area}.other_state`}
                    overrideValues={{
                      label: 'Selvitysaste',
                    }}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                component={renderComments}
                name={`${area}.descriptionsOther`}
              />
            </Collapse>
          </Collapse>
        );
      })}
    </div>
  );
};

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  handleSubmit: Function,
  isConstructabilityFormValid: boolean,
  receiveConstructabilityFormValid: Function,
  users: UserList,
  valid: boolean,
}

class ConstructabilityEdit extends Component<Props> {
  componentDidUpdate() {
    const {isConstructabilityFormValid, receiveConstructabilityFormValid, valid} = this.props;
    if(isConstructabilityFormValid !== valid) {
      receiveConstructabilityFormValid(valid);
    }
  }

  render () {
    const {attributes, currentLease, handleSubmit, users} = this.props;
    const areas = getContentConstructability(currentLease);

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <h2>Rakentamiskelpoisuus</h2>
          <Divider />

          <FieldArray
            areas={areas}
            attributes={attributes}
            component={renderAreas}
            name="lease_areas"
            users={users}
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.CONSTRUCTABILITY;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        isConstructabilityFormValid: getIsConstructabilityFormValid(state),
        users: getUsers(state),
      };
    },
    {
      receiveConstructabilityFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ConstructabilityEdit);
