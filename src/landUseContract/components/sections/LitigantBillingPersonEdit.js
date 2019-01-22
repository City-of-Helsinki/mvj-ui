// @flow
import React, {Fragment} from 'react';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditButton from '$components/form/EditButton';
import FormField from '$components/form/FormField';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal} from '$src/contacts/actions';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FieldTypes} from '$components/enums';
import {FormNames} from '$src/landUseContract/enums';
import {isLitigantActive, isLitigantArchived} from '$src/landUseContract/helpers';
import {
  findItemById,
  formatDateRange,
  getFieldAttributes,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  billingPersonId: number,
  collapseState: boolean,
  contact: ?Object,
  errors: ?Object,
  field: string,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  savedLitigant: ?Object,
  showContactModal: Function,
}

const LitigantBillingPersonEdit = ({
  attributes,
  billingPersonId,
  collapseState,
  contact,
  errors,
  field,
  initializeContactForm,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  savedLitigant,
  showContactModal,
}: Props) => {
  const handleAddClick = () => {
    initializeContactForm({});
    receiveContactModalSettings({
      field: `${field}.contact`,
      contactId: null,
      isNew: true,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleEditClick = () => {
    initializeContactForm({...contact});
    receiveContactModalSettings({
      field: `${field}.contact`,
      contactId: null,
      isNew: false,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleCollapseToggle = (val: boolean) => {
    if(!billingPersonId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LITIGANTS]: {
          billing_persons: {
            [billingPersonId]: val,
          },
        },
      },
    });
  };

  const litigantContactSet = get(savedLitigant, 'litigantcontact_set', []),
    savedBillingPerson = findItemById(litigantContactSet, billingPersonId),
    active = isLitigantActive(savedBillingPerson),
    archived = isLitigantArchived(savedBillingPerson),
    litigantErrors = get(errors, field);

  return (
    <Collapse
      archived={archived}
      className='collapse__secondary'
      defaultOpen={collapseState !== undefined ? collapseState : active}
      hasErrors={isSaveClicked && !isEmpty(litigantErrors)}
      headerSubtitles={savedBillingPerson &&
        <Fragment>
          <Column></Column>
          <Column>
            <CollapseHeaderSubtitle><span>Välillä:</span> {formatDateRange(savedBillingPerson.start_date, savedBillingPerson.end_date) || '-'}</CollapseHeaderSubtitle>
          </Column>
        </Fragment>
      }
      headerTitle='Laskunsaaja'
      onRemove={onRemove}
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12} medium={12} large={8}>
                <Row>
                  <Column small={9} medium={8} large={8}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, 'litigants.child.children.litigantcontact_set.child.children.contact')}
                      name={`${field}.contact`}
                      overrideValues={{
                        fieldType: FieldTypes.CONTACT,
                        label: 'Asiakas',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={4} large={4}>
                    <div className='contact-buttons-wrapper'>
                      <AddButtonThird
                        label='Luo asiakas'
                        onClick={handleAddClick}
                      />
                    </div>
                  </Column>
                </Row>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              <Column small={6} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(attributes, 'litigants.child.children.litigantcontact_set.child.children.start_date')}
                  name={`${field}.start_date`}
                  overrideValues={{
                    label: 'Alkupvm',
                  }}
                />
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(attributes, 'litigants.child.children.litigantcontact_set.child.children.end_date')}
                  name={`${field}.end_date`}
                  overrideValues={{
                    label: 'Loppupvm',
                  }}
                />
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>

        {!!contact &&
          <SubTitle>Asiakkaan tiedot
            <EditButton
              className='inline-button'
              onClick={handleEditClick}
              title='Muokkaa asiakasta'
            />
          </SubTitle>
        }
        <ContactTemplate contact={contact} />
      </BoxContentWrapper>
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
      billingPersonId: id,
      collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LITIGANTS}.billing_persons.${id}`),
      contact: selector(state, `${props.field}.contact`),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
    };
  },
  {
    initializeContactForm,
    receiveCollapseStates,
    receiveContactModalSettings,
    receiveIsSaveClicked,
    showContactModal,
  }
)(LitigantBillingPersonEdit);
