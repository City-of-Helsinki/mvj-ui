// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonThird from '$components/form/AddButtonThird';
import Collapse from '$components/collapse/Collapse';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContactModal from '$src/contacts/components/ContactModal';
import Divider from '$components/content/Divider';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {
  createContactOnModal as createContact,
  hideContactModal,
  initializeContactForm,
  receiveContactModalSettings,
  receiveIsSaveClicked as receiveIsContactModalSaveClicked,
  showContactModal,
} from '$src/contacts/actions';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames as ContactFormNames} from '$src/contacts/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getContentContact} from '$src/contacts/helpers';
import {
  getContactModalSettings,
  getIsContactFormValid,
  getIsContactModalOpen,
  getIsFetching as getIsFetchingContact,
} from '$src/contacts/selectors';
import {getAttributes, getCollapseStateByKey, getIsSaveClicked} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {ContactModalSettings} from '$src/contacts/types';
import type {Attributes} from '$src/landUseContract/types';

type AreasProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const renderAreas = ({attributes, fields, isSaveClicked, onOpenDeleteModal}: AreasProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <div>
      <FormFieldLabel>Kohteet</FormFieldLabel>
      {fields && !!fields.length && fields.map((field, index) => {
        const handleOpenDeleteModal = () => {
          onOpenDeleteModal(
            () => fields.remove(index),
            DeleteModalTitles.AREA,
            DeleteModalLabels.AREA,
          );
        };

        return(
          <Row key={index}>
            <Column>
              <FieldAndRemoveButtonWrapper
                field={
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'areas.child.children.area')}
                    name={`${field}.area`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                }
                removeButton={
                  <RemoveButton
                    className='third-level'
                    onClick={handleOpenDeleteModal}
                    title="Poista kohde"
                  />
                }
              />
            </Column>
          </Row>
        );
      })}
      <Row>
        <Column>
          <AddButtonThird
            label='Lisää kohde'
            onClick={handleAdd}
            title='Lisää kohde'
          />
        </Column>
      </Row>
    </div>
  );
};

type LitigantsProps = {
  attributes: Attributes,
  fields: any,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
  receiveContactModalSettings: Function,
  receiveIsContactModalSaveClicked: Function,
  showContactModal: Function,
}

const renderLitigants = ({
  attributes,
  fields,
  initializeContactForm,
  isSaveClicked,
  onOpenDeleteModal,
  receiveContactModalSettings,
  receiveIsContactModalSaveClicked,
  showContactModal,
}: LitigantsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <div>
      <FormFieldLabel>Osapuolet</FormFieldLabel>
      {fields && !!fields.length && fields.map((field, index) => {
        const handleOpenDeleteModal = () => {
          onOpenDeleteModal(
            () => fields.remove(index),
            DeleteModalTitles.LITIGANT,
            DeleteModalLabels.LITIGANT,
          );
        };

        const handleAddClick = () => {
          initializeContactForm({});
          receiveContactModalSettings({
            field: `${field}.contact`,
            contactId: null,
            isNew: true,
          });
          receiveIsContactModalSaveClicked(false);
          showContactModal();
        };

        const handleAddKeyDown = (e:any) => {
          if(e.keyCode === 13) {
            e.preventDefault();
            handleAddClick();
          }
        };

        return (
          <Row key={index}>
            <Column small={8}>
              <FieldAndRemoveButtonWrapper
                field={
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'litigants.child.children.contact')}
                    name={`${field}.contact`}
                    overrideValues={{
                      fieldType: 'contact',
                      label: '',
                    }}
                  />
                }
                removeButton={
                  <RemoveButton
                    className='third-level'
                    onClick={handleOpenDeleteModal}
                    title="Poista osapuoli"
                  />
                }
              />
            </Column>
            <Column small={4}>
              {(index + 1 === fields.length) &&
                <p><a className='no-margin'
                  style={{lineHeight: '20px'}}
                  onKeyDown={handleAddKeyDown}
                  onClick={handleAddClick}
                  tabIndex={0}
                >Luo asiakas</a></p>
              }
            </Column>
          </Row>
        );
      })}
      <Row>
        <Column>
          <AddButtonThird
            label='Lisää osapuoli'
            onClick={handleAdd}
            title='Lisää osapuoli'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  basicInformationCollapseState: boolean,
  change: Function,
  contactFormValues: Object,
  contactModalSettings: ContactModalSettings,
  createContact: Function,
  hideContactModal: Function,
  initializeContactForm: Function,
  isContactFormValid: boolean,
  isContactModalOpen: boolean,
  isFetchingContact: boolean,
  isSaveClicked: boolean,
  planInformationCollapseState: boolean,
  receiveCollapseStates: Function,
  receiveContactModalSettings: Function,
  receiveFormValidFlags: Function,
  receiveContactModalSettings: Function,
  receiveIsContactModalSaveClicked: Function,
  showContactModal: Function,
  valid: boolean,
}

