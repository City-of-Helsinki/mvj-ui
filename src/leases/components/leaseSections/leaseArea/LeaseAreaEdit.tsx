import React, { Fragment, PureComponent, ReactElement } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { change, FieldArray, formValueSelector } from "redux-form";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonSecondary from "/src/components/form/AddButtonSecondary";
import AddButtonThird from "/src/components/form/AddButtonThird";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import BoxItemContainer from "/src/components/content/BoxItemContainer";
import Collapse from "/src/components/collapse/Collapse";
import FieldAndRemoveButtonWrapper from "/src/components/form/FieldAndRemoveButtonWrapper";
import FormField from "/src/components/form/FormField";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import PlanUnitItemEdit from "./PlanUnitItemEdit";
import PlotItemEdit from "./PlotItemEdit";
import RemoveButton from "/src/components/form/RemoveButton";
import SubTitle from "/src/components/content/SubTitle";
import { receiveCollapseStates } from "/src/leases/actions";
import { ConfirmationModalTexts, FieldTypes, FormNames, ViewModes } from "enums";
import { ButtonColors } from "/src/components/enums";
import { LeaseAreaAddressesFieldPaths, LeaseAreaAddressesFieldTitles, LeaseAreasFieldPaths, LeaseAreasFieldTitles, LeasePlanUnitsFieldPaths, LeasePlotsFieldPaths, LeaseAreaCustomDetailedPlanFieldPaths } from "/src/leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { getFieldAttributes, getSearchQuery, getUrlParams, hasPermissions, isFieldAllowedToEdit, isFieldAllowedToRead, isFieldRequired } from "util/helpers";
import { getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked } from "/src/leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
import CustomDetailedPlanEdit from "./CustomDetailedPlanEdit";
type PlanUnitsProps = {
  attributes: Attributes;
  buttonTitle: string;
  collapseState: boolean;
  errors: Record<string, any>;
  fields: any;
  isSaveClicked: boolean;
  noDataText: string;
  onCollapseToggle: (...args: Array<any>) => any;
  title: string;
  uiDataKey: string;
  usersPermissions: UsersPermissionsType;
};

const renderPlanUnits = ({
  attributes,
  buttonTitle,
  collapseState,
  errors,
  fields,
  fields: {
    name
  },
  isSaveClicked,
  noDataText,
  onCollapseToggle,
  title,
  uiDataKey,
  usersPermissions
}: PlanUnitsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({
      addresses: [{}]
    });
  };

  const handleCollapseToggle = (val: boolean) => {
    onCollapseToggle(val);
  };

  const planUnitErrors = get(errors, name);
  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Collapse className='collapse__secondary' defaultOpen={collapseState !== undefined ? collapseState : true} hasErrors={isSaveClicked && !isEmpty(planUnitErrors)} headerTitle={title} onToggle={handleCollapseToggle} enableUiDataEdit uiDataKey={uiDataKey}>
            {!isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.PLAN_UNITS) && (!fields || !fields.length) && <FormText>{noDataText}</FormText>}

            {!!fields.length && <BoxItemContainer>
                {fields.map((planunit, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_PLAN_UNIT.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_PLAN_UNIT.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_PLAN_UNIT.TITLE
              });
            };

            return <PlanUnitItemEdit key={index} field={planunit} isSaveClicked={isSaveClicked} onRemove={handleRemove} />;
          })}
              </BoxItemContainer>}


            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_PLANUNIT)}>
              <Row>
                <Column>
                  <AddButtonSecondary className={!fields.length ? 'no-top-margin' : ''} label={buttonTitle} onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Collapse>;
    }}
    </AppConsumer>;
};

type PlotsProps = {
  attributes: Attributes;
  buttonTitle: string;
  collapseState: boolean;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
  noDataText: string;
  onCollapseToggle: (...args: Array<any>) => any;
  plotsData: Array<Record<string, any>>;
  title: string;
  uiDataKey: string;
  usersPermissions: UsersPermissionsType;
};

