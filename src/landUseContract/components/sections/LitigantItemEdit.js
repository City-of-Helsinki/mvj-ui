// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditButton from '$components/form/EditButton';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import LitigantBillingPersonEdit from './LitigantBillingPersonEdit';
import {initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal} from '$src/contacts/actions';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isLitigantActive} from '$src/landUseContract/helpers';
import {findItemById} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/leases/types';

type BillingPersonsProps = {
  fields: any,
  litigant: Object,
  onOpenDeleteModal: Function,
}

const renderBillingPersons = ({
  fields,
  litigant,
  onOpenDeleteModal,
}: BillingPersonsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  const handleOpenDeleteModal = (index: number) => {
    onOpenDeleteModal(
      () => fields.remove(index),
      DeleteModalTitles.BILLING_PERSON,
      DeleteModalLabels.BILLING_PERSON,
    );
  };

  return (
    <div>
      {fields && !!fields.length && fields.map((field, index) => {
        return (
          <LitigantBillingPersonEdit
            key={index}
            field={field}
            index={index}
            litigant={litigant}
            onRemove={handleOpenDeleteModal}
          />
        );
      })}
      <Row>
        <Column>
          {!fields.length &&
            <AddButtonSecondary
              label='Lisää laskunsaaja'
              onClick={handleAdd}
              title='Lisää laskunsaaja'
            />
          }
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  contact: ?Object,
  errors: ?Object,
  field: string,
  index: number,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  litigantId: number,
  litigants: Array<Object>,
  onOpenDeleteModal: Function,
  onRemove: Function,
  receiveCollapseStates: Function,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  showContactModal: Function,
}

const LitigantItemEdit = ({
  attributes,
  collapseState,
  contact,
  errors,
  field,
  index,
  initializeContactForm,
  isSaveClicked,
  litigantId,
  litigants,
  onOpenDeleteModal,
  onRemove,
  receiveCollapseStates,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
}: Props) => {
  const handleAddClick = () => {
    initializeContactForm({});
    receiveContactModalSettings({
      field: `${field}.litigant.contact`,
      contactId: null,
      isNew: true,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleAddKeyDown = (e:any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleAddClick();
    }
  };

  const handleEditClick = () => {
    initializeContactForm({...contact});
    receiveContactModalSettings({
      field: `${field}.litigant.contact`,
      contactId: null,
      isNew: false,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleRemoveClick = () => {
    onRemove(index);
  };

  const handleCollapseToggle = (val: boolean) => {
    if(!litigantId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LITIGANTS]: {
          litigants: {
            [litigantId]: val,
          },
        },
      },
    });
  };

  const savedLitigant = litigantId ? findItemById(litigants, litigantId) : {};
  const isActive = isLitigantActive(get(savedLitigant, 'litigant'));
  const litigantErrors = get(errors, field);

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={collapseState !== undefined ? collapseState : isActive}
      hasErrors={isSaveClicked && !isEmpty(litigantErrors)}
      headerTitle={<h3 className='collapse__header-title'>{getContactFullName(get(savedLitigant, 'litigant.contact')) || '-'}</h3>}
      onRemove={handleRemoveClick}
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12} large={8}>
                <Row>
                  <Column small={9} medium={8} large={8}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'litigants.child.children.litigantcontact_set.child.children.contact')}
                      name={`${field}.litigant.contact`}
                      overrideValues={{
                        fieldType: 'contact',
                        label: 'Asiakas',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={4} large={4}>
                    <div className='contact-buttons-wrapper'>
                      <a onKeyDown={handleAddKeyDown} onClick={handleAddClick} tabIndex={0}>Luo asiakas</a>
                    </div>
                  </Column>
                </Row>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              <Column small={12} medium={6} large={4}>
                <FormFieldLabel required>Osuus murtolukuna</FormFieldLabel>
                <Row>
                  <Column>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'litigants.child.children.share_numerator')}
                      name={`${field}.share_numerator`}
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                  <Column>
                    <FormField
                      disableTouched={isSaveClicked}
                      className='with-slash'
                      fieldAttributes={get(attributes, 'litigants.child.children.share_denominator')}
                      name={`${field}.share_denominator`}
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                </Row>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'litigants.child.children.litigantcontact_set.child.children.start_date')}
                  name={`${field}.litigant.start_date`}
                  overrideValues={{
                    label: 'Alkupvm',
                  }}
                />
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'litigants.child.children.litigantcontact_set.child.children.end_date')}
                  name={`${field}.litigant.end_date`}
                  overrideValues={{
                    label: 'Loppupvm',
                  }}
                />
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>

        <BoxContentWrapper>
          {!!contact &&
            <EditButton
              className='position-topright'
              onClick={handleEditClick}
              title='Muokkaa'
            />
          }
          <ContactTemplate contact={contact} />
        </BoxContentWrapper>

        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'litigants.child.children.reference')}
                  name={`${field}.reference`}
                  overrideValues={{
                    label: 'Viite',
                  }}
                />
              </Column>
            </Row>
          </FormWrapperLeft>
        </FormWrapper>
      </BoxContentWrapper>

      <FieldArray
        component={renderBillingPersons}
        litigant={savedLitigant}
        name={`${field}.litigantcontact_set`}
        onOpenDeleteModal={onOpenDeleteModal}
      />
    </Collapse>
  );
};

const formName = FormNames.LITIGANTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.litigants.${id}`),
      contact: selector(state, `${props.field}.litigant.contact`),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      litigantId: id,
    };
  },
  {
    initializeContactForm,
    receiveContactModalSettings,
    receiveCollapseStates,
    receiveIsSaveClicked,
    showContactModal,
  },
)(LitigantItemEdit);
