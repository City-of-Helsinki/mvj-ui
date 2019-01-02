// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, getFormValues, initialize, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import ArchiveAreaModal from './ArchiveAreaModal';
import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import Divider from '$components/content/Divider';
import LeaseAreaWithArchiveInfoEdit from './LeaseAreaWithArchiveInfoEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {copyAreasToContract, receiveFormValidFlags} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {
  AreaLocation,
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseAreasFieldPaths,
} from '$src/leases/enums';
import {getDecisionOptions} from '$src/decision/helpers';
import {getAreasSum, getContentLeaseAreas, getLeaseAreaById} from '$src/leases/helpers';
import {formatNumber, isFieldAllowedToEdit, isFieldAllowedToRead} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';
import {store} from '$src/root/startApp';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type AreaItemProps = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
  fields: any,
  isActive: boolean,
  onArchive: Function,
  onUnarchive: Function,
}

class renderLeaseAreas extends PureComponent<AreaItemProps> {
  handleAdd = () => {
    const {fields} = this.props;
    fields.push({
      addresses: [{}],
      location: AreaLocation.SURFACE,
    });
  }

  removeArea = (index: number) => {
    const {fields} = this.props;
    fields.remove(index);
  }

  render() {
    const {
      attributes,
      decisionOptions,
      fields,
      isActive,
      onArchive,
      onUnarchive,
    } = this.props;

    return (
      <AppConsumer>
        {({dispatch}) => {
          return(
            <div>{!isActive && !!fields && !!fields.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
              {fields && !!fields.length && fields.map((area, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.LEASE_AREA,
                    confirmationModalTitle: DeleteModalTitles.LEASE_AREA,
                  });
                };

                return <LeaseAreaWithArchiveInfoEdit
                  key={index}
                  decisionOptions={decisionOptions}
                  field={area}
                  index={index}
                  isActive={isActive}
                  onArchive={onArchive}
                  onRemove={handleRemove}
                  onUnarchive={onUnarchive}
                />;
              })}
              {isActive &&
                <Row>
                  <Column>
                    <Authorization allow={isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.LEASE_AREAS)}>
                      <AddButton
                        label='Lisää kohde'
                        onClick={this.handleAdd}
                      />
                    </Authorization>
                  </Column>
                </Row>
              }
            </div>
          );
        }}
      </AppConsumer>
    );
  }
}

type Props = {
  attributes: Attributes,
  change: Function,
  copyAreasToContract: Function,
  currentLease: Lease,
  decisions: Array<Object>,
  editedActiveAreas: Array<Object>,
  editedArchivedAreas: Array<Object>,
  initialize: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  areasSum: ?number,
  areaToArchive: ?Object,
  areaIndexToArchive: ?number,
  currentLease: ?Lease,
  decisions: Array<Object>,
  decisionOptions: Array<Object>,
  showArchiveAreaModal: boolean,
}

class LeaseAreasEdit extends PureComponent<Props, State> {
  activeAreasComponent: any
  archivedAreasComponent: any

  state = {
    areasSum: null,
    areaToArchive: null,
    areaIndexToArchive: null,
    currentLease: null,
    decisions: [],
    decisionOptions: [],
    showArchiveAreaModal: false,
  }

  setActiveAreasRef = (el: any) => {
    this.activeAreasComponent = el;
  }

  setArchivedAreasRef = (el: any) => {
    this.archivedAreasComponent = el;
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      const areas = getContentLeaseAreas(props.currentLease),
        activeAreas = areas.filter((area) => !area.archived_at);

      newState.areas = areas;
      newState.areasSum = getAreasSum(activeAreas);
      newState.currentLease = props.currentLease;
    }

    if(props.decisions !== state.decisions) {
      newState.decisions = props.decisions;
      newState.decisionOptions = getDecisionOptions(props.decisions);
    }

