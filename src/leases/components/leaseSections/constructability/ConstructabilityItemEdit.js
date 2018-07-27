// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector} from 'redux-form';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getFullAddress} from '$src/leases/helpers';
import {formatNumber, getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

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

type CommentProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderComments = ({attributes, fields, isSaveClicked}: CommentProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

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
            onClick={handleAdd}
            title='Lisää huomautus'
          />
        </Column>
      </Row>
    </div>
  );
};


type Props = {
  areaData: Object,
  areaCollapseState: boolean,
  areaId: number,
  attributes: Attributes,
  constructabilityReportCollapseState: boolean,
  constructabilityReportStateOptions: Array<Object>,
  demolitionCollapseState: boolean,
  errors: ?Object,
  field: string,
  isSaveClicked: boolean,
  locationOptions: Array<Object>,
  otherCollapseState: boolean,
  pollutedLandCollapseState: boolean,
  pollutedLandConditionStateOptions: Array<Object>,
  preconstructionCollapseState: boolean,
  receiveCollapseStates: Function,
  stateOptions: Array<Object>,
  typeOptions: Array<Object>,
}

const ConstructabilityItemEdit = ({
  areaData,
  areaCollapseState,
  areaId,
  attributes,
  constructabilityReportCollapseState,
  demolitionCollapseState,
  errors,
  field,
  isSaveClicked,
  locationOptions,
  otherCollapseState,
  pollutedLandCollapseState,
  preconstructionCollapseState,
  receiveCollapseStates,
  typeOptions,
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRUCTABILITY]: {
          [areaId]: {
            area: val,
          },
        },
      },
    });
  };

  const handlePreconstructionCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRUCTABILITY]: {
          [areaId]: {
            preconstruction: val,
          },
        },
      },
    });
  };

  const handleDemolitionCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRUCTABILITY]: {
          [areaId]: {
            demolition: val,
          },
        },
      },
    });
  };

  const handlePollutedLandCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRUCTABILITY]: {
          [areaId]: {
            polluted_land: val,
          },
        },
      },
    });
  };

  const handleConstructabilityReportCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRUCTABILITY]: {
          [areaId]: {
            constructability_report: val,
          },
        },
      },
    });
  };

  const handleOtherCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRUCTABILITY]: {
          [areaId]: {
            other: val,
          },
        },
      },
    });
  };

  const areaErrors = get(errors, field);
  const preconstructionErrors = getPreconstructionErrors(errors, field);
  const demolitionErrors = getDemolitionErrors(errors, field);
  const pollutedLandErrors = getPollutedLandErrors(errors, field);
  const constructabilityReportErrors = getConstructabilityReportErrors(errors, field);
  const otherErrors = getOtherErrors(errors, field);

  return (
    <Collapse
      defaultOpen={areaCollapseState !== undefined ? areaCollapseState : true}
      hasErrors={isSaveClicked && !isEmpty(areaErrors)}
      header={
        <div>
          <Column>
            <span className='collapse__header-subtitle'>
              {getLabelOfOption(typeOptions, areaData.type) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {getFullAddress(areaData)}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {formatNumber(areaData.area) || '-'} m<sup>2</sup> / {getLabelOfOption(locationOptions, areaData.location) || '-'}
            </span>
          </Column>
        </div>
      }
      headerTitle={<h3  className='collapse__header-title'>{areaData.identifier}</h3>}
      onToggle={handleAreaCollapseToggle}
    >
      <Collapse
        className='collapse__secondary'
        defaultOpen={preconstructionCollapseState !== undefined ? preconstructionCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(preconstructionErrors)}
        headerTitle={<h4 className='collapse__header-title'>Esirakentaminen, johtosiirrot ja kunnallistekniikka</h4>}
        onToggle={handlePreconstructionCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.preconstruction_state')}
              name={`${field}.preconstruction_state`}
              overrideValues={{
                label: 'Selvitysaste',
              }}
            />
          </Column>
        </Row>
        <FieldArray
          attributes={attributes}
          name={`${field}.descriptionsPreconstruction`}
          component={renderComments}
          isSaveClicked={isSaveClicked}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={demolitionCollapseState !== undefined ? demolitionCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(demolitionErrors)}
        headerTitle={<h4 className='collapse__header-title'>Purku</h4>}
        onToggle={handleDemolitionCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.demolition_state')}
              name={`${field}.demolition_state`}
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
          name={`${field}.descriptionsDemolition`}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={pollutedLandCollapseState !== undefined ? pollutedLandCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(pollutedLandErrors)}
        headerTitle={<h4 className='collapse__header-title'>PIMA</h4>}
        onToggle={handlePollutedLandCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_state')}
              name={`${field}.polluted_land_state`}
              overrideValues={{
                label: 'Selvitysaste',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_rent_condition_state')}
              name={`${field}.polluted_land_rent_condition_state`}
              overrideValues={{
                label: 'Vuokraehdot',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_rent_condition_date')}
              name={`${field}.polluted_land_rent_condition_date`}
              overrideValues={{
                label: 'Pvm',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_planner')}
              name={`${field}.polluted_land_planner`}
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
              name={`${field}.polluted_land_projectwise_number`}
              overrideValues={{
                label: 'ProjectWise kohdenumero',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.polluted_land_matti_report_number')}
              name={`${field}.polluted_land_matti_report_number`}
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
          name={`${field}.descriptionsPollutedLand`}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={constructabilityReportCollapseState !== undefined ? constructabilityReportCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(constructabilityReportErrors)}
        headerTitle={<h4 className='collapse__header-title'>Rakennettavuusselvitys</h4>}
        onToggle={handleConstructabilityReportCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_state')}
              name={`${field}.constructability_report_state`}
              overrideValues={{
                label: 'Selvitysaste',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_investigation_state')}
              name={`${field}.constructability_report_investigation_state`}
              overrideValues={{
                label: 'Selvitys',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_signing_date')}
              name={`${field}.constructability_report_signing_date`}
              overrideValues={{
                label: 'Allekirjoituspvm',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_signer')}
              name={`${field}.constructability_report_signer`}
              overrideValues={{
                label: 'Allekirjoittaja',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.constructability_report_geotechnical_number')}
              name={`${field}.constructability_report_geotechnical_number`}
              overrideValues={{
                label: 'Geoteknisen palvelun tiedosto',
              }}
            />
          </Column>
        </Row>
        <FieldArray
          attributes={attributes}
          component={renderComments}
          isSaveClicked={isSaveClicked}
          name={`${field}.descriptionsReport`}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={otherCollapseState !== undefined ? otherCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(otherErrors)}
        headerTitle={<h4 className='collapse__header-title'>Muut</h4>}
        onToggle={handleOtherCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.other_state')}
              name={`${field}.other_state`}
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
          name={`${field}.descriptionsOther`}
        />
      </Collapse>
    </Collapse>
  );
};

const formName = FormNames.CONSTRUCTABILITY;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);

    return {
      areaCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONTRUCTABILITY}.${id}.area`),
      areaId: id,
      constructabilityReportCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONTRUCTABILITY}.${id}.constructability_report`),
      demolitionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONTRUCTABILITY}.${id}.demolition`),
      otherCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONTRUCTABILITY}.${id}.other`),
      pollutedLandCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONTRUCTABILITY}.${id}.polluted_land`),
      preconstructionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONTRUCTABILITY}.${id}.preconstruction`),
    };
  },
  {
    receiveCollapseStates,
  }
)(ConstructabilityItemEdit);
