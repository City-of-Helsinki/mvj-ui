// @flow
import React, { useCallback, Fragment } from 'react';
import {
  FieldArray,
  change,
} from 'redux-form';
import { connect } from 'react-redux';
import type {Fields} from "redux-form/lib/FieldArrayProps.types";
import {Column, Row} from "react-foundation";

import {
  getAttachmentAttributes,
  getAttachmentMethods,
  getFieldTypeMapping,
  getIsFetchingPendingUploads,
  getIsPerformingFileOperation,
  getPendingUploads,
  getExistingUploads,
  getCurrentPlotApplication,
  getIsFetchingApplicationRelatedAttachments,
  getIsFetchingAttachmentAttributes
} from '../selectors';
import {
  getApplicationAttachmentDownloadLink, getSectionApplicantType,
  getSectionTargetFromMeta,
  getSectionTemplate, valueToApplicantType
} from '../helpers';
import AddButton from "../../components/form/AddButton";
import RemoveButton from "../../components/form/RemoveButton";
import FormField from "../../components/form/FormField";
import AddFileButton from "../../components/form/AddFileButton";
import {deleteUploadedAttachment, uploadAttachment} from "../actions";
import FormTextTitle from "../../components/form/FormTextTitle";
import FormText from "../../components/form/FormText";
import Authorization from "../../components/authorization/Authorization";
import FileDownloadLink from "../../components/file/FileDownloadLink";
import {formatDate, isFieldAllowedToRead} from "../../util/helpers";
import LoadingIndicator from "../../components/multi-select/LoadingIndicator";
import {ConfirmationModalTexts, FormNames} from "../../enums";
import {ButtonColors} from "../../components/enums";
import {ActionTypes, AppConsumer} from "../../app/AppContext";
import FormHintText from "../../components/form/FormHintText";
import {APPLICANT_SECTION_IDENTIFIER, APPLICANT_TYPE_FIELD_IDENTIFIER, TARGET_SECTION_IDENTIFIER} from "../constants";
import type {PlotApplicationFormValue} from "../types";
import {ApplicantTypes} from "../enums";

const ApplicationSectionKeys = {
  Subsections: 'sections',
  Fields: 'fields'
}

