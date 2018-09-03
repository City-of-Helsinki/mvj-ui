// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, initialize, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import AddButton from '$components/form/AddButton';
import ArchiveAreaModal from './ArchiveAreaModal';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import FormSection from '$components/form/FormSection';
import LeaseAreaWithArchiveInfoEdit from './LeaseAreaWithArchiveInfoEdit';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import RightSubtitle from '$components/content/RightSubtitle';
import {
  archiveLeaseArea,
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
import {getCurrentLease, getIsArchiveAreaModalOpen, getIsArchiveFetching, getIsUnarchiveAreaModalOpen} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type AreaItemProps = {
  allAreas: Array<Object>,
  archiveLeaseArea: Function,
  areasData: Array<Object>,
  decisionOptions: Array<Object>,
  fields: any,
  hideArchiveAreaModal: Function,
  hideUnarchiveAreaModal: Function,
  initialize: Function,
  isArchiveAreaModalOpen: boolean,
  isUnarchiveAreaModalOpen: boolean,
  isActive: boolean,
  leaseId: number,
  onArchiveCallback: Function,
  onOpenDeleteModal: Function,
  onUnarchiveCallback: Function,
  showArchiveAreaModal: Function,
  showUnarchiveAreaModal: Function,
  unarchiveLeaseArea: Function,
}

type AreaItemState = {
  areaToArchive: ?Object,
  areaIndexToArchive: ?number,
  areaToUnarchive: ?Object,
  areaIndexToUnarchive: ?number,
}

class renderLeaseAreas extends PureComponent<AreaItemProps, AreaItemState> {
  state = {
    areaToArchive: null,
    areaIndexToArchive: null,
    areaToUnarchive: null,
    areaIndexToUnarchive: null,
  }

  componentDidUpdate(prevProps: AreaItemProps) {
    if(!this.props.isActive &&
      (prevProps.isUnarchiveAreaModalOpen && !this.props.isUnarchiveAreaModalOpen) &&
      this.state.areaToUnarchive) {
      this.handleUnarchiveCallback();
    } else if(this.props.isActive &&
      (prevProps.isArchiveAreaModalOpen && !this.props.isArchiveAreaModalOpen) &&
      this.state.areaToArchive) {
      this.handleArchiveCallback();
    }
  }

  handleAdd = () => {
    const {fields} = this.props;
    fields.push({
      addresses: [{}],
      location: AreaLocation.SURFACE,
    });
  }

  handleRemove = (index: ?number) => {
    const {fields} = this.props;
    fields.remove(index);
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
      areaToArchive: null,
    });
    hideArchiveAreaModal();
  }

  handleArchive = (data: Object) => {
    const {allAreas, leaseId, archiveLeaseArea} = this.props;
    const {areaToArchive} = this.state;

    const editedAreas = allAreas.map((area) => {
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
      id: leaseId,
      lease_areas: editedAreas,
    });
  }

  handleArchiveCallback = () => {
    const {onArchiveCallback} = this.props;
    const {areaToArchive, areaIndexToArchive} = this.state;

    this.setState({
      areaToArchive: null,
      areaIndexToArchive: null,
    });
    this.handleRemove(areaIndexToArchive);
    onArchiveCallback(areaToArchive);
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
    const {allAreas, leaseId, unarchiveLeaseArea} = this.props;
    const {areaToUnarchive} = this.state;
    const editedAreas = allAreas.map((area) => {
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
      id: leaseId,
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
    const {onUnarchiveCallback} = this.props;
    const {areaToUnarchive, areaIndexToUnarchive} = this.state;

    this.setState({
      areaToUnarchive: null,
      areaIndexToUnarchive: null,
    });
    this.handleRemove(areaIndexToUnarchive);
    onUnarchiveCallback(areaToUnarchive);
  }

  render() {
    const {
      areasData,
      decisionOptions,
      fields,
      isActive,
      isArchiveAreaModalOpen,
      isUnarchiveAreaModalOpen,
      onOpenDeleteModal,
    } = this.props;

    return (
      <div>
        <ConfirmationModal
          confirmButtonLabel='Poista arkistosta'
          isOpen={isUnarchiveAreaModalOpen}
          label='Haluatko varmasti poistaa kohteen arkistosta?'
          onCancel={this.handleHideUnarchiveAreaModal}
          onClose={this.handleHideUnarchiveAreaModal}
          onSave={this.handleUnarchive}
          title='Poista kohde arkistosta'
        />

        <ArchiveAreaModal
          decisionOptions={decisionOptions}
          isOpen={isArchiveAreaModalOpen}
          onArchive={this.handleArchive}
          onCancel={this.handleHideArchiveAreaModal}
          onClose={this.handleHideArchiveAreaModal}
        />
        {!isActive && !!fields && !!fields.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
        {fields && !!fields.length && fields.map((area, index) =>
          <LeaseAreaWithArchiveInfoEdit
            key={index}
            areasData={areasData}
            decisionOptions={decisionOptions}
            field={area}
            index={index}
            isActive={isActive}
            onArchive={this.handleShowArchiveAreaModal}
            onOpenDeleteModal={onOpenDeleteModal}
            onRemove={this.handleRemove}
            onUnarchive={this.handleShowUnarchiveAreaModal}
          />
        )}
        {isActive &&
          <Row>
            <Column>
              <AddButton
                label='Lisää kohde'
                onClick={this.handleAdd}
                title='Lisää kohde'
              />
            </Column>
          </Row>
        }
      </div>
    );
  }
}

type Props = {
  archiveLeaseArea: Function,
  change: Function,
  currentLease: Lease,
  decisions: Array<Object>,
  editedActiveAreas: Array<Object>,
  editedArchivedAreas: Array<Object>,
  hideArchiveAreaModal: Function,
  hideUnarchiveAreaModal: Function,
  initialize: Function,
  isArchiveAreaModalOpen: boolean,
  isArchiveFetching: boolean,
  isUnarchiveAreaModalOpen: boolean,
  receiveFormValidFlags: Function,
  showArchiveAreaModal: Function,
  showUnarchiveAreaModal: Function,
  valid: boolean,
  unarchiveLeaseArea: Function,
}

type State = {
  areas: Array<Object>,
  areasSum: ?number,
  activeAreas: Array<Object>,
  archivedAreas: Array<Object>,
  currentLease: ?Lease,
  decisionOptions: Array<Object>,
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
}

class LeaseAreasEdit extends PureComponent<Props, State> {
  state = {
    areas: [],
    areasSum: null,
    activeAreas: [],
    archivedAreas: [],
    currentLease: null,
    decisionOptions: [],
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.LEASE_AREA,
    deleteModalTitle: DeleteModalTitles.LEASE_AREA,
    isDeleteModalOpen: false,
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
  }

  handleArchiveCallback = (arcivedArea: any) => {
    const {change, editedArchivedAreas} = this.props,
      newAreas = [...editedArchivedAreas, arcivedArea];

    change('lease_areas_archived', newAreas);
  }

  handleUnarchiveCallback = (unarcivedArea: any) => {
    const {change, editedActiveAreas} = this.props,
      newAreas = [...editedActiveAreas, unarcivedArea];

    change('lease_areas_active', newAreas);
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.LEASE_AREA, modalLabel: string = DeleteModalLabels.LEASE_AREA) => {
    this.setState({
      deleteFunction: fn,
      deleteModalLabel: modalLabel,
      deleteModalTitle: modalTitle,
      isDeleteModalOpen: true,
    });
  }

  handleHideDeleteModal = () => {
    this.setState({
      isDeleteModalOpen: false,
    });
  }

  handleDeleteClick = () => {
    const {deleteFunction} = this.state;
    if(deleteFunction) {
      deleteFunction();
    }
    this.handleHideDeleteModal();
  }

  render () {
    const {
      activeAreas,
      archivedAreas,
      areas,
      areasSum,
      decisionOptions,
      deleteModalLabel,
      deleteModalTitle,
      isDeleteModalOpen,
    } = this.state;
    const {
      archiveLeaseArea,
      currentLease,
      hideArchiveAreaModal,
      hideUnarchiveAreaModal,
      initialize,
      isArchiveAreaModalOpen,
      isArchiveFetching,
      isUnarchiveAreaModalOpen,
      showArchiveAreaModal,
      showUnarchiveAreaModal,
      unarchiveLeaseArea,
    } = this.props;


    return (
      <form>
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteModalOpen}
          label={deleteModalLabel}
          onCancel={this.handleHideDeleteModal}
          onClose={this.handleHideDeleteModal}
          onSave={this.handleDeleteClick}
          title={deleteModalTitle}
        />
        {isArchiveFetching &&
          <LoaderWrapper className='overlay-wrapper'>
            <Loader isLoading={isArchiveFetching} />
          </LoaderWrapper>
        }
        <h2>Vuokra-alue</h2>
        <RightSubtitle text={<span>{formatNumber(areasSum) || '-'} m<sup>2</sup></span>}/>
        <Divider />

        <FormSection>
          <FieldArray
            allAreas={areas}
            archiveLeaseArea={archiveLeaseArea}
            areasData={activeAreas}
            component={renderLeaseAreas}
            decisionOptions={decisionOptions}
            hideArchiveAreaModal={hideArchiveAreaModal}
            initialize={initialize}
            isArchiveAreaModalOpen={isArchiveAreaModalOpen}
            isActive={true}
            leaseId={currentLease.id}
            name="lease_areas_active"
            onArchiveCallback={this.handleArchiveCallback}
            onOpenDeleteModal={this.handleOpenDeleteModal}
            showArchiveAreaModal={showArchiveAreaModal}
          />
          <FieldArray
            allAreas={areas}
            areasData={archivedAreas}
            component={renderLeaseAreas}
            decisionOptions={decisionOptions}
            hideArchiveAreaModal={hideArchiveAreaModal}
            hideUnarchiveAreaModal={hideUnarchiveAreaModal}
            isUnarchiveAreaModalOpen={isUnarchiveAreaModalOpen}
            isActive={false}
            leaseId={currentLease.id}
            name="lease_areas_archived"
            onOpenDeleteModal={this.handleOpenDeleteModal}
            onUnarchiveCallback={this.handleUnarchiveCallback}
            showUnarchiveAreaModal={showUnarchiveAreaModal}
            unarchiveLeaseArea={unarchiveLeaseArea}
          />
        </FormSection>
      </form>
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
        isArchiveFetching: getIsArchiveFetching(state),
        isUnarchiveAreaModalOpen: getIsUnarchiveAreaModalOpen(state),
      };
    },
    {
      archiveLeaseArea,
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
