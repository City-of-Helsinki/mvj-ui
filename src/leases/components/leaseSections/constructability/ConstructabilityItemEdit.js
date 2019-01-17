// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector} from 'redux-form';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors, FieldTypes} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseAreaAddressesFieldPaths,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
  LeaseConstructabilityDescriptionsFieldPaths,
  LeaseConstructabilityDescriptionsFieldTitles,
} from '$src/leases/enums';
import {getFullAddress} from '$src/leases/helpers';
import {
  formatNumber,
  getFieldAttributes,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getCollapseStateByKey} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/types';

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
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <SubTitle>{LeaseConstructabilityDescriptionsFieldTitles.CONSTRUCTABILITY_DESCRIPTIONS}</SubTitle>
            {!isFieldAllowedToEdit(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS) && (!fields || !fields.length) &&
              <FormText><em>Ei huomautuksia</em></FormText>
            }

            {fields && !!fields.length &&
              <Fragment>
                <Row>
                  <Column small={6} medium={6} large={8}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT)}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT)}>
                        {LeaseConstructabilityDescriptionsFieldTitles.TEXT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={4} medium={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
                        {LeaseConstructabilityDescriptionsFieldTitles.AHJO_REFERENCE_NUMBER}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
                {fields.map((comment, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.CONSTRUCTABILITY,
                      confirmationModalTitle: DeleteModalTitles.CONSTRUCTABILITY,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={6} medium={6} large={8}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(attributes, LeaseConstructabilityDescriptionsFieldPaths.TEXT)}
                            invisibleLabel
                            name={`${comment}.text`}
                            overrideValues={{label: LeaseConstructabilityDescriptionsFieldTitles.TEXT}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={4} medium={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}
                            invisibleLabel
                            name={`${comment}.ahjo_reference_number`}
                            validate={referenceNumber}
                            overrideValues={{
                              label: LeaseConstructabilityDescriptionsFieldTitles.AHJO_REFERENCE_NUMBER,
                              fieldType: FieldTypes.REFERENCE_NUMBER,
                            }}
                          />
                        </Authorization>
                      </Column>
                      <Column small={2} medium={3} large={2}>
                        <Authorization allow={isFieldAllowedToEdit(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
                          <RemoveButton
                            className='third-level'
                            onClick={handleRemove}
                            title="Poista huomautus"
                          />
                        </Authorization>
                      </Column>
                    </Row>
                  );
                })}
              </Fragment>
            }

            <Authorization allow={isFieldAllowedToEdit(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää huomautus'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};


type Props = {
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
  savedArea: Object,
  stateOptions: Array<Object>,
  typeOptions: Array<Object>,
}

const ConstructabilityItemEdit = ({
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
  savedArea,
  typeOptions,
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
      headerSubtitles={
        <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(typeOptions, savedArea.type) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
              <CollapseHeaderSubtitle>{getFullAddress(savedArea)}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
              <CollapseHeaderSubtitle>{!isEmptyValue(savedArea.area) ? `${formatNumber(savedArea.area)} m²` : '-'}{savedArea.location ? ` / ${getLabelOfOption(locationOptions, savedArea.location)}` : ''}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
          {savedArea.identifier}
        </Authorization>
      }
      onToggle={handleAreaCollapseToggle}
      showTitleOnOpen
    >
      <Collapse
        className='collapse__secondary'
        defaultOpen={preconstructionCollapseState !== undefined ? preconstructionCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(preconstructionErrors)}
        headerTitle='Esirakentaminen, johtosiirrot ja kunnallistekniikka'
        onToggle={handlePreconstructionCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE)}
                name={`${field}.preconstruction_state`}
                overrideValues={{label: LeaseAreasFieldTitles.PRECONSTRUCTION_STATE}}
              />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray
            attributes={attributes}
            name={`${field}.descriptionsPreconstruction`}
            component={renderComments}
            isSaveClicked={isSaveClicked}
          />
        </Authorization>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={demolitionCollapseState !== undefined ? demolitionCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(demolitionErrors)}
        headerTitle='Purku'
        onToggle={handleDemolitionCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.DEMOLITION_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.DEMOLITION_STATE)}
                name={`${field}.demolition_state`}
                overrideValues={{label: LeaseAreasFieldTitles.DEMOLITION_STATE}}
              />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray
            attributes={attributes}
            component={renderComments}
            isSaveClicked={isSaveClicked}
            name={`${field}.descriptionsDemolition`}
          />
        </Authorization>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={pollutedLandCollapseState !== undefined ? pollutedLandCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(pollutedLandErrors)}
        headerTitle='Pima ja jäte'
        onToggle={handlePollutedLandCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_STATE)}
                name={`${field}.polluted_land_state`}
                overrideValues={{label: LeaseAreasFieldTitles.POLLUTED_LAND_STATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE)}
                name={`${field}.polluted_land_rent_condition_state`}
                overrideValues={{label: LeaseAreasFieldTitles.POLLUTED_LAND_RENT_CONDITION_STATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_DATE)}
                name={`${field}.polluted_land_rent_condition_date`}
                overrideValues={{label: LeaseAreasFieldTitles.POLLUTED_LAND_RENT_CONDITION_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PLANNER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PLANNER)}
                name={`${field}.polluted_land_planner`}
                overrideValues={{
                  fieldType: FieldTypes.USER,
                  label: LeaseAreasFieldTitles.POLLUTED_LAND_PLANNER,
                }}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PROJECTWISE_NUMBER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PROJECTWISE_NUMBER)}
                name={`${field}.polluted_land_projectwise_number`}
                overrideValues={{label: LeaseAreasFieldTitles.POLLUTED_LAND_PROJECTWISE_NUMBER}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_MATTI_REPORT_NUMBER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_MATTI_REPORT_NUMBER)}
                name={`${field}.polluted_land_matti_report_number`}
                overrideValues={{label: LeaseAreasFieldTitles.POLLUTED_LAND_MATTI_REPORT_NUMBER}}
              />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray
            attributes={attributes}
            component={renderComments}
            isSaveClicked={isSaveClicked}
            name={`${field}.descriptionsPollutedLand`}
          />
        </Authorization>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={constructabilityReportCollapseState !== undefined ? constructabilityReportCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(constructabilityReportErrors)}
        headerTitle='Rakennettavuusselvitys'
        onToggle={handleConstructabilityReportCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE)}
                name={`${field}.constructability_report_state`}
                overrideValues={{label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_STATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE)}
                name={`${field}.constructability_report_investigation_state`}
                overrideValues={{label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNING_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNING_DATE)}
                name={`${field}.constructability_report_signing_date`}
                overrideValues={{label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_SIGNING_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNER)}
                name={`${field}.constructability_report_signer`}
                overrideValues={{label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_SIGNER}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_NUMBER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_NUMBER)}
                name={`${field}.constructability_report_geotechnical_number`}
                overrideValues={{label: LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_NUMBER}}
              />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray
            attributes={attributes}
            component={renderComments}
            isSaveClicked={isSaveClicked}
            name={`${field}.descriptionsReport`}
          />
        </Authorization>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={otherCollapseState !== undefined ? otherCollapseState : false}
        hasErrors={isSaveClicked && !isEmpty(otherErrors)}
        headerTitle='Muut'
        onToggle={handleOtherCollapseToggle}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.OTHER_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.OTHER_STATE)}
                name={`${field}.other_state`}
                overrideValues={{label: LeaseAreasFieldTitles.OTHER_STATE}}
              />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <FieldArray
            attributes={attributes}
            component={renderComments}
            isSaveClicked={isSaveClicked}
            name={`${field}.descriptionsOther`}
          />
        </Authorization>
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
      areaCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONSTRUCTABILITY}.${id}.area`),
      areaId: id,
      constructabilityReportCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONSTRUCTABILITY}.${id}.constructability_report`),
      demolitionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONSTRUCTABILITY}.${id}.demolition`),
      otherCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONSTRUCTABILITY}.${id}.other`),
      pollutedLandCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONSTRUCTABILITY}.${id}.polluted_land`),
      preconstructionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.CONSTRUCTABILITY}.${id}.preconstruction`),
    };
  },
  {
    receiveCollapseStates,
  }
)(ConstructabilityItemEdit);