const renderPlots = ({
  attributes,
  buttonTitle,
  collapseState,
  errors,
  fields,
  fields: {
    name
  },
  isSaveClicked,
  noDataText,
  onCollapseToggle,
  plotsData,
  title,
  uiDataKey,
  usersPermissions
}: PlotsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({
      addresses: [{}]
    });
  };

  const handleCollapseToggle = (val: boolean) => {
    onCollapseToggle(val);
  };

  const plotErrors = get(errors, name);
  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Collapse className='collapse__secondary' defaultOpen={collapseState !== undefined ? collapseState : true} hasErrors={isSaveClicked && !isEmpty(plotErrors)} headerTitle={title} onToggle={handleCollapseToggle} enableUiDataEdit uiDataKey={uiDataKey}>

            {!isFieldAllowedToEdit(attributes, LeasePlotsFieldPaths.PLOTS) && (!fields || !fields.length) && <FormText>{noDataText}</FormText>}

            {!!fields.length && <BoxItemContainer>
                {fields.map((plot, index) => {
            const handleDelete = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_PLOT.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_PLOT.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_PLOT.TITLE
              });
            };

            return <PlotItemEdit key={index} field={plot} index={index} onRemove={handleDelete} plotsData={plotsData} />;
          })}
              </BoxItemContainer>}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_PLOT)}>
              <Row>
                <Column>
                  <AddButtonSecondary className={!fields.length ? 'no-top-margin' : ''} label={buttonTitle} onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Collapse>;
    }}
    </AppConsumer>;
};

type AddressProps = {
  attributes: Attributes;
  change: (...args: Array<any>) => any;
  field: string;
  isSaveClicked: boolean;
  onRemove: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const Address = ({
  attributes,
  change,
  field,
  isSaveClicked,
  onRemove,
  usersPermissions
}: AddressProps) => {
  const handleAddressChange = (details: Record<string, any>) => {
    change(formName, `${field}.postal_code`, details.postalCode);
    change(formName, `${field}.city`, details.city);
  };

  return <Row>
      <Column small={3} large={4}>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)}>
          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)} invisibleLabel name={`${field}.address`} valueSelectedCallback={handleAddressChange} overrideValues={{
          fieldType: FieldTypes.ADDRESS,
          label: LeaseAreaAddressesFieldTitles.ADDRESS
        }} />
        </Authorization>
      </Column>
      <Column small={3} large={2}>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)}>
          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)} invisibleLabel name={`${field}.postal_code`} overrideValues={{
          label: LeaseAreaAddressesFieldTitles.POSTAL_CODE
        }} />
        </Authorization>
      </Column>
      <Column small={3} large={2}>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.CITY)}>
          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaAddressesFieldPaths.CITY)} invisibleLabel name={`${field}.city`} overrideValues={{
          label: LeaseAreaAddressesFieldTitles.CITY
        }} />
        </Authorization>
      </Column>
      <Column small={3} large={2}>
        <FieldAndRemoveButtonWrapper field={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.IS_PRIMARY)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaAddressesFieldPaths.IS_PRIMARY)} invisibleLabel name={`${field}.is_primary`} overrideValues={{
          label: LeaseAreaAddressesFieldTitles.IS_PRIMARY
        }} />
            </Authorization>} removeButton={<Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASEAREAADDRESS)}>
              <RemoveButton className='third-level' onClick={onRemove} title="Poista osoite" />
            </Authorization>} />
      </Column>
    </Row>;
};

type AddressesProps = {
  attributes: Attributes;
  change: (...args: Array<any>) => any;
  fields: any;
  isSaveClicked: boolean;
  usersPermissions: UsersPermissionsType;
};

const AddressItems = ({
  attributes,
  change,
  fields,
  isSaveClicked,
  usersPermissions
}: AddressesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.ADDRESSES)}>
              {LeaseAreaAddressesFieldTitles.ADDRESSES}
            </SubTitle>
            {fields && !!fields.length && <Row>
                <Column small={3} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)}>
                    <FormTextTitle required={isFieldRequired(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.ADDRESS)}>
                      {LeaseAreaAddressesFieldTitles.ADDRESS}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)}>
                    <FormTextTitle required={isFieldRequired(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.POSTAL_CODE)}>
                      {LeaseAreaAddressesFieldTitles.POSTAL_CODE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.CITY)}>
                    <FormTextTitle required={isFieldRequired(attributes, LeaseAreaAddressesFieldPaths.CITY)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.CITY)}>
                      {LeaseAreaAddressesFieldTitles.CITY}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.IS_PRIMARY)}>
                    <FormTextTitle required={isFieldRequired(attributes, LeaseAreaAddressesFieldPaths.IS_PRIMARY)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.IS_PRIMARY)}>
                      {LeaseAreaAddressesFieldTitles.IS_PRIMARY}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>}
            {fields && !!fields.length && fields.map((field, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_ADDRESS.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_ADDRESS.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_ADDRESS.TITLE
            });
          };

          return <Address key={index} attributes={attributes} change={change} field={field} isSaveClicked={isSaveClicked} onRemove={handleRemove} usersPermissions={usersPermissions} />;
        })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEAREAADDRESS)}>
              <Row>
                <Column>
                  <AddButtonThird label='Lisää osoite' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type OwnProps = {
  field: string;
  index: number;
  savedArea: Record<string, any>;
};
type Props = OwnProps & {
  areaId: number;
  attributes: Attributes;
  change: (...args: Array<any>) => any;
  errors: Record<string, any> | null | undefined;
  geometry: Record<string, any> | null | undefined;
  isSaveClicked: boolean;
  location: Record<string, any>;
  planUnitsContractCollapseState: boolean;
  planUnitsCurrentCollapseState: boolean;
  plotsContractCollapseState: boolean;
  plotsCurrentCollapseState: boolean;
  customDetailedPlanCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  custom_detailed_plan: Record<string, any>;
};

