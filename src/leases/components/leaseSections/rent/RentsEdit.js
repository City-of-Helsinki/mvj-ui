// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {reduxForm, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import BasisOfRentsEdit from './BasisOfRentsEdit';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormSectionComponent from '$components/form/FormSection';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentItemEdit from './RentItemEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags} from '$src/leases/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContentRentsFormData} from '$src/leases/helpers';
import {getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type RentsProps = {
  fields: any,
  onOpenDeleteModal: Function,
  rents: Array<Object>,
  showAddButton: boolean,
};

const renderRents = ({
  fields,
  onOpenDeleteModal,
  rents,
  showAddButton,
}:RentsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const handleOpenDeleteModal = (index: number) => {
    onOpenDeleteModal(
      () => fields.remove(index),
      DeleteModalTitles.RENT,
      DeleteModalLabels.RENT,
    );
  };

  return (
    <div>
      {!showAddButton && !!fields && !!fields.length &&
        <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
      }
      {fields && !!fields.length && fields.map((item, index) =>
        <RentItemEdit
          key={index}
          field={item}
          index={index}
          onOpenDeleteModal={onOpenDeleteModal}
          onRemove={handleOpenDeleteModal}
          rents={rents}
        />
      )}
      {showAddButton &&
        <Row>
          <Column>
            <AddButton
              label='Lisää vuokra'
              onClick={handleAdd}
              title='Lisää vuokra'
            />
          </Column>
        </Row>
      }
    </div>
  );
};

type Props = {
  currentLease: Lease,
  isSaveClicked: boolean,
  params: Object,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
  lease: Lease,
  rentsData: Object,
};

class RentsEdit extends Component<Props, State> {
  state = {
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.RENT,
    deleteModalTitle: DeleteModalTitles.RENT,
    isDeleteModalOpen: false,
    lease: {},
    rentsData: {},
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.lease) {
      return {
        lease: props.currentLease,
        rentsData: getContentRentsFormData(props.currentLease),
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.RENTS]: this.props.valid,
      });
    }
  }

  handleHideDeleteModal = () => {
    this.setState({
      isDeleteModalOpen: false,
    });
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.RENT, modalLabel: string = DeleteModalLabels.RENT) => {
    this.setState({
      deleteFunction: fn,
      deleteModalLabel: modalLabel,
      deleteModalTitle: modalTitle,
      isDeleteModalOpen: true,
    });
  }

  handleDeleteClick = () => {
    const {deleteFunction} = this.state;
    if(deleteFunction) {
      deleteFunction();
    }

    this.handleHideDeleteModal();
  }

  render() {
    const {isSaveClicked} = this.props;
    const {
      deleteModalLabel,
      deleteModalTitle,
      isDeleteModalOpen,
      rentsData,
    } = this.state;
    const rents = get(rentsData, 'rents', []),
      rentsArchived = get(rentsData, 'rentsArchived', []);

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

        <FormSectionComponent>
          <h2>Vuokra</h2>
          <RightSubtitle
            text={
              <FormField
                fieldAttributes={{}}
                name='is_rent_info_complete'
                optionLabel='Vuokratiedot kunnossa'
                overrideValues={{
                  fieldType: 'switch',
                }}
              />
            }
          />
          <Divider />
          <FieldArray
            component={renderRents}
            name='rents.rents'
            onOpenDeleteModal={this.handleOpenDeleteModal}
            rents={rents}
            showAddButton={true}
          />

          {/* Archived rents */}
          <FieldArray
            component={renderRents}
            name='rents.rentsArchived'
            onOpenDeleteModal={this.handleOpenDeleteModal}
            rents={rentsArchived}
            showAddButton={false}
          />


          <h2>Vuokranperusteet</h2>
          <Divider />
          <GreenBoxEdit>
            <FieldArray
              component={BasisOfRentsEdit}
              isSaveClicked={isSaveClicked}
              name="basis_of_rents"
              onOpenDeleteModal={this.handleOpenDeleteModal}
            />
          </GreenBoxEdit>

        </FormSectionComponent>
      </form>
    );
  }
}

const formName = FormNames.RENTS;

export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
  withRouter,
)(RentsEdit);