    return newState;
  }

  componentDidUpdate(prevProps: Props) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LEASE_AREAS]: this.props.valid,
      });
    }

    if(prevProps.currentLease !== this.props.currentLease) {
      this.addCopiedPlotsAndPlanUnits();
    }
  }

  addCopiedPlotsAndPlanUnits = () => {
    const {change, currentLease} = this.props;
    const formValues = getFormValues(formName)(store.getState());

    const addContractItemsToArea = (area: Object) => {
      const savedArea = getLeaseAreaById(currentLease, area.id);

      if(savedArea) {
        return {
          ...area,
          plan_units_contract: savedArea.plan_units_contract,
          plots_contract: savedArea.plots_contract,
        };
      }
      return {...area, plan_units_contract: [], plots_contract: []};
    };

    change('lease_areas_active', formValues.lease_areas_active.map((area) => addContractItemsToArea(area)));
    change('lease_areas_archived', formValues.lease_areas_archived.map((area) => addContractItemsToArea(area)));
  }

  showArchiveAreaModal = (index: number, area: Object) => {
    const {initialize} = this.props;

    this.setState({
      areaToArchive: area,
      areaIndexToArchive: index,
      showArchiveAreaModal: true,
    });

    initialize(FormNames.ARCHIVE_AREA, {});
  }

  handleHideArchiveAreaModal = () => {
    this.setState({
      areaIndexToArchive: null,
      areaToArchive: null,
      showArchiveAreaModal: false,
    });
  }

  handleArchive = (archiveInfo: Object) => {
    const {areaToArchive, areaIndexToArchive} = this.state;
    this.activeAreasComponent.getRenderedComponent().removeArea(areaIndexToArchive);
    this.addArchivedItemToActiveItems({
      ...areaToArchive,
      ...archiveInfo,
    });
    this.handleHideArchiveAreaModal();
  }

  addArchivedItemToActiveItems = (item: Object) => {
    const {change, editedArchivedAreas} = this.props,
      newItems = [...editedArchivedAreas, item];

    change('lease_areas_archived', newItems);
  }

  handleUnarchive = (index: number, item: Object) => {
    this.archivedAreasComponent.getRenderedComponent().removeArea(index);
    this.addUnarchivedItemToArchivedItems(item);
  }

  addUnarchivedItemToArchivedItems = (item: Object) => {
    const {change, editedActiveAreas} = this.props,
      newItems = [...editedActiveAreas, {
        ...item,
        archived_at: null,
        archived_note: null,
        archived_decision: null,
      }];

    change('lease_areas_active', newItems);
  }

  render () {
    const {
      areasSum,
      decisionOptions,
      showArchiveAreaModal,
    } = this.state;
    const {attributes} = this.props;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleCopyAreasToContract = () => {
            const {copyAreasToContract, currentLease} = this.props;

            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                copyAreasToContract(currentLease.id);
              },
              confirmationModalButtonClassName: ButtonColors.SUCCESS,
              confirmationModalButtonText: 'Kopioi sopimukseen',
              confirmationModalLabel: 'Haluatko varmasti kopioda nykyhetken kiinteistöt, määräalat ja kaavayksiköt sopimukseen?',
              confirmationModalTitle: 'Kopioi sopimukseen',
            });
          };

          const handleUnarchive = (index: number, area: Object) => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.handleUnarchive(index, area);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: 'Siirrä arkistosta',
              confirmationModalLabel: 'Haluatko varmasti siirtää kohteen pois arkistosta?',
              confirmationModalTitle: 'Siirrä arkistosta',
            });
          };

          return(
            <form>
              <Authorization allow={isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.ARCHIVED_AT)}>
                <ArchiveAreaModal
                  decisionOptions={decisionOptions}
                  onArchive={this.handleArchive}
                  onCancel={this.handleHideArchiveAreaModal}
                  onClose={this.handleHideArchiveAreaModal}
                  open={showArchiveAreaModal}
                />
              </Authorization>

              <h2>Vuokra-alue</h2>
              <RightSubtitle
                buttonComponent={
                  <Button
                    className={ButtonColors.NEUTRAL}
                    onClick={handleCopyAreasToContract}
                    text='Kopioi sopimukseen'
                  />
                }
                text={
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
                    <span>Kokonaispinta-ala {formatNumber(areasSum) || '-'} m<sup>2</sup></span>
                  </Authorization>
                }
              />
              <Divider />

              <FieldArray
                ref={this.setActiveAreasRef}
                attributes={attributes}
                component={renderLeaseAreas}
                decisionOptions={decisionOptions}
                isActive={true}
                name="lease_areas_active"
                onArchive={this.showArchiveAreaModal}
                withRef={true}
              />

              {/* Archived lease areas */}
              <FieldArray
                ref={this.setArchivedAreasRef}
                attributes={attributes}
                component={renderLeaseAreas}
                decisionOptions={decisionOptions}
                isActive={false}
                name='lease_areas_archived'
                onUnarchive={handleUnarchive}
                withRef={true}
              />
            </form>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);

export default flowRight(
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        attributes: getAttributes(state),
        currentLease: currentLease,
        decisions: getDecisionsByLease(state, currentLease.id),
        editedActiveAreas: selector(state, 'lease_areas_active'),
        editedArchivedAreas: selector(state, 'lease_areas_archived'),
      };
    },
    {
      copyAreasToContract,
      initialize,
      receiveFormValidFlags,
    }
  ),

)(LeaseAreasEdit);
