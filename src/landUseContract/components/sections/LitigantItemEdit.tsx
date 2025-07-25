import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import AddButtonThird from "@/components/form/AddButtonThird";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import Collapse from "@/components/collapse/Collapse";
import ContactTemplate from "@/contacts/components/templates/ContactTemplate";
import EditButton from "@/components/form/EditButton";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormWrapper from "@/components/form/FormWrapper";
import FormWrapperLeft from "@/components/form/FormWrapperLeft";
import FormWrapperRight from "@/components/form/FormWrapperRight";
import LitigantBillingPersonEdit from "./LitigantBillingPersonEdit";
import SubTitle from "@/components/content/SubTitle";
import {
  initializeContactForm,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
} from "@/contacts/actions";
import { receiveCollapseStates } from "@/landUseContract/actions";
import {
  ConfirmationModalTexts,
  FieldTypes,
  FormNames,
  ViewModes,
} from "@/enums";
import { ButtonColors } from "@/components/enums";
import { getContactFullName } from "@/contacts/helpers";
import { findItemById, isActive, isArchived } from "@/util/helpers";
import {
  getAttributes,
  getCollapseStateByKey,
  getErrorsByFormName,
  getIsSaveClicked,
} from "@/landUseContract/selectors";
import type { Attributes } from "types";
type BillingPersonsProps = {
  fields: any;
  savedLitigant: Record<string, any> | null | undefined;
  showAddButton: boolean;
};

const renderBillingPersons = ({
  fields,
  savedLitigant,
  showAddButton,
}: BillingPersonsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Fragment>
            {fields &&
              !!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_BILLING_PERSON.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_BILLING_PERSON.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_BILLING_PERSON.TITLE,
                  });
                };

                return (
                  <LitigantBillingPersonEdit
                    key={index}
                    field={field}
                    savedLitigant={savedLitigant}
                    onRemove={handleRemove}
                  />
                );
              })}
            {showAddButton && (
              <Row>
                <Column>
                  <AddButtonSecondary
                    className="no-top-margin"
                    label="Lisää laskunsaaja"
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            )}
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes;
  collapseState: boolean;
  contact: Record<string, any> | null | undefined;
  errors: Record<string, any> | null | undefined;
  field: string;
  initializeContactForm: (...args: Array<any>) => any;
  isSaveClicked: boolean;
  litigantId: number;
  litigants: Array<Record<string, any>>;
  onRemove: (...args: Array<any>) => any;
  receiveCollapseStates: (...args: Array<any>) => any;
  receiveContactModalSettings: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  showContactModal: (...args: Array<any>) => any;
};

const LitigantItemEdit = ({
  attributes,
  collapseState,
  contact,
  errors,
  field,
  initializeContactForm,
  isSaveClicked,
  litigantId,
  litigants,
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

  const handleEditClick = () => {
    initializeContactForm({ ...contact });
    receiveContactModalSettings({
      field: `${field}.litigant.contact`,
      contactId: null,
      isNew: false,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleCollapseToggle = (val: boolean) => {
    if (!litigantId) {
      return;
    }

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LAND_USE_CONTRACT_LITIGANTS]: {
          litigants: {
            [litigantId]: val,
          },
        },
      },
    });
  };

  const savedLitigant = litigantId ? findItemById(litigants, litigantId) : {};
  const active = isActive(savedLitigant && savedLitigant.litigant);
  const archived = isArchived(savedLitigant && savedLitigant.litigant);
  const litigantErrors = get(errors, field);
  return (
    <Collapse
      archived={archived}
      defaultOpen={collapseState !== undefined ? collapseState : active}
      hasErrors={isSaveClicked && !isEmpty(litigantErrors)}
      headerTitle={
        getContactFullName(get(savedLitigant, "litigant.contact")) || "-"
      }
      onRemove={onRemove}
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column>
                <Row>
                  <Column small={9} medium={8} large={8}>
                    <FormFieldLegacy
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(
                        attributes,
                        "litigants.child.children.landuseagreementlitigantcontact_set.child.children.contact",
                      )}
                      name={`${field}.litigant.contact`}
                      overrideValues={{
                        fieldType: FieldTypes.CONTACT,
                        label: "Asiakas",
                      }}
                    />
                  </Column>
                  <Column small={3} medium={4} large={4}>
                    <div className="contact-buttons-wrapper">
                      <AddButtonThird
                        label="Luo asiakas"
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
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(
                    attributes,
                    "litigants.child.children.landuseagreementlitigantcontact_set.child.children.start_date",
                  )}
                  name={`${field}.litigant.start_date`}
                  overrideValues={{
                    label: "Alkupvm",
                  }}
                />
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(
                    attributes,
                    "litigants.child.children.landuseagreementlitigantcontact_set.child.children.end_date",
                  )}
                  name={`${field}.litigant.end_date`}
                  overrideValues={{
                    label: "Loppupvm",
                  }}
                />
              </Column>
            </Row>
          </FormWrapperRight>

          <FormWrapperLeft>
            <Row>
              <Column>
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(
                    attributes,
                    "litigants.child.children.reference",
                  )}
                  name={`${field}.reference`}
                  overrideValues={{
                    label: "Viite",
                  }}
                />
              </Column>
            </Row>
          </FormWrapperLeft>
        </FormWrapper>

        {!!contact && (
          <SubTitle>
            Asiakkaan tiedot
            <EditButton
              className="inline-button"
              onClick={handleEditClick}
              title="Muokkaa asiakasta"
            />
          </SubTitle>
        )}
        <ContactTemplate contact={contact} />
      </BoxContentWrapper>

      <FieldArray
        component={renderBillingPersons}
        savedLitigant={savedLitigant}
        name={`${field}.landuseagreementlitigantcontact_set`}
        showAddButton={!archived}
      />
    </Collapse>
  );
};

const formName = FormNames.LAND_USE_CONTRACT_LITIGANTS;
const selector = formValueSelector(formName);
export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(
        state,
        `${ViewModes.EDIT}.${formName}.litigants.${id}`,
      ),
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