class LeaseAreaEdit extends PureComponent<Props> {
  handleCollapseToggle = (key: string, val: boolean) => {
    const {
      areaId,
      receiveCollapseStates
    } = this.props;

    if (!areaId) {
      return;
    }

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [areaId]: {
            [key]: val
          }
        }
      }
    });
  };
  handlePlanUnitContractCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('plan_units_contract', val);
  };
  handlePlanUnitCurrentCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('plan_units_current', val);
  };
  handleCustomDetailedPlanCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('custom_detailed_plan', val);
  };
  handlePlotsContractCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('plots_contract', val);
  };
  handlePlotsCurrentCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('plots_current', val);
  };
  getMapLinkUrl = () => {
    const {
      areaId,
      location: {
        pathname,
        search
      }
    } = this.props;
    const searchQuery = getUrlParams(search);
    delete searchQuery.plan_unit;
    delete searchQuery.plot;
    searchQuery.lease_area = areaId, searchQuery.tab = 7;
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };

  render() {
    const {
      attributes,
      change,
      errors,
      field,
      geometry,
      isSaveClicked,
      planUnitsContractCollapseState,
      planUnitsCurrentCollapseState,
      customDetailedPlanCollapseState,
      plotsContractCollapseState,
      plotsCurrentCollapseState,
      savedArea,
      usersPermissions,
      custom_detailed_plan
    } = this.props;
    const mapLinkUrl = this.getMapLinkUrl();
    return <Fragment>
        <BoxContentWrapper>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.IDENTIFIER)} name={`${field}.identifier`} overrideValues={{
                label: LeaseAreasFieldTitles.IDENTIFIER
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.IDENTIFIER)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.TYPE)} name={`${field}.type`} overrideValues={{
                label: LeaseAreasFieldTitles.TYPE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.TYPE)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.AREA)} name={`${field}.area`} unit='m²' overrideValues={{
                label: LeaseAreasFieldTitles.AREA
              }} enableUiDataEdit tooltipStyle={{
                right: 22
              }} uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.AREA)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.LOCATION)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.LOCATION)} name={`${field}.location`} overrideValues={{
                label: LeaseAreasFieldTitles.LOCATION
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.LOCATION)} />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.GEOMETRY)}>
                {!isEmpty(geometry) && <Link to={mapLinkUrl}>{LeaseAreasFieldTitles.GEOMETRY}</Link>}
              </Authorization>
            </Column>
          </Row>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
            <FieldArray attributes={attributes} change={change} component={AddressItems} isSaveClicked={isSaveClicked} name={`${field}.addresses`} usersPermissions={usersPermissions} />
          </Authorization>
        </BoxContentWrapper>

        <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.PLOTS)}>
          <Row>
            <Column small={12} large={6}>
              <FieldArray attributes={attributes} buttonTitle='Lisää kiinteistö/määräala' collapseState={plotsContractCollapseState} component={renderPlots} errors={errors} isSaveClicked={isSaveClicked} name={`${field}.plots_contract`} noDataText='Ei kiinteistöjä/määräaloja sopimuksessa' onCollapseToggle={this.handlePlotsContractCollapseToggle} plotsData={get(savedArea, 'plots_contract', [])} title='Kiinteistöt / määräalat sopimuksessa' uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.PLOTS_CONTRACT)} usersPermissions={usersPermissions} />
            </Column>
            <Column small={12} large={6}>
              <FieldArray attributes={attributes} buttonTitle='Lisää kiinteistö/määräala' collapseState={plotsCurrentCollapseState} component={renderPlots} errors={errors} isSaveClicked={isSaveClicked} name={`${field}.plots_current`} noDataText='Ei kiinteistöjä/määräaloja nykyhetkellä' onCollapseToggle={this.handlePlotsCurrentCollapseToggle} plotsData={get(savedArea, 'plots_current', [])} title='Kiinteistöt / määräalat nykyhetkellä' uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.PLOTS)} usersPermissions={usersPermissions} />
            </Column>
          </Row>
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNITS)}>
          <Row>
            <Column small={12} large={6}>
              <FieldArray attributes={attributes} buttonTitle='Lisää kaavayksikkö' collapseState={planUnitsContractCollapseState} component={renderPlanUnits} errors={errors} isSaveClicked={isSaveClicked} name={`${field}.plan_units_contract`} noDataText='Ei kaavayksiköitä sopimuksessa' onCollapseToggle={this.handlePlanUnitContractCollapseToggle} title='Kaavayksiköt sopimuksessa' uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNITS_CONTRACT)} usersPermissions={usersPermissions} />
            </Column>
            <Column small={12} large={6}>
              <FieldArray attributes={attributes} buttonTitle='Lisää kaavayksikkö' collapseState={planUnitsCurrentCollapseState} component={renderPlanUnits} errors={errors} isSaveClicked={isSaveClicked} name={`${field}.plan_units_current`} noDataText='Ei kaavayksiköitä nykyhetkellä' onCollapseToggle={this.handlePlanUnitCurrentCollapseToggle} title='Kaavayksiköt nykyhetkellä' uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNITS)} usersPermissions={usersPermissions} />
            </Column>
            <Column small={0} large={6} /> {
            /* Force next column to right */
          }
            <Column small={12} large={6}>
              <FieldArray attributes={attributes} buttonTitle='Vireillä olevat kaavayksiköt' collapseState={planUnitsCurrentCollapseState} component={renderPlanUnits} errors={errors} isSaveClicked={isSaveClicked} name={`${field}.plan_units_pending`} noDataText='Ei vireillä olevia kaavayksiköitä' onCollapseToggle={this.handlePlanUnitCurrentCollapseToggle} title='Vireillä olevat kaavayksiköt' usersPermissions={usersPermissions} />
            </Column>
          </Row>
        </Authorization>
        <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.CUSTOM_DETAILED_PLAN)}>
          <Row>
            <Column small={12} large={6} /> {
            /* Force next column to right */
          }
            <Column small={12} large={6}>
              <Collapse className='collapse__secondary' defaultOpen={customDetailedPlanCollapseState !== undefined ? customDetailedPlanCollapseState : true} hasErrors={isSaveClicked && !isEmpty(customDetailedPlanCollapseState)} headerTitle={'Oma muu alue'} onToggle={val => this.handleCustomDetailedPlanCollapseToggle(val)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.CUSTOM_DETAILED_PLAN)}>
                {custom_detailed_plan && <BoxItemContainer>
                    <CustomDetailedPlanEdit field={`${field}.custom_detailed_plan`} onRemove={() => change(formName, `${field}.custom_detailed_plan`, null)} />
                  </BoxItemContainer>}
                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_CUSTOMDETAILEDPLAN) && !custom_detailed_plan}>
                  <Row>
                    <Column>
                      <AddButtonSecondary className={'no-top-margin'} label={'Lisää oma muu alue'} onClick={() => change(formName, `${field}.custom_detailed_plan`, {})} />
                    </Column>
                  </Row>
                </Authorization>
              </Collapse>
            </Column>
          </Row>
        </Authorization>
      </Fragment>;
  }

}

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);
export default (flowRight(withRouter, connect((state, props) => {
  const id = selector(state, `${props.field}.id`);
  return {
    areaId: id,
    attributes: getAttributes(state),
    errors: getErrorsByFormName(state, formName),
    geometry: selector(state, `${props.field}.geometry`),
    custom_detailed_plan: selector(state, `${props.field}.custom_detailed_plan`),
    isSaveClicked: getIsSaveClicked(state),
    planUnitsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.plan_units_contract`),
    planUnitsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.plan_units_current`),
    plotsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.plots_contract`),
    plotsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.plots_current`),
    customDetailedPlanCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.custom_detailed_plan`),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  change,
  receiveCollapseStates
}))(LeaseAreaEdit) as React.ComponentType<OwnProps>);