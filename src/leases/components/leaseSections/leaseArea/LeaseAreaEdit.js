//@flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {change, FieldArray, formValueSelector} from 'redux-form';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import PlanUnitItemEdit from './PlanUnitItemEdit';
import PlotItemEdit from './PlotItemEdit';
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
  LeaseAreaAddressesFieldTitles,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  getFieldAttributes,
  getSearchQuery,
  getUrlParams,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {
  getAttributes,
  getCollapseStateByKey,
  getErrorsByFormName,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type PlanUnitsProps = {
  attributes: Attributes,
  buttonTitle: string,
  collapseState: boolean,
  errors: Object,
  fields: any,
  isSaveClicked: boolean,
  noDataText: string,
  onCollapseToggle: Function,
  title: string,
  uiDataKey: string,
  usersPermissions: UsersPermissionsType,
}

const renderPlanUnits = ({
  attributes,
  buttonTitle,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  noDataText,
  onCollapseToggle,
  title,
  uiDataKey,
  usersPermissions,
}: PlanUnitsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({
      addresses: [{}],
    });
  };

  const handleCollapseToggle = (val: boolean) => {
    onCollapseToggle(val);
  };

  const planUnitErrors = get(errors, name);

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(planUnitErrors)}
            headerTitle={title}
            onToggle={handleCollapseToggle}
            enableUiDataEdit
            uiDataKey={uiDataKey}
          >
            {!isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.PLAN_UNITS) && (!fields || !fields.length) &&
              <FormText>{noDataText}</FormText>
            }

            {!!fields.length &&
              <BoxItemContainer>
                {fields.map((planunit, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.PLAN_UNIT,
                      confirmationModalTitle: DeleteModalTitles.PLAN_UNIT,
                    });
                  };

                  return <PlanUnitItemEdit
                    key={index}
                    field={planunit}
                    isSaveClicked={isSaveClicked}
                    onRemove={handleRemove}
                  />;
                })}
              </BoxItemContainer>
            }


            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_PLANUNIT)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={!fields.length ? 'no-top-margin' : ''}
                    label={buttonTitle}
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type PlotsProps = {
  attributes: Attributes,
  buttonTitle: string,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  noDataText: string,
  onCollapseToggle: Function,
  plotsData: Array<Object>,
  title: string,
  uiDataKey: string,
  usersPermissions: UsersPermissionsType,
}

const renderPlots = ({
  attributes,
  buttonTitle,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  noDataText,
  onCollapseToggle,
  plotsData,
  title,
  uiDataKey,
  usersPermissions,
}: PlotsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({
      addresses: [{}],
    });
  };

  const handleCollapseToggle = (val: boolean) => {
    onCollapseToggle(val);
  };

  const plotErrors = get(errors, name);

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(plotErrors)}
            headerTitle={title}
            onToggle={handleCollapseToggle}
            enableUiDataEdit
            uiDataKey={uiDataKey}
          >

            {!isFieldAllowedToEdit(attributes, LeasePlotsFieldPaths.PLOTS) && (!fields || !fields.length) &&
              <FormText>{noDataText}</FormText>
            }

            {!!fields.length &&
              <BoxItemContainer>
                {fields.map((plot, index) => {
                  const handleDelete = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.PLOT,
                      confirmationModalTitle: DeleteModalTitles.PLOT,
                    });
                  };

                  return <PlotItemEdit
                    key={index}
                    field={plot}
                    index={index}
                    onRemove={handleDelete}
                    plotsData={plotsData}
                  />;
                })}
              </BoxItemContainer>
            }

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_PLOT)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={!fields.length ? 'no-top-margin' : ''}
                    label={buttonTitle}
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type AddressProps = {
  attributes: Attributes,
  change: Function,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const Address = ({
  attributes,
  change,
  field,
  isSaveClicked,
  onRemove,
  usersPermissions,
}: AddressProps) => {
  const handleAddressChange = (details: Object) => {
    change(formName, `${field}.postal_code`, details.postalCode);
    change(formName, `${field}.city`, details.city);
  };

  return(
    <Row>
      <Column small={6} large={4}>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)}
            invisibleLabel
            name={`${field}.address`}
            valueSelectedCallback={handleAddressChange}
            overrideValues={{fieldType: FieldTypes.ADDRESS, label: LeaseAreaAddressesFieldTitles.ADDRESS}}
          />
        </Authorization>
      </Column>
      <Column small={3} large={2}>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)}
            invisibleLabel
            name={`${field}.postal_code`}
            overrideValues={{label: LeaseAreaAddressesFieldTitles.POSTAL_CODE}}
          />
        </Authorization>
      </Column>
      <Column small={2} large={2}>
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.CITY)}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={getFieldAttributes(attributes, LeaseAreaAddressesFieldPaths.CITY)}
            invisibleLabel
            name={`${field}.city`}
            overrideValues={{label: LeaseAreaAddressesFieldTitles.CITY}}
          />
        </Authorization>
      </Column>
      <Column small={1}>
        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASEAREAADDRESS)}>
          <RemoveButton
            className='third-level'
            onClick={onRemove}
            title="Poista osoite"
          />
        </Authorization>
      </Column>
    </Row>
  );
};

