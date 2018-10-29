// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, initialize, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import ArchiveAreaModal from './ArchiveAreaModal';
import Button from '$components/button/Button';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import FormSection from '$components/form/FormSection';
import LeaseAreaWithArchiveInfoEdit from './LeaseAreaWithArchiveInfoEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {
  archiveLeaseArea,
  copyAreasToContract,
  hideArchiveAreaModal,
  hideUnarchiveAreaModal,
  receiveFormValidFlags,
  showArchiveAreaModal,
  showUnarchiveAreaModal,
  unarchiveLeaseArea,
} from '$src/leases/actions';
import {AreaLocation, DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getDecisionOptions} from '$src/decision/helpers';
import {getAreasSum, getContentLeaseAreas} from '$src/leases/helpers';
import {formatNumber} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getCurrentLease, getIsArchiveAreaModalOpen, getIsUnarchiveAreaModalOpen} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type AreaItemProps = {
  allAreas: Array<Object>,
  areasData: Array<Object>,
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

  removeArea = (index: ?number) => {
    const {fields} = this.props;
    fields.remove(index);
  }

  render() {
    const {
      areasData,
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
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.LEASE_AREA,
                    confirmationModalTitle: DeleteModalTitles.LEASE_AREA,
                  });
                };

                return <LeaseAreaWithArchiveInfoEdit
                  key={index}
                  areasData={areasData}
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
                    <AddButton
                      label='Lisää kohde'
                      onClick={this.handleAdd}
                    />
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
  archiveLeaseArea: Function,
  change: Function,
  copyAreasToContract: Function,
  currentLease: Lease,
  decisions: Array<Object>,
  editedActiveAreas: Array<Object>,
  editedArchivedAreas: Array<Object>,
  hideArchiveAreaModal: Function,
  hideUnarchiveAreaModal: Function,
  initialize: Function,
  isArchiveAreaModalOpen: boolean,
  isUnarchiveAreaModalOpen: boolean,
  receiveFormValidFlags: Function,
  showArchiveAreaModal: Function,
  showUnarchiveAreaModal: Function,
  valid: boolean,
  unarchiveLeaseArea: Function,
}

type State = {
  activeAreas: Array<Object>,
  areas: Array<Object>,
  areasSum: ?number,
  areaToArchive: ?Object,
  areaIndexToArchive: ?number,
  areaToUnarchive: ?Object,
  areaIndexToUnarchive: ?number,
  archivedAreas: Array<Object>,
  currentLease: ?Lease,
  decisionOptions: Array<Object>,
}

class LeaseAreasEdit extends PureComponent<Props, State> {
  archivedLeasesComponent: any
  activeLeasesComponent: any

  state = {
    activeAreas: [],
    areas: [],
    areasSum: null,
    areaToArchive: null,
    areaIndexToArchive: null,
    areaToUnarchive: null,
    areaIndexToUnarchive: null,
    archivedAreas: [],
    currentLease: null,
    decisionOptions: [],
  }

