// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import ConstructabilityItemEdit from './ConstructabilityItemEdit';
import Divider from '$components/content/Divider';
import FormSection from '$components/form/FormSection';
import SendEmail from './SendEmail';
import {receiveFormValidFlags} from '$src/leases/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContentConstructability} from '$src/leases/helpers';
import {getUserOptions} from '$src/users/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes, getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type AreaProps = {
  areas: Array<Object>,
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  locationOptions: Array<Object>,
  onOpenDeleteModal: Function,
  typeOptions: Array<Object>,
}

const renderAreas = ({
  areas,
  attributes,
  errors,
  fields,
  isSaveClicked,
  locationOptions,
  onOpenDeleteModal,
  typeOptions,
}: AreaProps): Element<*> => {
  return (
    <div>
      {!fields || !fields.length &&
        <p className='no-margin'>Ei vuokra-alueita</p>
      }
      {areas && !!areas.length && fields && !!fields.length && fields.map((area, index) => {

        return (
          <ConstructabilityItemEdit
            key={index}
            areaData={areas[index]}
            attributes={attributes}
            errors={errors}
            field={area}
            isSaveClicked={isSaveClicked}
            locationOptions={locationOptions}
            onOpenDeleteModal={onOpenDeleteModal}
            typeOptions={typeOptions}
          />
        );
      })}
    </div>
  );
};

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  errors: ?Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  areas: Array<Object>,
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
  locationOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class ConstructabilityEdit extends Component<Props, State> {
  state = {
    areas: [],
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.CONSTRUCTABILITY,
    deleteModalTitle: DeleteModalTitles.CONSTRUCTABILITY,
    isDeleteModalOpen: false,
    locationOptions: [],
    typeOptions: [],
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONSTRUCTABILITY]: this.props.valid,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const retObj = {};

    if(props.attributes !== state.attributes) {
      retObj.locationOptions = getAttributeFieldOptions(props.attributes, 'lease_areas.child.children.location');
      retObj.typeOptions = getAttributeFieldOptions(props.attributes, 'lease_areas.child.children.type');
      retObj.attributes = props.attributes;
    }
    if(props.currentLease !== state.currentLease) {
      retObj.areas = getContentConstructability(props.currentLease);
      retObj.currentLease = props.currentLease;
    }
    if(props.users !== state.users) {
      retObj.userOptions = getUserOptions(props.users);
      retObj.users = props.users;
    }

    if(!isEmpty(retObj)) {
      return retObj;
    }
    return null;
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.CONSTRUCTABILITY, modalLabel: string = DeleteModalLabels.CONSTRUCTABILITY) => {
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
      attributes,
      errors,
      handleSubmit,
      isSaveClicked,
    } = this.props;
    const {
      areas,
      deleteModalLabel,
      deleteModalTitle,
      isDeleteModalOpen,
      locationOptions,
      typeOptions,
    } = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteModalOpen}
          label={deleteModalLabel}
          onCancel={this.handleHideDeleteModal}
          onClose={this.handleHideDeleteModal}
          onSave={this.handleDeleteClick}
          title={deleteModalTitle}
        />

        <FormSection>
          <h2>Rakentamiskelpoisuus</h2>
          <Divider />
          <SendEmail />

          <FieldArray
            areas={areas}
            attributes={attributes}
            component={renderAreas}
            errors={errors}
            isSaveClicked={isSaveClicked}
            locationOptions={locationOptions}
            name="lease_areas"
            onOpenDeleteModal={this.handleOpenDeleteModal}
            typeOptions={typeOptions}
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.CONSTRUCTABILITY;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
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
)(ConstructabilityEdit);
