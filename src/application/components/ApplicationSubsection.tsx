import React, { Fragment, useCallback } from "react";
import { change, FieldArray, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Column, Row } from "react-foundation";
import AddButton from "/src/components/form/AddButton";
import RemoveButton from "/src/components/form/RemoveButton";
import FormField from "/src/components/form/FormField";
import AddFileButton from "/src/components/form/AddFileButton";
import FormTextTitle from "/src/components/form/FormTextTitle";
import FormText from "/src/components/form/FormText";
import Authorization from "/src/components/authorization/Authorization";
import FileDownloadLink from "/src/components/file/FileDownloadLink";
import LoadingIndicator from "/src/components/multi-select/LoadingIndicator";
import { ButtonColors } from "/src/components/enums";
import FormHintText from "/src/components/form/FormHintText";
import { formatDate, isFieldAllowedToRead } from "util/helpers";
import { ConfirmationModalTexts } from "enums";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import { ApplicantTypes } from "/src/application/enums";
import { getApplicationAttachmentDownloadLink, getFieldFileIds, getSectionApplicantType, getSectionTemplate, valueToApplicantType } from "/src/application/helpers";
import { getAttachmentAttributes, getAttachmentMethods, getExistingUploads, getFieldTypeMapping, getIsFetchingApplicationRelatedAttachments, getIsFetchingAttachmentAttributes, getIsFetchingPendingUploads, getIsPerformingFileOperation, getPendingUploads } from "/src/application/selectors";
import { ApplicationSectionKeys } from "/src/application/components/enums";
import { APPLICANT_MAIN_IDENTIFIERS, APPLICANT_SECTION_IDENTIFIER, APPLICANT_TYPE_FIELD_IDENTIFIER, EMAIL_FIELD_IDENTIFIER, TARGET_SECTION_IDENTIFIER } from "/src/application/constants";
import { deleteUploadedAttachment, uploadAttachment } from "/src/application/actions";
import type { FormSection, PlotApplicationFormValue, UploadedFileMeta } from "/src/application/types";
import { companyIdentifierValidator, emailValidator, personalIdentifierValidator } from "/src/application/formValidation";
const ApplicationFormFileField = connect((state, props) => {
  const {
    formName,
    formPath,
    field,
    fieldName
  } = props;
  return {
    pendingUploads: getPendingUploads(state),
    existingUploads: getExistingUploads(state, field.identifier),
    attachmentMethods: getAttachmentMethods(state),
    attachmentAttributes: getAttachmentAttributes(state),
    isFetchingPendingUploads: getIsFetchingPendingUploads(state),
    isFetchingAttachments: getIsFetchingApplicationRelatedAttachments(state),
    isFetchingAttachmentAttributes: getIsFetchingAttachmentAttributes(state),
    isPerformingFileOperation: getIsPerformingFileOperation(state),
    fieldFileIds: getFieldFileIds(state, formName, fieldName),
    attachmentIds: formValueSelector(formName)(state, (formPath ? `${formPath}.` : '') + 'attachments')
  };
}, {
  uploadAttachment,
  deleteUploadedAttachment,
  change
})(({
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
  change,
  fieldFileIds,
  attachmentIds,
  formName,
  formPath,
  answerId
}) => {
  return <AppConsumer>
      {({
      dispatch
    }) => {
      const isNew = !answerId;
      const pathWithinForm = fieldName.split('.').slice(1).join('.');

      const addId = (newId: number) => {
        change(formName, `${fieldName}.value`, [...fieldFileIds, newId]);
        change(formName, (formPath ? `${formPath}.` : '') + 'attachments', [...attachmentIds, newId]);
      };

      const removeId = (newId: number) => {
        change(formName, `${fieldName}.value`, fieldFileIds.filter(id => id !== newId));
        change(formName, (formPath ? `${formPath}.` : '') + 'attachments', attachmentIds.filter(id => id !== newId));
      };

      const submitFile = (fieldId, e) => {
        uploadAttachment({
          fileData: {
            field: fieldId,
            file: e.target.files[0],
            answer: answerId || undefined
          },
          callback: (path: string, uploadedFile: UploadedFileMeta) => {
            addId(uploadedFile.id);
          },
          path: pathWithinForm
        });
      };

      const uploads = (isNew ? pendingUploads : existingUploads).filter(file => fieldFileIds.includes(file.id));

      const deleteFile = file => {
        dispatch({
          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
          confirmationFunction: () => {
            // Hard delete only if this is a new editor. Edit mode can be canceled, in which case changes to files
            // are desirable to not also take place. Orphaned files not attached to an application anymore are
            // planned to be removed by the backend periodically.
            if (isNew) {
              deleteUploadedAttachment(file);
            }

            removeId(file.id);
          },
          confirmationModalButtonClassName: ButtonColors.ALERT,
          confirmationModalButtonText: ConfirmationModalTexts.DELETE_ATTACHMENT.BUTTON,
          confirmationModalLabel: ConfirmationModalTexts.DELETE_ATTACHMENT.LABEL,
          confirmationModalTitle: ConfirmationModalTexts.DELETE_ATTACHMENT.TITLE
        });
      };

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
                <Authorization allow={isFieldAllowedToRead(attachmentAttributes, 'name')}>
                  <FileDownloadLink fileUrl={getApplicationAttachmentDownloadLink(file.id)} label={file.name} />
                </Authorization>
              </Column>
              <Column small={3} large={3}>
                <Authorization allow={isFieldAllowedToRead(attachmentAttributes, 'created_at')}>
                  <FormText>{formatDate(file.created_at) || '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={3} large={2}>
                <Authorization //allow={isMethodAllowed(attachmentMethods, Methods.DELETE)}
              allow={true}>
                  <RemoveButton className='third-level' onClick={() => deleteFile(file)} style={{
                  right: 12
                }} title="Poista liitetiedosto" disabled={busy} />
                </Authorization>
              </Column>
            </Row>;
        })}
          {uploads.length === 0 && !busy && <Row>
            <Column small={12}>
              <FormHintText>Ei lisättyjä liitteitä.</FormHintText>
            </Column>
          </Row>}
          <Authorization //allow={isMethodAllowed(attachmentMethods, Methods.POST)}
        allow={true}>
            {busy ? <LoadingIndicator /> : <AddFileButton label="Lisää tiedosto" name={fieldName} onChange={e => submitFile(field.id, e)} />}
          </Authorization>
        </Column>;
    }}
    </AppConsumer>;
});
const ApplicationFormSubsectionFields = connect((state, props) => ({
  sectionApplicantType: getSectionApplicantType(state, props.formName, props.section, props.identifier)
}), {
  change
})(({
  section,
  identifier,
  change,
  sectionApplicantType,
  formName,
  formPath,
  sectionTitleTransformers,
  answerId
}) => {
  const renderField = useCallback((pathName, field) => {
    if (!field.enabled) {
      return null;
    }

    const fieldName = [pathName, ApplicationSectionKeys.Fields, field.identifier].join('.');
    const fieldType = field.type;

    // Special cases that use a different submission path and thus different props
    if (fieldType === 'uploadfiles') {
      return <ApplicationFormFileField field={field} fieldName={fieldName} formName={formName} formPath={formPath} answerId={answerId} />;
    }

    let extraAttributes = {};
    let fieldOverrides = {};
    let columnWidths = {
      small: 12,
      medium: 6,
      large: 3
    };

    switch (fieldType) {
      case 'textbox':
      case 'fractional':
        break;

      case 'textarea':
        columnWidths = {
          small: 12,
          medium: 12,
          large: 12
        };
        break;

      case 'dropdown':
        extraAttributes = {
          choices: field.choices.map(option => ({
            display_name: option.label,
            value: option.value
          }))
        };
        break;

      case 'hidden':
        if (field.identifier === APPLICANT_TYPE_FIELD_IDENTIFIER) {
          change(formName, `${identifier}.metadata.applicantType`, valueToApplicantType(field.default_value));
        }

        extraAttributes = {
          type: 'hidden'
        };
        break;

      case 'checkbox':
        fieldOverrides = {
          options: field.choices.map(choice => ({
            value: choice.value,
            label: choice.has_text_input ? <>
                {choice.text}
                {' '}
                <FormField name={`${fieldName}.extraValue`} fieldAttributes={{
                type: 'textbox',
                required: false,
                read_only: false,
                label: ''
              }} invisibleLabel />
              </> : choice.text
          }))
        };
        columnWidths = {
          small: 12,
          medium: 12,
          large: 12
        };
        break;

      case 'radiobutton':
      case 'radiobuttoninline':
        extraAttributes = {
          type: 'radio-with-field'
        };
        fieldOverrides = {
          options: field.choices.map(choice => ({
            label: choice.text,
            value: choice.value,
            field: choice.has_text_input ? <FormField name={`${fieldName}.extraValue`} fieldAttributes={{
              type: 'textbox',
              required: false,
              read_only: false,
              label: ''
            }} invisibleLabel /> : null
          }))
        };
        columnWidths = {
          small: 12,
          medium: 12,
          large: 12
        };
        break;

      default:
        break;
    }

    let validator;

    switch (fieldName.substring(fieldName.lastIndexOf('.') + 1)) {
      case APPLICANT_MAIN_IDENTIFIERS[ApplicantTypes.PERSON].IDENTIFIER_FIELD:
        validator = personalIdentifierValidator;
        break;

      case APPLICANT_MAIN_IDENTIFIERS[ApplicantTypes.COMPANY].IDENTIFIER_FIELD:
        validator = companyIdentifierValidator;
        break;

      case EMAIL_FIELD_IDENTIFIER:
        validator = emailValidator;
        break;
    }

    return <Column {...columnWidths} className="ApplicationFormField__container">
          {/** @ts-ignore: No overload matches this call. */}
          <FormField name={`${fieldName}.value`} field={field} fieldAttributes={{
            read_only: false,
            type: fieldType,
            label: field.label,
            required: field.required,
            ...extraAttributes
          }} overrideValues={fieldOverrides} onChange={newValue => checkSpecialValues(field, newValue)} validate={validator} />
        </Column>;
  }, []);
  const checkSpecialValues = useCallback((field: Record<string, any>, newValue: PlotApplicationFormValue): void => {
    if (field.identifier === APPLICANT_TYPE_FIELD_IDENTIFIER && section.identifier === APPLICANT_SECTION_IDENTIFIER) {
      change(formName, `${identifier}.metadata.applicantType`, valueToApplicantType(newValue));
    }
  }, []);
  return <>
        <Row>
          {section.fields.map(field => <Fragment key={field.id}>{renderField(identifier, field)}</Fragment>)}
        </Row>
        {section.subsections.map(subsection => <ApplicationSubsection path={[identifier, ApplicationSectionKeys.Subsections]} section={subsection} key={subsection.id} parentApplicantType={sectionApplicantType} formName={formName} formPath={formPath} sectionTitleTransformers={sectionTitleTransformers} answerId={answerId} />)}
      </>;
});

