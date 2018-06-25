// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';
import RemoveButton from '$components/form/RemoveButton';
import SendEmail from './SendEmail';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getFullAddress, getContentConstructability} from '$src/leases/helpers';
import {getUserOptions} from '$src/users/helpers';
import {formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes, Lease} from '$src/leases/types';

type CommentProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderComments = ({attributes, fields, isSaveClicked}: CommentProps): Element<*> => {
  return (
    <div>
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((comment, index) => {
          return (
            <Row key={index}>
              <Column small={6} medium={6} large={8}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_descriptions.child.children.text')}
                  name={`${comment}.text`}
                  overrideValues={{
                    label: 'Huomautus',
                  }}
                />
              </Column>
              <Column small={4} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_descriptions.child.children.ahjo_reference_number')}
                  name={`${comment}.ahjo_reference_number`}
                  validate={referenceNumber}
                  overrideValues={{
                    label: 'AHJO diaarinumero',
                  }}
                />
              </Column>
              <Column small={2} medium={3} large={2}>
                <RemoveButton
                  className='no-label'
                  onClick={() => fields.remove(index)}
                  title="Poista huomautus"
                />
              </Column>
            </Row>
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

const getPreconstructionErrors = (errors: ?Object, area: string) => {
  return {
    ...get(errors, `${area}.preconstruction_state`, {}),
    ...get(errors, `${area}.descriptionsPreconstruction`, {}),
  };
};

const getDemolitionErrors = (errors: ?Object, area: string) => {
  return {
    ...get(errors, `${area}.demolition_state`, {}),
    ...get(errors, `${area}.descriptionsDemolition`, {}),
  };
};

const getPollutedLandErrors = (errors: ?Object, area: string) => {
  return {
    ...get(errors, `${area}.polluted_land_state`, {}),
    ...get(errors, `${area}.polluted_land_rent_condition_state`, {}),
    ...get(errors, `${area}.polluted_land_rent_condition_date`, {}),
    ...get(errors, `${area}.polluted_land_planner`, {}),
    ...get(errors, `${area}.polluted_land_projectwise_number`, {}),
    ...get(errors, `${area}.polluted_land_matti_report_number`, {}),
    ...get(errors, `${area}.descriptionsPollutedLand`, {}),
  };
};

const getConstructabilityReportErrors = (errors: ?Object, area: string) => {
  return {
    ...get(errors, `${area}.constructability_report_state`),
    ...get(errors, `${area}.constructability_report_investigation_state`, {}),
    ...get(errors, `${area}.constructability_report_signing_date`, {}),
    ...get(errors, `${area}.constructability_report_signer`, {}),
    ...get(errors, `${area}.constructability_report_geotechnical_number`, {}),
    ...get(errors, `${area}.descriptionsReport`, {}),
  };
};

const getOtherErrors = (errors: ?Object, area: string) => {
  return {
    ...get(errors, `${area}.other_state`),
    ...get(errors, `${area}.descriptionsOther`),
  };
};

type AreaProps = {
  areas: Array<Object>,
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  locationOptions: Array<Object>,
  typeOptions: Array<Object>,
}

const renderAreas = ({
  areas,
  attributes,
  errors,
  fields,
  isSaveClicked,
  locationOptions,
  typeOptions,
}: AreaProps): Element<*> => {
  return (
    <div>
      {!fields || !fields.length &&
        <p className='no-margin'>Ei vuokra-alueita</p>
      }
      {areas && !!areas.length &&fields && !!fields.length && fields.map((area, index) => {
        const areaErrors = get(errors, area);
        const preconstructionErrors = getPreconstructionErrors(errors, area);
        const demolitionErrors = getDemolitionErrors(errors, area);
        const pollutedLandErrors = getPollutedLandErrors(errors, area);
        const constructabilityReportErrors = getConstructabilityReportErrors(errors, area);
        const otherErrors = getOtherErrors(errors, area);

        return (
          <Collapse
            key={area.id ? area.id : `index_${index}`}
            defaultOpen={true}
            hasErrors={isSaveClicked && !isEmpty(areaErrors)}
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
              hasErrors={isSaveClicked && !isEmpty(preconstructionErrors)}
              headerTitle={
                <h4 className='collapse__header-title'>Esirakentaminen, johtosiirrot ja kunnallistekniikka</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                isSaveClicked={isSaveClicked}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              hasErrors={isSaveClicked && !isEmpty(demolitionErrors)}
              headerTitle={
                <h4 className='collapse__header-title'>Purku</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                isSaveClicked={isSaveClicked}
                name={`${area}.descriptionsDemolition`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              hasErrors={isSaveClicked && !isEmpty(pollutedLandErrors)}
              headerTitle={
                <h4 className='collapse__header-title'>PIMA</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_state')}
                    name={`${area}.polluted_land_state`}
                    overrideValues={{
                      label: 'Selvitysaste',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_rent_condition_state')}
                    name={`${area}.polluted_land_rent_condition_state`}
                    overrideValues={{
                      label: 'Vuokraehdot',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_rent_condition_date')}
                    name={`${area}.polluted_land_rent_condition_date`}
                    overrideValues={{
                      label: 'Pvm',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_planner')}
                    name={`${area}.polluted_land_planner`}
                    overrideValues={{
                      fieldType: 'user',
                      label: 'PIMA valmistelija',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_projectwise_number')}
                    name={`${area}.polluted_land_projectwise_number`}
                    overrideValues={{
                      label: 'ProjectWise kohdenumero',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                isSaveClicked={isSaveClicked}
                name={`${area}.descriptionsPollutedLand`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              hasErrors={isSaveClicked && !isEmpty(constructabilityReportErrors)}
              headerTitle={
                <h4 className='collapse__header-title'>Rakennettavuusselvitys</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_state')}
                    name={`${area}.constructability_report_state`}
                    overrideValues={{
                      label: 'Selvitysaste',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_investigation_state')}
                    name={`${area}.constructability_report_investigation_state`}
                    overrideValues={{
                      label: 'Selvitys',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_signing_date')}
                    name={`${area}.constructability_report_signing_date`}
                    overrideValues={{
                      label: 'Allekirjoituspvm',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_signer')}
                    name={`${area}.constructability_report_signer`}
                    overrideValues={{
                      label: 'Allekirjoittaja',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                isSaveClicked={isSaveClicked}
                name={`${area}.descriptionsReport`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary'
              defaultOpen={true}
              hasErrors={isSaveClicked && !isEmpty(otherErrors)}
              headerTitle={
                <h4 className='collapse__header-title'>Muut</h4>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
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
                isSaveClicked={isSaveClicked}
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
  errors: ?Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  areas: Array<Object>,
  locationOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class ConstructabilityEdit extends Component<Props, State> {
  state = {
    areas: [],
    locationOptions: [],
    typeOptions: [],
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONSTRUCTABILITY]: this.props.valid,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const retObj = {};

    if(props.attributes !== state.attributes) {
      retObj.locationOptions = getAttributeFieldOptions(props.attributes, 'lease_areas.child.children.location');
      retObj.typeOptions = getAttributeFieldOptions(props.attributes, 'lease_areas.child.children.type');
      retObj.attributes = props.attributes;
    }
    if(props.currentLease !== state.currentLease) {
      retObj.areas = getContentConstructability(props.currentLease);
      retObj.currentLease = props.currentLease;
    }
    if(props.users !== state.users) {
      retObj.userOptions = getUserOptions(props.users);
      retObj.users = props.users;
    }

    if(!isEmpty(retObj)) {
      return retObj;
    }
    return null;
  }

  render () {
    const {
      attributes,
      errors,
      handleSubmit,
      isSaveClicked,
    } = this.props;
    const {
      areas,
      locationOptions,
      typeOptions,
    } = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <h2>Rakentamiskelpoisuus</h2>
          <Divider />
          <SendEmail />

          <FieldArray
            areas={areas}
            attributes={attributes}
            component={renderAreas}
            errors={errors}
            isSaveClicked={isSaveClicked}
            locationOptions={locationOptions}
            name="lease_areas"
            typeOptions={typeOptions}
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
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
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
)(ConstructabilityEdit);