const ApplicationFormFileField = connect(
  (state, props) => ({
    pendingUploads: getPendingUploads(state),
    existingUploads: getExistingUploads(state, props.field.identifier),
    attachmentMethods: getAttachmentMethods(state),
    attachmentAttributes: getAttachmentAttributes(state),
    isFetchingPendingUploads: getIsFetchingPendingUploads(state),
    isFetchingAttachments: getIsFetchingApplicationRelatedAttachments(state),
    isFetchingAttachmentAttributes: getIsFetchingAttachmentAttributes(state),
    isPerformingFileOperation: getIsPerformingFileOperation(state),
    currentPlotApplication: getCurrentPlotApplication(state)
  }),
  {
    uploadAttachment,
    deleteUploadedAttachment
  }
)(({
  uploadAttachment,
  deleteUploadedAttachment,
  pendingUploads,
  existingUploads,
  // TODO: Method authorization is disabled, since at this point in time, the backend returns false for all methods.
  //attachmentMethods,
  attachmentAttributes,
  isFetchingPendingUploads,
  isFetchingAttachments,
  isFetchingAttachmentAttributes,
  isPerformingFileOperation,
  field,
  fieldName,
  currentPlotApplication
}) => {
  return (
    <AppConsumer>
      {({dispatch}) => {

        const isNew = !currentPlotApplication?.id;

        const submitFile = (fieldId, e) => {
          uploadAttachment({
            field: fieldId,
            file: e.target.files[0],
            answer: currentPlotApplication?.id || undefined
          });
        };

        const uploads = isNew ? pendingUploads.filter((file) => file.field === field.id) : existingUploads;

        const deleteFile = (file) => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              deleteUploadedAttachment(file);
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText: ConfirmationModalTexts.DELETE_ATTACHMENT.BUTTON,
            confirmationModalLabel: ConfirmationModalTexts.DELETE_ATTACHMENT.LABEL,
            confirmationModalTitle: ConfirmationModalTexts.DELETE_ATTACHMENT.TITLE,
          });
        }

        const busy = isFetchingPendingUploads || isPerformingFileOperation || isFetchingAttachments || isFetchingAttachmentAttributes;

        return <Column small={12} medium={12} large={12}>
      <FormTextTitle>{field.label}</FormTextTitle>
        {!isFetchingAttachmentAttributes && uploads.length > 0 && <Row>
        <Column small={6} large={5}>
          <Authorization allow={isFieldAllowedToRead(attachmentAttributes, 'name')}>
            <FormTextTitle>
              Tiedoston nimi
            </FormTextTitle>
          </Authorization>
        </Column>
        <Column small={3} large={3}>
          <Authorization allow={isFieldAllowedToRead(attachmentAttributes, 'created_at')}>
            <FormTextTitle>
              {'Ladattu'}
            </FormTextTitle>
          </Authorization>
        </Column>
      </Row>}
      {!isFetchingAttachmentAttributes && uploads.map((file, index) => {
        return <Row key={index}>
          <Column small={6} large={5}>
            <Authorization
              allow={isFieldAllowedToRead(attachmentAttributes, 'name')}
            >
              <FileDownloadLink
                fileUrl={getApplicationAttachmentDownloadLink(file.id)}
                label={file.name}
              />
            </Authorization>
          </Column>
          <Column small={3} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(attachmentAttributes, 'created_at')}
            >
              <FormText>{formatDate(file.created_at) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={3} large={2}>
            <Authorization
              //allow={isMethodAllowed(attachmentMethods, Methods.DELETE)}
              allow={true}
            >
              <RemoveButton
                className='third-level'
                onClick={() => deleteFile(file)}
                style={{right: 12}}
                title="Poista liitetiedosto"
                disabled={busy}
              />
            </Authorization>
          </Column>
        </Row>;
      })}
      {uploads.length === 0 && !busy && <Row>
        <Column small={12}>
          <FormHintText>Ei lisättyjä liitteitä.</FormHintText>
        </Column>
      </Row>}
      <Authorization
        //allow={isMethodAllowed(attachmentMethods, Methods.POST)}
        allow={true}
      >
        {busy
          ? <LoadingIndicator />
          : <AddFileButton label="Lisää tiedosto" name={fieldName} onChange={(e) => submitFile(field.id, e)} />}
      </Authorization>
    </Column>}}
    </AppConsumer>
  );
});

const ApplicationFormSubsectionFields = connect(
  (state, props) => ({
    fieldTypeMapping: getFieldTypeMapping(state),
    sectionApplicantType: getSectionApplicantType(state, props.section, props.identifier)
  }), {
    change
  }
)(
  ({
    section,
    fieldTypeMapping,
    identifier,
    change,
    sectionApplicantType
  }) => {
    const renderField = useCallback((pathName, field) => {
      if (!field.enabled) {
        return null;
      }

      const fieldName = [
        pathName,
        ApplicationSectionKeys.Fields,
        field.identifier,
      ].join('.');
      const fieldType = fieldTypeMapping[field.type];

      // Special cases that use a different submission path and thus different props
      if (fieldType === 'uploadfiles') {
        return <ApplicationFormFileField field={field} fieldName={fieldName} />;
      }

      let extraAttributes = {};
      let fieldOverrides = {};
      let columnWidths = {
        small: 12,
        medium: 6,
        large: 3,
      };

      switch (fieldType) {
        case 'textbox':
          break;
        case 'textarea':
          columnWidths = {
            small: 12,
            medium: 12,
            large: 12,
          };
          break;
        case 'dropdown':
          extraAttributes = {
            choices: field.choices.map((option) => ({
              display_name: option.label,
              value: option.value
            }))
          };
          break;
        case 'checkbox':
          fieldOverrides = {
            options: field.choices.map((choice) => ({
              value: choice.value,
              label: choice.has_text_input ? <>
                {choice.text}
                { " " }
                <FormField name={`${fieldName}.extraValue`} fieldAttributes={{
                  type: "textbox",
                  required: false,
                  read_only: false,
                  label: ''
                }} invisibleLabel />
              </> : choice.text,
            }))
          };
          columnWidths = {
            small: 12,
            medium: 12,
            large: 12,
          };
          break;
        case 'radiobutton':
        case 'radiobuttoninline':
          extraAttributes = {
            type: 'radio-with-field'
          };
          fieldOverrides = {
            options: field.choices.map((choice) => ({
              label: choice.text,
              value: choice.value,
              field: choice.has_text_input
                ? <FormField name={`${fieldName}.extraValue`} fieldAttributes={{
                  type: "textbox",
                  required: false,
                  read_only: false,
                  label: ''
                }} invisibleLabel />
                : null
            }))
          }
          columnWidths = {
            small: 12,
            medium: 12,
            large: 12,
          };
          break;
        default:
          break;
      }

      return (
        <Column {...columnWidths} className="ApplicationFormField__container">
          <FormField
            name={`${fieldName}.value`}
            field={field}
            fieldAttributes={{
              read_only: false,
              type: fieldType,
              label: field.label,
              required: field.required,
              ...extraAttributes
            }}
            overrideValues={fieldOverrides}
            onChange={(newValue) => checkSpecialValues(field, newValue)}
          />
        </Column>
      );
    }, []);

    const checkSpecialValues = useCallback((field: Object, newValue: PlotApplicationFormValue): void => {
      if (field.identifier === APPLICANT_TYPE_FIELD_IDENTIFIER && section.identifier === APPLICANT_SECTION_IDENTIFIER) {
        change(FormNames.PLOT_APPLICATION, `${identifier}.metadata.applicantType`, valueToApplicantType(newValue));
      }
    }, []);

    return (
      <>
        <Row>
          {section.fields.map((field) => <Fragment key={field.id}>{renderField(identifier, field)}</Fragment>)}
        </Row>
        {section.subsections.map((subsection) => (
          <PlotApplicationSubsection
            path={[identifier, ApplicationSectionKeys.Subsections]}
            section={subsection}
            key={subsection.id}
            parentApplicantType={sectionApplicantType}
          />
        ))}
      </>
    );
  }
);

