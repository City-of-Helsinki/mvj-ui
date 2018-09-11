//@flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector} from 'redux-form';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import PlanUnitItemEdit from './PlanUnitItemEdit';
import PlotItemEdit from './PlotItemEdit';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

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
            headerTitle={<h4 className='collapse__header-title'>{title}</h4>}
            onToggle={handleCollapseToggle}
          >
            <BoxItemContainer>
              {fields.map((planunit, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_DELETE_MODAL,
                    deleteFunction: () => {
                      fields.remove(index);
                    },
                    deleteModalLabel: DeleteModalLabels.PLAN_UNIT,
                    deleteModalTitle: DeleteModalTitles.PLAN_UNIT,
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
                  label={buttonTitle}
                  onClick={handleAdd}
                  title={buttonTitle}
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

  const handleCollapseToggle = (val: boolean) => onCollapseToggle(val);

  const plotErrors = get(errors, name);

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(plotErrors)}
            headerTitle={<h4 className='collapse__header-title'>{title}</h4>}
            onToggle={handleCollapseToggle}
          >
            <BoxItemContainer>
              {fields.map((plot, index) => {
                const handleDelete = () => {
                  dispatch({
                    type: ActionTypes.SHOW_DELETE_MODAL,
                    deleteFunction: () => {
                      fields.remove(index);
                    },
                    deleteModalLabel: DeleteModalLabels.PLOT,
                    deleteModalTitle: DeleteModalTitles.PLOT,
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
                  label={buttonTitle}
                  onClick={handleAdd}
                  title={buttonTitle}
                />
              </Column>
            </Row>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type AddressesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const AddressItems = ({attributes, fields, isSaveClicked}: AddressesProps): Element<*> => {
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
                  <FormFieldLabel required>Osoite</FormFieldLabel>
                </Column>
                <Column small={3} large={2}>
                  <FormFieldLabel>Postinumero</FormFieldLabel>
                </Column>
                <Column small={3} large={2}>
                  <FormFieldLabel>Kaupunki</FormFieldLabel>
                </Column>
              </Row>
            }
            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.ADDRESS,
                  deleteModalTitle: DeleteModalTitles.ADDRESS,
                });
              };

              return (
                <Row key={index}>
                  <Column small={6} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.address')}
                      name={`${field}.address`}
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                  <Column small={3} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.postal_code')}
                      name={`${field}.postal_code`}
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                  <Column small={2} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.addresses.child.children.city')}
                      name={`${field}.city`}
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                  <Column small={1}>
                    <RemoveButton
                      className='third-level'
                      onClick={handleRemove}
                      title="Poista osoite"
                    />
                  </Column>
                </Row>
              );
            }

            )}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää osoite'
                  onClick={handleAdd}
                  title='Lisää osoite'
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type AreaItemProps = {
  areaId: number,
  attributes: Attributes,
  errors: ?Object,
  field: string,
  isSaveClicked: boolean,
  planUnitsContractCollapseState: boolean,
  planUnitsCurrentCollapseState: boolean,
  plotsContractCollapseState: boolean,
  plotsCurrentCollapseState: boolean,
  receiveCollapseStates: Function,
  savedArea: Object,
}

const LeaseAreaEdit = ({
  areaId,
  attributes,
  errors,
  field,
  isSaveClicked,
  planUnitsContractCollapseState,
  planUnitsCurrentCollapseState,
  plotsContractCollapseState,
  plotsCurrentCollapseState,
  receiveCollapseStates,
  savedArea,
}: AreaItemProps): Element<*> => {
  const handlePlanUnitContractCollapseToggle = (val: boolean) => {
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

  const handlePlanUnitCurrentCollapseToggle = (val: boolean) => {
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

  const handlePlotsContractCollapseToggle = (val: boolean) => {
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

  const handlePlotsCurrentCollapseToggle = (val: boolean) => {
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
        </Row>

        <FieldArray
          attributes={attributes}
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
            onCollapseToggle={handlePlotsContractCollapseToggle}
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
            onCollapseToggle={handlePlotsCurrentCollapseToggle}
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
            onCollapseToggle={handlePlanUnitContractCollapseToggle}
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
            onCollapseToggle={handlePlanUnitCurrentCollapseToggle}
            title='Kaavayksiköt nykyhetkellä'
          />
        </Column>
      </Row>
    </div>
  );
};


const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);

    return {
      areaId: id,
      attributes: getAttributes(state),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      planUnitsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plan_units_contract`),
      planUnitsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plan_units_current`),
      plotsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plots_contract`),
      plotsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.plots_current`),
    };
  },
  {
    receiveCollapseStates,
  }
)(LeaseAreaEdit);