type State = {
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
}

class BasicInformationEdit extends Component<Props, State> {
  state = {
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.AREA,
    deleteModalTitle: DeleteModalTitles.AREA,
    isDeleteModalOpen: false,
  }

  componentDidUpdate(prevProps) {
    const {change, contactModalSettings, receiveContactModalSettings, receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.BASIC_INFORMATION]: this.props.valid,
      });
    }

    if(contactModalSettings && contactModalSettings.contact) {
      change(contactModalSettings.field, getContentContact(contactModalSettings.contact));
      receiveContactModalSettings(null);
    }
  }

  handleBasicInformationCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.BASIC_INFORMATION]: {
          basic_information: val,
        },
      },
    });
  }

  handlePlanInformationCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.BASIC_INFORMATION]: {
          plan_information: val,
        },
      },
    });
  }

  handleContactModalCancel = () => {
    const {hideContactModal, receiveContactModalSettings} = this.props;

    hideContactModal();
    receiveContactModalSettings(null);
  }

  handleContactModalSave = () => {
    const {
      contactFormValues,
      createContact,
      isContactFormValid,
      receiveIsContactModalSaveClicked,
    } = this.props;

    receiveIsContactModalSaveClicked(true);

    if(!isContactFormValid) {return;}
    createContact(contactFormValues);
  }

  handleContactModalSaveAndAdd = () => {
    const {
      contactFormValues,
      createContact,
      isContactFormValid,
      receiveIsContactModalSaveClicked,
    } = this.props;
    const contact = {...contactFormValues};

    receiveIsContactModalSaveClicked(true);

    if(!isContactFormValid) {return;}
    contact.isSelected = true;
    createContact(contact);
  }

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.CONTRACT, modalLabel: string = DeleteModalLabels.CONTRACT) => {
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

  render() {
    const {
      attributes,
      basicInformationCollapseState,
      initializeContactForm,
      isContactModalOpen,
      isFetchingContact,
      isSaveClicked,
      planInformationCollapseState,
      receiveContactModalSettings,
      receiveIsContactModalSaveClicked,
      showContactModal,
    } = this.props;
    const {
      deleteModalLabel,
      deleteModalTitle,
      isDeleteModalOpen,
    } = this.state;

    return (
      <div>
        {isFetchingContact &&
          <LoaderWrapper className='overlay-wrapper'>
            <Loader isLoading={isFetchingContact} />
          </LoaderWrapper>
        }

        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteModalOpen}
          label={deleteModalLabel}
          onCancel={this.handleHideDeleteModal}
          onClose={this.handleHideDeleteModal}
          onSave={this.handleDeleteClick}
          title={deleteModalTitle}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onCancel={this.handleContactModalCancel}
          onClose={this.handleContactModalCancel}
          onSave={this.handleContactModalSave}
          onSaveAndAdd={this.handleContactModalSaveAndAdd}
          showSaveAndAdd={true}
          title={'Uusi asiakas'}
        />

        <form>
          <h2>Perustiedot</h2>
          <Divider />
          <Collapse
            defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
            headerTitle={<h3 className='collapse__header-title'>Perustiedot</h3>}
            onToggle={this.handleBasicInformationCollapseToggle}
          >
            <Row>
              <Column small={6} medium={4} large={2}>
                <FieldArray
                  attributes={attributes}
                  component={renderAreas}
                  isSaveClicked={isSaveClicked}
                  name='areas'
                  onOpenDeleteModal={this.handleOpenDeleteModal}
                />
              </Column>
              <Column small={6} medium={4} large={4}>
                <FieldArray
                  attributes={attributes}
                  component={renderLitigants}
                  initializeContactForm={initializeContactForm}
                  isSaveClicked={isSaveClicked}
                  name='litigants'
                  onOpenDeleteModal={this.handleOpenDeleteModal}
                  receiveContactModalSettings={receiveContactModalSettings}
                  receiveIsContactModalSaveClicked={receiveIsContactModalSaveClicked}
                  showContactModal={showContactModal}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'preparer')}
                  name='preparer'
                  overrideValues={{
                    fieldType: 'user',
                    label: 'Valmistelija',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'land_use_contract_type')}
                  name='land_use_contract_type'
                  overrideValues={{
                    label: 'Maankäyttösopimus',
                  }}
                />
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'estimated_completion_year')}
                  name='estimated_completion_year'
                  overrideValues={{
                    label: 'Arvioitu toteutumisvuosi',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'estimated_introduction_year')}
                  name='estimated_introduction_year'
                  overrideValues={{
                    label: 'Arvioitu toteutumisvuosi',
                  }}
                />
              </Column>
            </Row>
            <SubTitle>Liitetiedostot</SubTitle>
            <p>Ei liitetiedostoja</p>
          </Collapse>

          <Collapse
            defaultOpen={planInformationCollapseState !== undefined ? planInformationCollapseState : true}
            headerTitle={<h3 className='collapse__header-title'>Asemakaavatiedot</h3>}
            onToggle={this.handlePlanInformationCollapseToggle}
          >
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'project_area')}
                  name='project_area'
                  overrideValues={{
                    label: 'Hankealue',
                  }}
                />
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'plan_reference_number')}
                  name='plan_reference_number'
                  validate={referenceNumber}
                  overrideValues={{
                    label: 'Asemakaavan diaarinumero',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'plan_number')}
                  name='plan_number'
                  overrideValues={{
                    label: 'Asemakaavan numero',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'state')}
                  name='state'
                  overrideValues={{
                    label: 'Asemakaavan käsittelyvaihe',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'plan_acceptor')}
                  name='plan_acceptor'
                  overrideValues={{
                    label: 'Asemakaavan hyväksyjä',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'plan_lawfulness_date')}
                  name='plan_lawfulness_date'
                  overrideValues={{
                    label: 'Asemakaavan lainvoimaisuuspvm',
                  }}
                />
              </Column>
            </Row>
          </Collapse>
        </form>
      </div>
    );
  }
}

const formName = FormNames.BASIC_INFORMATION;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.basic_information`),
        contactFormValues: getFormValues(ContactFormNames.CONTACT)(state),
        contactModalSettings: getContactModalSettings(state),
        isContactFormValid: getIsContactFormValid(state),
        isContactModalOpen: getIsContactModalOpen(state),
        isFetchingContact: getIsFetchingContact(state),
        isSaveClicked: getIsSaveClicked(state),
        planInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.plan_information`),
      };
    },
    {
      createContact,
      hideContactModal,
      initializeContactForm,
      receiveCollapseStates,
      receiveContactModalSettings,
      receiveFormValidFlags,
      receiveIsContactModalSaveClicked,
      showContactModal,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(BasicInformationEdit);