const ApplicationFormSubsectionFieldArray = ({
  fields,
  section,
  headerTag: HeaderTag,
} : {
  fields: Fields,
  section: Object,
  headerTag: string | React$AbstractComponent<{ children?: React$Node }, null>
}): React$Node => {
  return (
    <div className="ApplicationFormSubsectionFieldArray">
      {fields.map((identifier, i) => (
        <div
          className="ApplicationFormSubsectionFieldArray__item"
          key={identifier}
        >
          <div className="ApplicationFormSubsectionFieldArray__item-content">
            <HeaderTag>
              {fields.length > 1 && section.identifier !== TARGET_SECTION_IDENTIFIER && (
                <RemoveButton
                  onClick={() => fields.remove(i)}
                  style={{float: 'right'}}
                />
              )}
              {section.identifier === TARGET_SECTION_IDENTIFIER
                ? <>{section.title} ({getSectionTargetFromMeta(identifier)})</>
                : <>{section.title} ({i + 1})</>
              }
            </HeaderTag>
            <ApplicationFormSubsectionFields
              section={section}
              identifier={identifier}
            />
          </div>
        </div>
      ))}
      {section.identifier !== TARGET_SECTION_IDENTIFIER && <AddButton
        onClick={() => fields.push(getSectionTemplate(section.identifier))}
        label={section.add_new_text || "Lisää uusi"}
      />}
    </div>
  );
};

const PlotApplicationSubsection = ({
  path,
  section,
  headerTag: HeaderTag = 'h3',
  parentApplicantType
} : {
  path: Array<string>,
  section: Object,
  headerTag?: string | React$AbstractComponent<{ children?: React$Node }, null>,
  parentApplicantType?: string | null
}): React$Node => {
  if (!section.visible) {
    return null;
  }

  if (parentApplicantType === ApplicantTypes.UNSELECTED) {
    return null;
  }

  if (parentApplicantType !== ApplicantTypes.NOT_APPLICABLE && ![
    ApplicantTypes.UNKNOWN,
    ApplicantTypes.BOTH,
    parentApplicantType
  ].includes(section.applicant_type)) {
    return null;
  }

  const isArray = section.add_new_allowed;
  const pathName = [...path, section.identifier].join('.');

  return (
    <div className="ApplicationFormSubsection">
      {isArray ? (
        <FieldArray
          name={pathName}
          component={ApplicationFormSubsectionFieldArray}
          props={{ section, headerTag: HeaderTag }}
        />
      ) : (
        <div className="ApplicationFormSubsection__content">
          <HeaderTag>{section.title}</HeaderTag>
          <ApplicationFormSubsectionFields
            section={section}
            identifier={pathName}
          />
        </div>
      )}
    </div>
  );
};

export default PlotApplicationSubsection;