  static getDerivedStateFromProps(props, state) {
    if(!isEqual(props.currentLease, state.currentLease)) {
      const areas = getContentLeaseAreas(props.currentLease),
        activeAreas = areas.filter((area) => !area.archived_at),
        archivedAreas = areas.filter((area) => area.archived_at);

      return {
        areas: areas,
        areasSum: getAreasSum(activeAreas),
        activeAreas: activeAreas,
        archivedAreas: archivedAreas,
        currentLease: props.currentLease,
        decisionOptions: getDecisionOptions(props.decisions),
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LEASE_AREAS]: this.props.valid,
      });
    }

    if((prevProps.isUnarchiveAreaModalOpen && !this.props.isUnarchiveAreaModalOpen) &&
      this.state.areaToUnarchive) {
      this.handleUnarchiveCallback();
    }

    if((prevProps.isArchiveAreaModalOpen && !this.props.isArchiveAreaModalOpen) &&
      this.state.areaToArchive) {
      this.handleArchiveCallback();
    }
  }

  setActiveLeasesRef = (ref: any) => {
    this.activeLeasesComponent = ref;
  }

  setArchivedLeasesRef = (ref: any) => {
    this.archivedLeasesComponent = ref;
  }

  handleShowArchiveAreaModal = (index: number, area: Object) => {
    const {initialize, showArchiveAreaModal} = this.props;

    this.setState({
      areaToArchive: area,
      areaIndexToArchive: index,
    });

    initialize(FormNames.ARCHIVE_AREA, {});
    showArchiveAreaModal();
  }

  handleHideArchiveAreaModal = () => {
    const {hideArchiveAreaModal} = this.props;

    this.setState({
      areaIndexToArchive: null,
      areaToArchive: null,
    });
    hideArchiveAreaModal();
  }

  handleArchive = (data: Object) => {
    const {archiveLeaseArea, currentLease} = this.props;
    const {areas, areaToArchive} = this.state;

    const editedAreas = areas.map((area) => {
      if(area.id === get(areaToArchive, 'id')) {
        return {
          ...areaToArchive,
          ...data,
        };
      }
      return area;
    });

    this.setState({
      areaToArchive: {
        ...areaToArchive,
        ...data,
      },
    });

    archiveLeaseArea({
      id: currentLease.id,
      lease_areas: editedAreas,
    });
  }

  handleArchiveCallback = () => {
    const {areaToArchive, areaIndexToArchive} = this.state;

    this.setState({
      areaToArchive: null,
      areaIndexToArchive: null,
    });
    this.activeLeasesComponent.getRenderedComponent().removeArea(areaIndexToArchive);

    this.changeArchivedAreasValues(areaToArchive);
  }

  changeArchivedAreasValues = (arcivedArea: any) => {
    const {change, editedArchivedAreas} = this.props,
      newAreas = [...editedArchivedAreas, arcivedArea];

    change('lease_areas_archived', newAreas);
  }

  handleShowUnarchiveAreaModal = (index: number, area: Object) => {
    const {showUnarchiveAreaModal} = this.props;

    this.setState({
      areaToUnarchive: area,
      areaIndexToUnarchive: index,
    });
    showUnarchiveAreaModal();
  }

  handleHideUnarchiveAreaModal = () => {
    const {hideUnarchiveAreaModal} = this.props;

    this.setState({
      areaToUnarchive: null,
      areaIndexToUnarchive: null,
    });
    hideUnarchiveAreaModal();
  }

  handleUnarchive = () => {
    const {currentLease, unarchiveLeaseArea} = this.props;
    const {areas, areaToUnarchive} = this.state;
    const editedAreas = areas.map((area) => {
      if(area.id === get(areaToUnarchive, 'id')) {
        return {
          ...areaToUnarchive,
          archived_at: null,
          archived_note: null,
          archived_decision: null,
        };
      }
      return area;
    });

    unarchiveLeaseArea({
      id: currentLease.id,
      lease_areas: editedAreas,
    });
    this.setState({
      areaToUnarchive: {
        ...areaToUnarchive,
        archived_at: null,
        archived_note: null,
        archived_decision: null,
      },
    });
  }

  handleUnarchiveCallback = () => {
    const {areaToUnarchive, areaIndexToUnarchive} = this.state;

    this.setState({
      areaToUnarchive: null,
      areaIndexToUnarchive: null,
    });

    this.archivedLeasesComponent.getRenderedComponent().removeArea(areaIndexToUnarchive);
    this.changeActiveAreasValues(areaToUnarchive);
  }

  changeActiveAreasValues = (unarcivedArea: any) => {
    const {change, editedActiveAreas} = this.props,
      newAreas = [...editedActiveAreas, unarcivedArea];

    change('lease_areas_active', newAreas);
  }

  render () {
    const {
      activeAreas,
      archivedAreas,
      areasSum,
      decisionOptions,
    } = this.state;
    const {
      archiveLeaseArea,
      isArchiveAreaModalOpen,
      isUnarchiveAreaModalOpen,
    } = this.props;


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
              confirmationModalButtonText: 'Kopio sopimukseen',
              confirmationModalLabel: 'Haluatko varmasti kopioda nykyhetken kiinteistöt, määräalat ja kaavayksiköt sopimukseen?',
              confirmationModalTitle: 'Kopio sopimukseen',
            });
          };

          return(
            <form>
              <ArchiveAreaModal
                decisionOptions={decisionOptions}
                isOpen={isArchiveAreaModalOpen}
                onArchive={this.handleArchive}
                onCancel={this.handleHideArchiveAreaModal}
                onClose={this.handleHideArchiveAreaModal}
              />

              <ConfirmationModal
                confirmButtonLabel='Poista arkistosta'
                isOpen={isUnarchiveAreaModalOpen}
                label='Haluatko varmasti poistaa kohteen arkistosta?'
                onCancel={this.handleHideUnarchiveAreaModal}
                onClose={this.handleHideUnarchiveAreaModal}
                onSave={this.handleUnarchive}
                title='Poista kohde arkistosta'
              />

              <h2>Vuokra-alue</h2>
              <RightSubtitle
                buttonComponent={
                  <Button
                    className='button-green'
                    onClick={handleCopyAreasToContract}
                    text='Kopioi sopimukseen'
                  />
                }
                text={<span>Kokonaispinta-ala {formatNumber(areasSum) || '-'} m<sup>2</sup></span>}
              />
              <Divider />

              <FormSection>
                <FieldArray
                  archiveLeaseArea={archiveLeaseArea}
                  areasData={activeAreas}
                  component={renderLeaseAreas}
                  decisionOptions={decisionOptions}
                  ref={this.setActiveLeasesRef}
                  isActive={true}
                  name="lease_areas_active"
                  onArchive={this.handleShowArchiveAreaModal}
                  withRef={true}
                />

                {/* Archived lease areas */}
                <FieldArray
                  areasData={archivedAreas}
                  component={renderLeaseAreas}
                  decisionOptions={decisionOptions}
                  ref={this.setArchivedLeasesRef}
                  isActive={false}
                  name="lease_areas_archived"
                  onArchive={this.handleShowArchiveAreaModal}
                  onUnarchive={this.handleShowUnarchiveAreaModal}
                  onUnarchiveCallback={this.handleUnarchiveCallback}
                  withRef={true}
                />
              </FormSection>
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
        currentLease: currentLease,
        decisions: getDecisionsByLease(state, currentLease.id),
        editedActiveAreas: selector(state, 'lease_areas_active'),
        editedArchivedAreas: selector(state, 'lease_areas_archived'),
        isArchiveAreaModalOpen: getIsArchiveAreaModalOpen(state),
        isUnarchiveAreaModalOpen: getIsUnarchiveAreaModalOpen(state),
      };
    },
    {
      archiveLeaseArea,
      copyAreasToContract,
      hideArchiveAreaModal,
      hideUnarchiveAreaModal,
      initialize,
      receiveFormValidFlags,
      showArchiveAreaModal,
      showUnarchiveAreaModal,
      unarchiveLeaseArea,
    }
  ),

)(LeaseAreasEdit);
