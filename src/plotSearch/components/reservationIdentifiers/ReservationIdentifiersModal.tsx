import React, { Component } from "react";
import { formValueSelector, initialize, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { flowRight } from "lodash/util";
import classNames from "classnames";
import { padStart } from "lodash/string";
import Modal from "/src/components/modal/Modal";
import ModalButtonWrapper from "/src/components/modal/ModalButtonWrapper";
import Button from "/src/components/button/Button";
import { ButtonColors } from "/src/components/enums";
import SortableTable from "/src/components/table/SortableTable";
import { getCurrentPlotSearch, getIsBatchCreatingReservationIdentifiers, getLastBatchReservationCreationError, getReservationIdentifierUnitLists } from "/src/plotSearch/selectors";
import type { PlotSearch } from "/src/plotSearch/types";
import EditButton from "/src/components/form/EditButton";
import CreateLeaseForm from "/src/leases/components/createLease/CreateLeaseForm";
import { FieldTypes, FormNames } from "enums";
import { fetchAttributes as fetchLeaseAttributes } from "/src/leases/actions";
import { getAttributes as getLeaseAttributes } from "/src/leases/selectors";
import { LeaseFieldPaths, LeaseState } from "/src/leases/enums";
import SubTitle from "/src/components/content/SubTitle";
import { batchCreateReservationIdentifiers, fetchReservationIdentifierUnitLists, fetchSinglePlotSearch } from "/src/plotSearch/actions";
import FormField from "/src/components/form/FormField";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import ErrorBlock from "/src/components/form/ErrorBlock";
type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
};
type Props = OwnProps & {
  currentPlotSearch: PlotSearch;
  fetchLeaseAttributes: (...args: Array<any>) => any;
  leaseAttributesFetched: boolean;
  initialize: (...args: Array<any>) => any;
  initializeForm: (...args: Array<any>) => any;
  batchCreateReservationIdentifiers: (...args: Array<any>) => any;
  isBatchCreatingReservationIdentifiers: boolean;
  fetchSinglePlotSearch: (...args: Array<any>) => any;
  rowsToCreate: Array<Record<string, any>>;
  errors: any;
  fetchReservationIdentifierUnitLists: (...args: Array<any>) => any;
  reservationIdentifierUnitLists: null | Record<string, any>;
};
type State = {
  editorTarget: number | null;
  rowData: Array<Record<string, any>>;
};

class ReservationIdentifiersModal extends Component<Props, State> {
  state: State = {
    editorTarget: null,
    rowData: []
  };

  componentDidMount(): void {
    const {
      fetchReservationIdentifierUnitLists
    } = this.props;
    fetchReservationIdentifierUnitLists();
  }

  componentDidUpdate(prevProps: Props): void {
    const {
      isOpen,
      fetchLeaseAttributes,
      leaseAttributesFetched,
      reservationIdentifierUnitLists
    } = this.props;

    if (isOpen && !prevProps.isOpen && !leaseAttributesFetched) {
      fetchLeaseAttributes();
    }

    if (isOpen && !prevProps.isOpen) {
      this.initializeRowData();
    }

    if (reservationIdentifierUnitLists && !prevProps.reservationIdentifierUnitLists) {
      this.setState(state => ({
        rowData: state.rowData.map(row => ({ ...row,
          suggestedLeaseIdentifier: this.convertLeaseOptionsToIdentifier(row.leaseOptions)
        }))
      }));
    }
  }