type AddressesProps = {
  attributes: Attributes,
  change: Function,
  fields: any,
  isSaveClicked: boolean,
  usersPermissions: UsersPermissionsType,
}

const AddressItems = ({attributes, change, fields, isSaveClicked, usersPermissions}: AddressesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.ADDRESSES)}>
              {LeaseAreaAddressesFieldTitles.ADDRESSES}
            </SubTitle>
            {fields && !!fields.length &&
              <Row>
                <Column small={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)}>
                    <FormTextTitle
                      required={isFieldRequired(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.ADDRESS)}
                    >
                      {LeaseAreaAddressesFieldTitles.ADDRESS}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)}>
                    <FormTextTitle
                      required={isFieldRequired(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.POSTAL_CODE)}
                    >
                      {LeaseAreaAddressesFieldTitles.POSTAL_CODE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.CITY)}>
                    <FormTextTitle
                      required={isFieldRequired(attributes, LeaseAreaAddressesFieldPaths.CITY)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseAreaAddressesFieldPaths.CITY)}
                    >
                      {LeaseAreaAddressesFieldTitles.CITY}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }
            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.ADDRESS,
                  confirmationModalTitle: DeleteModalTitles.ADDRESS,
                });
              };

              return (
                <Address
                  key={index}
                  attributes={attributes}
                  change={change}
                  field={field}
                  isSaveClicked={isSaveClicked}
                  onRemove={handleRemove}
                  usersPermissions={usersPermissions}
                />
              );
            })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEAREAADDRESS)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää osoite'
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
  areaId: number,
  attributes: Attributes,
  change: Function,
  errors: ?Object,
  field: string,
  geometry: ?Object,
  isSaveClicked: boolean,
  location: Object,
  planUnitsContractCollapseState: boolean,
  planUnitsCurrentCollapseState: boolean,
  plotsContractCollapseState: boolean,
  plotsCurrentCollapseState: boolean,
  receiveCollapseStates: Function,
  savedArea: Object,
  usersPermissions: UsersPermissionsType,
}