const ApplicationFormSubsectionFieldArray = ({
  fields,
  section,
  headerTag: HeaderTag,
  formName,
  formPath,
  sectionTitleTransformers,
  answerId
}: {
  fields: any;
  section: any;
  headerTag: string | React.ComponentType<{
    children?: React.ReactNode;
  }>;
  formName: string;
  formPath: string;
  sectionTitleTransformers: Array<(arg0: string, arg1: FormSection, arg2: string) => string>;
  answerId: number | null;
}): React.ReactNode => {
  return <div className="ApplicationFormSubsectionFieldArray">
      {fields.map((identifier, i) => {
      const subtitle: string = (sectionTitleTransformers || []).reduce((title, transformer) => transformer(title, section, identifier), `${section.title} (${i + 1})`);
      return <div className="ApplicationFormSubsectionFieldArray__item" key={identifier}>
            <div className="ApplicationFormSubsectionFieldArray__item-content">
              {fields.length > 1 && section.identifier !== TARGET_SECTION_IDENTIFIER && <RemoveButton onClick={() => fields.remove(i)} style={{
            float: 'right'
          }} />}
              <HeaderTag>
                {subtitle}
              </HeaderTag>
              <ApplicationFormSubsectionFields section={section} identifier={identifier} formName={formName} formPath={formPath} sectionTitleTransformers={sectionTitleTransformers} answerId={answerId} />
            </div>
          </div>;
    })}
      {section.identifier !== TARGET_SECTION_IDENTIFIER && <AddButton onClick={() => fields.push(getSectionTemplate(formName, formPath, section.identifier))} label={section.add_new_text || 'Lisää uusi'} />}
    </div>;
};