  initializeRowData = () => {
    const {
      currentPlotSearch,
      initialize
    } = this.props;
    const data = currentPlotSearch.plot_search_targets.reduce((acc, target) => {
      const leaseOptions = {
        municipality: target.municipality_id,
        district: target.district?.id,
        type: target.lease_type,
        state: LeaseState.RESERVATION
      };
      return [...acc, {
        index: acc.length,
        targetId: target.id,
        leaseId: target.lease_id,
        targetIdentifier: target.plan_unit?.identifier || target.custom_detailed_plan?.identifier,
        leaseIdentifier: target.lease_identifier,
        suggestedLeaseIdentifier: this.convertLeaseOptionsToIdentifier(leaseOptions),
        reservationIdentifier: target.reservation_readable_identifier,
        intendedUse: (target.plan_unit?.intended_use || target.custom_detailed_plan?.intended_use)?.name,
        applicants: target.reservation_recipients.map(group => `${group.reservation_recipients.join(', ')} (${group.share_of_rental})`).join('; '),
        leaseOptions,
        disabled: !!target.reservation_identifier
      }];
    }, []);
    this.setState(() => ({
      rowData: data
    }));
    initialize({
      rowsToCreate: data.map(row => ({
        selected: !row.reservationIdentifier
      }))
    });
  };
  selectEditorTarget = (index: number | null, row?: Record<string, any>) => {
    const {
      initializeForm
    } = this.props;

    if (index !== null) {
      initializeForm(FormNames.LEASE_CREATE_MODAL, {
        [LeaseFieldPaths.MUNICIPALITY]: row.leaseOptions.municipality,
        [LeaseFieldPaths.DISTRICT]: row.leaseOptions.district,
        [LeaseFieldPaths.TYPE]: row.leaseOptions.type,
        [LeaseFieldPaths.STATE]: row.leaseOptions.state
      });
    }

    this.setState(() => ({
      editorTarget: index
    }));
  };
  handleEditFinished = (leaseData: Record<string, any>) => {
    if (this.state.editorTarget !== null) {
      const index = this.state.editorTarget;
      this.setState(state => {
        const newRowData = [...state.rowData];
        newRowData.splice(index, 1, { ...state.rowData[index],
          suggestedLeaseIdentifier: this.convertLeaseOptionsToIdentifier(leaseData),
          leaseOptions: leaseData
        });
        return {
          rowData: newRowData
        };
      });
    }
  };
  handleSubmit = () => {
    const {
      batchCreateReservationIdentifiers,
      onClose,
      fetchSinglePlotSearch,
      currentPlotSearch,
      rowsToCreate
    } = this.props;
    const {
      rowData
    } = this.state;
    batchCreateReservationIdentifiers({
      data: rowData.filter(row => rowsToCreate[row.index].selected).map(row => ({ ...row.leaseOptions,
        targetId: row.targetId,
        leaseId: row.leaseId
      })),
      callback: () => {
        onClose();
        fetchSinglePlotSearch(currentPlotSearch.id);
      }
    });
  };
  convertLeaseOptionsToIdentifier = (options: Record<string, any>) => {
    const {
      reservationIdentifierUnitLists
    } = this.props;

    if (!reservationIdentifierUnitLists) {
      return '...';
    }

    const type = reservationIdentifierUnitLists.types.find(candidate => candidate.id === options.type);
    const municipality = reservationIdentifierUnitLists.municipalities.find(candidate => candidate.id === options.municipality);
    const district = reservationIdentifierUnitLists.districts.find(candidate => candidate.id === options.district);
    return `${type?.identifier || '??'}${municipality?.identifier || '?'}${padStart(district?.identifier || '??', 2, '0')}`;
  };