class LeaseAreaEdit extends PureComponent<Props> {
  handlePlanUnitContractCollapseToggle = (val: boolean) => {
    const {areaId, receiveCollapseStates} = this.props;

    if(!areaId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LEASE_AREAS]: {
          [areaId]: {
            plan_units_contract: val,
          },
        },
      },
    });
  };

  handlePlanUnitCurrentCollapseToggle = (val: boolean) => {
    const {areaId, receiveCollapseStates} = this.props;

    if(!areaId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LEASE_AREAS]: {
          [areaId]: {
            plan_units_current: val,
          },
        },
      },
    });
  };

  handlePlotsContractCollapseToggle = (val: boolean) => {
    const {areaId, receiveCollapseStates} = this.props;

    if(!areaId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LEASE_AREAS]: {
          [areaId]: {
            plots_contract: val,
          },
        },
      },
    });
  };

  handlePlotsCurrentCollapseToggle = (val: boolean) => {
    const {areaId, receiveCollapseStates} = this.props;

    if(!areaId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LEASE_AREAS]: {
          [areaId]: {
            plots_current: val,
          },
        },
      },
    });
  };

  getMapLinkUrl = () => {
    const {
      areaId,
      location: {pathname, search},
    } = this.props;
    const searchQuery = getUrlParams(search);

    delete searchQuery.plan_unit;
    delete searchQuery.plot;
    searchQuery.lease_area = areaId,
    searchQuery.tab = 7;

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
      plotsContractCollapseState,
      plotsCurrentCollapseState,
      savedArea,
      usersPermissions,
    } = this.props;
    const mapLinkUrl = this.getMapLinkUrl();

    return (
      <Fragment>
        <BoxContentWrapper>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.IDENTIFIER)}
                  name={`${field}.identifier`}
                  overrideValues={{label: LeaseAreasFieldTitles.IDENTIFIER}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.IDENTIFIER)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.TYPE)}
                  name={`${field}.type`}
                  overrideValues={{label: LeaseAreasFieldTitles.TYPE}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.TYPE)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.AREA)}
                  name={`${field}.area`}
                  unit='m²'
                  overrideValues={{label: LeaseAreasFieldTitles.AREA}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.AREA)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.LOCATION)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.LOCATION)}
                  name={`${field}.location`}
                  overrideValues={{label: LeaseAreasFieldTitles.LOCATION}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.LOCATION)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.GEOMETRY)}>
                {!isEmpty(geometry) &&
                  <Link to={mapLinkUrl}>{LeaseAreasFieldTitles.GEOMETRY}</Link>
                }
              </Authorization>
            </Column>
          </Row>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
            <FieldArray
              attributes={attributes}
              change={change}
              component={AddressItems}
              isSaveClicked={isSaveClicked}
              name={`${field}.addresses`}
              usersPermissions={usersPermissions}
            />
          </Authorization>
        </BoxContentWrapper>

        <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.PLOTS)}>
          <Row>
            <Column small={12} large={6}>
              <FieldArray
                attributes={attributes}
                buttonTitle='Lisää kiinteistö/määräala'
                collapseState={plotsContractCollapseState}
                component={renderPlots}
                errors={errors}
                isSaveClicked={isSaveClicked}
                name={`${field}.plots_contract`}
                noDataText='Ei kiinteistöjä/määräaloja sopimuksessa'
                onCollapseToggle={this.handlePlotsContractCollapseToggle}
                plotsData={get(savedArea, 'plots_contract', [])}
                title='Kiinteistöt / määräalat sopimuksessa'
                uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.PLOTS_CONTRACT)}
                usersPermissions={usersPermissions}
              />
            </Column>
            <Column small={12} large={6}>
              <FieldArray
                attributes={attributes}
                buttonTitle='Lisää kiinteistö/määräala'
                collapseState={plotsCurrentCollapseState}
                component={renderPlots}
                errors={errors}
                isSaveClicked={isSaveClicked}
                name={`${field}.plots_current`}
                noDataText='Ei kiinteistöjä/määräaloja nykyhetkellä'
                onCollapseToggle={this.handlePlotsCurrentCollapseToggle}
                plotsData={get(savedArea, 'plots_current', [])}
                title='Kiinteistöt / määräalat nykyhetkellä'
                uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.PLOTS)}
                usersPermissions={usersPermissions}
              />
            </Column>
          </Row>
        </Authorization>

        <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNITS)}>
          <Row>
            <Column small={12} large={6}>
              <FieldArray
                attributes={attributes}
                buttonTitle='Lisää kaavayksikkö'
                collapseState={planUnitsContractCollapseState}
                component={renderPlanUnits}
                errors={errors}
                isSaveClicked={isSaveClicked}
                name={`${field}.plan_units_contract`}
                noDataText='Ei kaavayksiköitä sopimuksessa'
                onCollapseToggle={this.handlePlanUnitContractCollapseToggle}
                title='Kaavayksiköt sopimuksessa'
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNITS_CONTRACT)}
                usersPermissions={usersPermissions}
              />
            </Column>
            <Column small={12} large={6}>
              <FieldArray
                attributes={attributes}
                buttonTitle='Lisää kaavayksikkö'
                collapseState={planUnitsCurrentCollapseState}
                component={renderPlanUnits}
                errors={errors}
                isSaveClicked={isSaveClicked}
                name={`${field}.plan_units_current`}
                noDataText='Ei kaavayksiköitä nykyhetkellä'
                onCollapseToggle={this.handlePlanUnitCurrentCollapseToggle}
                title='Kaavayksiköt nykyhetkellä'
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNITS)}
                usersPermissions={usersPermissions}
              />
            </Column>
          </Row>
        </Authorization>
      </Fragment>
    );
  }
}

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);

export default flowRight(
  // $FlowFixMe
  withRouter,
  connect(
    (state, props) => {
      const id = selector(state, `${props.field}.id`);

      return {
        areaId: id,
        attributes: getAttributes(state),
        errors: getErrorsByFormName(state, formName),
        geometry: selector(state, `${props.field}.geometry`),
        isSaveClicked: getIsSaveClicked(state),
        planUnitsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plan_units_contract`),
        planUnitsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plan_units_current`),
        plotsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plots_contract`),
        plotsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plots_current`),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      change,
      receiveCollapseStates,
    }
  ),
)(LeaseAreaEdit);