const ApplicationSubsection = ({
  path,
  section,
  headerTag: HeaderTag = 'h3',
  parentApplicantType,
  formName,
  formPath = '',
  sectionTitleTransformers,
  answerId
}: {
  path: Array<string>;
  section: any;
  headerTag?: string | React.ComponentType<{
    children?: React.ReactNode;
  }>;
  parentApplicantType?: string | null;
  formName: string;
  formPath: string | null | undefined;
  sectionTitleTransformers: Array<(arg0: string, arg1: FormSection, arg2: string) => string>;
  answerId: number | null;
}): React.ReactNode => {
  if (!section.visible) {
    return null;
  }

  if (parentApplicantType === ApplicantTypes.UNSELECTED) {
    return null;
  }

  if (parentApplicantType !== ApplicantTypes.NOT_APPLICABLE && ![ApplicantTypes.UNKNOWN, ApplicantTypes.BOTH, parentApplicantType].includes(section.applicant_type)) {
    return null;
  }

  const isArray = section.add_new_allowed;
  const pathName = [...path, section.identifier].join('.');
  const title = section.title || '(tuntematon osio)';
  return <div className="ApplicationFormSubsection">
      {isArray ? <FieldArray name={pathName} component={ApplicationFormSubsectionFieldArray} props={{
      section,
      headerTag: HeaderTag,
      formName,
      formPath,
      sectionTitleTransformers,
      answerId
    }} /> : <div className="ApplicationFormSubsection__content">
          <HeaderTag>{title}</HeaderTag>
          <ApplicationFormSubsectionFields section={section} identifier={pathName} formName={formName} formPath={formPath} sectionTitleTransformers={sectionTitleTransformers} answerId={answerId} />
        </div>}
    </div>;
};

export default ApplicationSubsection;