  render(): React.ReactNode {
    const {
      isOpen,
      onClose,
      currentPlotSearch,
      leaseAttributesFetched,
      isBatchCreatingReservationIdentifiers,
      rowsToCreate,
      errors
    } = this.props;
    const {
      editorTarget,
      rowData
    } = this.state;
    const selectedRowsCount = rowsToCreate?.filter(row => row.selected).length || 0;

    if (!currentPlotSearch?.id && !leaseAttributesFetched) {
      return null;
    }

    const currentModalTitle = editorTarget !== null ? 'Muokkaa varaustunnusta' : 'Varaustunnukset';
    return <Modal isOpen={isOpen} onClose={() => {
      if (editorTarget) {
        this.selectEditorTarget(null);
      } else {
        onClose();
      }
    }} title={currentModalTitle} className={classNames('ReservationIdentifiersModal', {
      'ReservationIdentifiersModal--row-edit': editorTarget !== null
    })}>
        {editorTarget === null ? <>
            <SortableTable listTable sortable columns={[{
          key: 'checkbox',
          text: '',
          sortable: false,
          renderer: (_, row) => <>
                    {!row.disabled && <FormField name={`rowsToCreate[${row.index}].selected`} fieldAttributes={{
              type: FieldTypes.CHECKBOX,
              label: '',
              read_only: false
            }} invisibleLabel disabled={isBatchCreatingReservationIdentifiers} />}
                  </>,
          style: {
            width: '24px'
          }
        }, {
          key: 'targetIdentifier',
          text: 'Kohteen tunnus'
        }, {
          key: 'leaseIdentifier',
          text: <>Vuokraustunnus<br />nykyisin</>
        }, {
          key: 'suggestedLeaseIdentifier',
          text: <>Ehdotettu<br />vuokraustunnus</>
        }, {
          key: 'intendedUse',
          text: 'Käyttötarkoitus'
        }, {
          key: 'applicants',
          text: <>Ehdotettu<br />varauksensaaja</>
        }, {
          key: 'reservationIdentifier',
          text: 'Varaustunnus',
          renderer: identifier => identifier || 'Ei vielä luotu'
        }, {
          key: 'index',
          text: 'Muokkaa',
          sortable: false,
          renderer: (id, row) => <>{!row.disabled && <EditButton className='inline-button' onClick={() => this.selectEditorTarget(id, row)} title='Muokkaa' />}</>,
          style: {
            width: '80px'
          }
        }]} data={rowData} />
            {errors && <ErrorBlock error={'Varaustunnusten luonti keskeytyi virheeseen. Osa tunnuksista on saattanut jäädä luomatta ja osa luoduista tunnuksista on saattanut jäädä linkittymättä haettuihin kohteisiin. Tarkista ajankohtainen tilanne sivu päivittämällä ja yritä luontia uudelleen.'} />}
            <ModalButtonWrapper>
              <LoaderWrapper className='small-inline-wrapper'>
                <Loader isLoading={isBatchCreatingReservationIdentifiers} className='small' />
              </LoaderWrapper>
              <Button className={ButtonColors.SECONDARY} onClick={onClose} text="Peruuta" />
              <Button onClick={this.handleSubmit} text="Luo varaustunnukset" disabled={selectedRowsCount === 0 || isBatchCreatingReservationIdentifiers} />
            </ModalButtonWrapper>
          </> : <>
            <SubTitle>{rowData[editorTarget].targetIdentifier}</SubTitle>
            <CreateLeaseForm onSubmit={data => {
          this.handleEditFinished(data);
          this.selectEditorTarget(null);
        }} onClose={() => {
          this.selectEditorTarget(null);
        }} allowToChangeRelateTo={false} confirmButtonLabel="Tallenna" />
          </>}
      </Modal>;
  }

}

const formName = 'create-reservation-identifiers';
const selector = formValueSelector(formName);
export default (flowRight(connect(state => ({
  currentPlotSearch: getCurrentPlotSearch(state),
  leaseAttributesFetched: getLeaseAttributes(state) !== null,
  isBatchCreatingReservationIdentifiers: getIsBatchCreatingReservationIdentifiers(state),
  rowsToCreate: selector(state, 'rowsToCreate'),
  errors: getLastBatchReservationCreationError(state),
  reservationIdentifierUnitLists: getReservationIdentifierUnitLists(state)
}), {
  // an initialize bound to the identifiers modal itself will be bound by reduxForm below
  initializeForm: initialize,
  fetchLeaseAttributes,
  batchCreateReservationIdentifiers,
  fetchSinglePlotSearch,
  fetchReservationIdentifierUnitLists
}), reduxForm({
  form: formName,
  destroyOnUnmount: false
}))(ReservationIdentifiersModal) as React.ComponentType<OwnProps>);