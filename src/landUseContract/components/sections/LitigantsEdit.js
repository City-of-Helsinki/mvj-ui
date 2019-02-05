// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import ContactModal from '$src/contacts/components/ContactModal';
import LitigantItemEdit from './LitigantItemEdit';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {
  createContactOnModal as createContact,
  editContactOnModal as editContact,
  hideContactModal,
  receiveContactModalSettings,
  receiveIsSaveClicked,
} from '$src/contacts/actions';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {ContactTypes, FormNames as ContactFormNames} from '$src/contacts/enums';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {validateLitigantForm} from '$src/landUseContract/formValidators';
import {getContentContact} from '$src/contacts/helpers';
import {getContentLitigants} from '$src/landUseContract/helpers';
import {isEmptyValue} from '$util/helpers';
import {fetchContacts} from '$src/contacts/requestsOutsideSaga';
import {
  getContactModalSettings,
  getIsContactFormValid,
  getIsContactModalOpen,
  getIsFetching as getIsFetchingContact,
} from '$src/contacts/selectors';
import {getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {ContactModalSettings} from '$src/contacts/types';
import type {LandUseContract} from '$src/landUseContract/types';

type LitigantsProps = {
  archived: boolean,
  fields: any,
  litigants: Array<Object>,
  showAddButton: boolean,
}

const renderLitigants = ({
  archived,
  fields,
  litigants,
}: LitigantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!!archived && fields && !!fields.length &&
              <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
            }
            {fields && !!fields.length && fields.map((litigant, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.LITIGANT,
                  confirmationModalTitle: DeleteModalTitles.LITIGANT,
                });
              };

              return (
                <LitigantItemEdit
                  key={index}
                  field={litigant}
                  index={index}
                  litigants={litigants}
                  onRemove={handleRemove}
                />
              );
            })}
            {!archived &&
              <Row>
                <Column>
                  <AddButton
                    className='no-margin'
                    label='Lisää osapuoli'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  change: Function,
  contactModalSettings: ContactModalSettings,
  contactFormValues: Object,
  createContact: Function,
  currentLandUseContract: LandUseContract,
  editContact: Function,
  hideContactModal: Function,
  isContactFormValid: boolean,
  isContactModalOpen: boolean,
  isFetchingContact: boolean,
  receiveContactModalSettings: Function,
  receiveFormValidFlags: Function,
  receiveIsSaveClicked: Function,
  valid: boolean,
}

type State = {
  litigants: Array<Object>,
  currentLandUseContract: LandUseContract,
  litigants: Array<Object>,
}

class TenantsEdit extends PureComponent<Props, State> {
  state = {
    currentLandUseContract: {},
    litigants: [],
  }

  componentDidMount() {
    const {hideContactModal} = this.props;
    hideContactModal();
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLandUseContract !== state.currentLandUseContract) {
      return {
        currentLandUseContract: props.currentLandUseContract,
        litigants: getContentLitigants(props.currentLandUseContract),
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const {change, contactModalSettings, receiveContactModalSettings, receiveFormValidFlags} = this.props;
    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LITIGANTS]: this.props.valid,
      });
    }

    if(contactModalSettings && contactModalSettings.contact) {
      change(
        contactModalSettings.field,
        getContentContact(contactModalSettings.contact)
      );
      receiveContactModalSettings(null);
    }
  }

  handleCancel = () => {
    const {hideContactModal, receiveContactModalSettings} = this.props;

    hideContactModal();
    receiveContactModalSettings(null);
  }

  handleClose = () => {
    const {hideContactModal, receiveContactModalSettings} = this.props;

    hideContactModal();
    receiveContactModalSettings(null);
  }

  createOrEditContact = () => {
    const {
      contactFormValues,
      contactModalSettings,
      createContact,
      editContact,
    } = this.props;

    if(contactModalSettings && contactModalSettings.isNew) {
      createContact(contactFormValues);
    } else if(contactModalSettings && !contactModalSettings.isNew){
      editContact(contactFormValues);
    }
  }

  render () {
    const {
      contactModalSettings,
      isContactModalOpen,
      isFetchingContact,
    } = this.props;

    const {litigants} = this.state;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleCreateOrEdit = async() => {
            const {contactFormValues, contactModalSettings, isContactFormValid, receiveIsSaveClicked} = this.props;
            const {business_id, national_identification_number, type} = contactFormValues;

            receiveIsSaveClicked(true);

            if(!isContactFormValid) return;

            if(!contactModalSettings.isNew) {
              this.createOrEditContact();
              return;
            }

            if(type !== ContactTypes.PERSON && !isEmptyValue(business_id)) {
              const contacts = await fetchContacts({business_id});

              if(contacts.length) {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    this.createOrEditContact();
                  },
                  confirmationModalButtonClassName: ButtonColors.SUCCESS,
                  confirmationModalButtonText: 'Luo asiakas',
                  confirmationModalLabel: <span>{`Y-tunnuksella ${business_id} on jo olemassa asiakas`}<br />Haluatko luoda asiakkaan?</span>,
                  confirmationModalTitle: 'Luo asiakas',
                });
              } else {
                this.createOrEditContact();
              }
            } else if(type === ContactTypes.PERSON && !isEmptyValue(national_identification_number)) {
              const contacts = await fetchContacts({national_identification_number});

              if(contacts.length) {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    this.createOrEditContact();
                  },
                  confirmationModalButtonClassName: ButtonColors.SUCCESS,
                  confirmationModalButtonText: 'Luo asiakas',
                  confirmationModalLabel: <span>{`Henkilötunnuksella ${national_identification_number} on jo olemassa asiakas`}<br />Haluatko luoda asiakkaan?</span>,
                  confirmationModalTitle: 'Luo asiakas',
                });
              } else {
                this.createOrEditContact();
              }
            } else {
              this.createOrEditContact();
            }
          };

          return(
            <Fragment>
              {isFetchingContact &&
                <LoaderWrapper className='overlay-wrapper'><Loader isLoading={isFetchingContact} /></LoaderWrapper>
              }

              <ContactModal
                isOpen={isContactModalOpen}
                onCancel={this.handleCancel}
                onClose={this.handleClose}
                onSave={handleCreateOrEdit}
                onSaveAndAdd={handleCreateOrEdit}
                showSave={contactModalSettings && !contactModalSettings.isNew}
                showSaveAndAdd={contactModalSettings && contactModalSettings.isNew}
                title={(contactModalSettings && contactModalSettings.isNew)
                  ? 'Uusi asiakas'
                  : 'Muokkaa asiakasta'
                }
              />

              <form>
                <FieldArray
                  component={renderLitigants}
                  litigants={litigants}
                  name='activeLitigants'
                />
                {/* Archived tenants */}
                <FieldArray
                  component={renderLitigants}
                  archived
                  litigants={litigants}
                  name='archivedLitigants'
                />
              </form>
            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.LITIGANTS;

export default flowRight(
  connect(
    (state) => {
      return {
        contactModalSettings: getContactModalSettings(state),
        contactFormValues: getFormValues(ContactFormNames.CONTACT)(state),
        currentLandUseContract: getCurrentLandUseContract(state),
        isContactFormValid: getIsContactFormValid(state),
        isContactModalOpen: getIsContactModalOpen(state),
        isFetchingContact: getIsFetchingContact(state),
      };
    },
    {
      createContact,
      editContact,
      hideContactModal,
      receiveContactModalSettings,
      receiveFormValidFlags,
      receiveIsSaveClicked,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateLitigantForm,
  }),
)(TenantsEdit);
