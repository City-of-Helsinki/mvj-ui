//@flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {change, FieldArray, formValueSelector, getFormValues} from 'redux-form';
import {Link, withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import PlanUnitItemEdit from './PlanUnitItemEdit';
import PlotItemEdit from './PlotItemEdit';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {store} from '$src/root/startApp';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContentPlanUnits, getContentPlots} from '$src/leases/helpers';
import {getSearchQuery} from '$util/helpers';
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type PlanUnitsProps = {
  attributes: Attributes,
  buttonTitle: string,
  collapseState: boolean,
  errors: Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
  title: string,
}

const renderPlanUnits = ({
  attributes,
  buttonTitle,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
  title,
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
            headerTitle={<CollapseHeaderTitle>{title}</CollapseHeaderTitle>}
            onToggle={handleCollapseToggle}
          >
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
                  attributes={attributes}
                  field={planunit}
                  isSaveClicked={isSaveClicked}
                  onRemove={handleRemove}
                />;
              })}
            </BoxItemContainer>
            <Row>
              <Column>
                <AddButtonSecondary
                  className={!fields.length ? 'no-top-margin' : ''}
                  label={buttonTitle}
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type PlotsProps = {
  buttonTitle: string,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
  plotsData: Array<Object>,
  title: string,
}

const renderPlots = ({
  buttonTitle,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
  plotsData,
  title,
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
            headerTitle={<CollapseHeaderTitle>{title}</CollapseHeaderTitle>}
            onToggle={handleCollapseToggle}
          >
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
            <Row>
              <Column>
                <AddButtonSecondary
                  className={!fields.length ? 'no-top-margin' : ''}
                  label={buttonTitle}
                  onClick={handleAdd}
                />
              </Column>
            </Row>
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
}

const Address = ({
  attributes,
  change,
  field,
  isSaveClicked,
  onRemove,
}: AddressProps) => {
  const handleAddressChange = (details: Object) => {
    change(formName, `${field}.postal_code`, details.postalCode);
    change(formName, `${field}.city`, details.city);
  };

  return(
    <Row>
      <Column small={6} large={4}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.address')}
          invisibleLabel
          name={`${field}.address`}
          valueSelectedCallback={handleAddressChange}
          overrideValues={{
            fieldType: 'address',
          }}
        />
      </Column>
      <Column small={3} large={2}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.postal_code')}
          invisibleLabel
          name={`${field}.postal_code`}
        />
      </Column>
      <Column small={2} large={2}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.city')}
          invisibleLabel
          name={`${field}.city`}
        />
      </Column>
      <Column small={1}>
        <RemoveButton
          className='third-level'
          onClick={onRemove}
          title="Poista osoite"
        />
      </Column>
    </Row>
  );
};

type AddressesProps = {
  attributes: Attributes,
  change: Function,
  fields: any,
  isSaveClicked: boolean,
}

const AddressItems = ({attributes, change, fields, isSaveClicked}: AddressesProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <SubTitle>Osoite</SubTitle>
            {fields && !!fields.length &&
              <Row>
                <Column small={6} large={4}>
                  <FormTextTitle required title='Osoite' />
                </Column>
                <Column small={3} large={2}>
                  <FormTextTitle title='Postinumero' />
                </Column>
                <Column small={3} large={2}>
                  <FormTextTitle title='Kaupunki' />
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
                />
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää osoite'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  areaId: number,
  attributes: Attributes,
  change: Function,
  currentLease: Lease,
  errors: ?Object,
  field: string,
  geometry: ?Object,
  isSaveClicked: boolean,
  planUnitsContractCollapseState: boolean,
  planUnitsCurrentCollapseState: boolean,
  plotsContractCollapseState: boolean,
  plotsCurrentCollapseState: boolean,
  receiveCollapseStates: Function,
  router: Object,
  savedArea: Object,
}

class LeaseAreaEdit extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    if(prevProps.currentLease !== this.props.currentLease) {
      const {change, currentLease} = this.props;
      const formValues = getFormValues(formName)(store.getState());
      const leaseAreasActive = formValues.lease_areas_active;
      const leaseAreasArchived = formValues.lease_areas_archived;

      const getFormatedLeaseArea = (area: Object) => {
        if(area.id) {
          const savedArea = get(currentLease, 'lease_areas', []).find((savedArea) => savedArea.id === area.id);
          const contractPlots = getContentPlots(savedArea.plots, true);
          const contractPlanUnits = getContentPlanUnits(savedArea.plan_units, true);
          return {...area, plan_units_contract: contractPlanUnits, plots_contract: contractPlots};
        }
        return {...area, plan_units_contract: [], plots_contract: []};
      };

      const editedLeaseAreasActive = leaseAreasActive.map((area) => getFormatedLeaseArea(area));
      const editedLeaseAreasArchived = leaseAreasArchived.map((area) => getFormatedLeaseArea(area));

      change(formName, 'lease_areas_active', editedLeaseAreasActive);
      change(formName, 'lease_areas_archived', editedLeaseAreasArchived);
    }
  }

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
      router: {location: {pathname, query}},
    } = this.props;

    const tempQuery = {...query};
    delete tempQuery.plan_unit;
    delete tempQuery.plot;
    tempQuery.lease_area = areaId,
    tempQuery.tab = 7;

    return `${pathname}${getSearchQuery(tempQuery)}`;
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
    } = this.props;
    const mapLinkUrl = this.getMapLinkUrl();

    return (
      <div>
        <BoxContentWrapper>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'lease_areas.child.children.identifier')}
                name={`${field}.identifier`}
                overrideValues={{
                  label: 'Kohteen tunnus',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'lease_areas.child.children.type')}
                name={`${field}.type`}
                overrideValues={{
                  label: 'Määritelmä',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'lease_areas.child.children.area')}
                name={`${field}.area`}
                unit='m²'
                overrideValues={{
                  label: 'Pinta-ala',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'lease_areas.child.children.location')}
                name={`${field}.location`}
                overrideValues={{
                  label: 'Sijainti',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              {!isEmpty(geometry) && <Link to={mapLinkUrl}>Karttalinkki</Link>}
            </Column>
          </Row>

          <FieldArray
            attributes={attributes}
            change={change}
            component={AddressItems}
            isSaveClicked={isSaveClicked}
            name={`${field}.addresses`}
          />

        </BoxContentWrapper>
        <Row>
          <Column small={12} large={6}>
            <FieldArray
              buttonTitle='Lisää kiinteistö/määräala'
              collapseState={plotsContractCollapseState}
              component={renderPlots}
              errors={errors}
              isSaveClicked={isSaveClicked}
              name={`${field}.plots_contract`}
              onCollapseToggle={this.handlePlotsContractCollapseToggle}
              plotsData={get(savedArea, 'plots_contract', [])}
              title='Kiinteistöt / määräalat sopimuksessa'
            />
          </Column>
          <Column small={12} large={6}>
            <FieldArray
              buttonTitle='Lisää kiinteistö/määräala'
              collapseState={plotsCurrentCollapseState}
              component={renderPlots}
              errors={errors}
              isSaveClicked={isSaveClicked}
              name={`${field}.plots_current`}
              onCollapseToggle={this.handlePlotsCurrentCollapseToggle}
              plotsData={get(savedArea, 'plots_current', [])}
              title='Kiinteistöt / määräalat nykyhetkellä'
            />
          </Column>
        </Row>
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
              onCollapseToggle={this.handlePlanUnitContractCollapseToggle}
              title='Kaavayksiköt sopimuksessa'
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
              onCollapseToggle={this.handlePlanUnitCurrentCollapseToggle}
              title='Kaavayksiköt nykyhetkellä'
            />
          </Column>
        </Row>
      </div>
    );
  }
}

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);

export default flowRight(
  withRouter,
  connect(
    (state, props) => {
      const id = selector(state, `${props.field}.id`);

      return {
        areaId: id,
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        errors: getErrorsByFormName(state, formName),
        geometry: selector(state, `${props.field}.geometry`),
        isSaveClicked: getIsSaveClicked(state),
        planUnitsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plan_units_contract`),
        planUnitsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plan_units_current`),
        plotsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plots_contract`),
        plotsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plots_current`),
      };
    },
    {
      change,
      receiveCollapseStates,
    }
  ),
)(LeaseAreaEdit);
