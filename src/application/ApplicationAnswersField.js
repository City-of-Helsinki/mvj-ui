// @flow

import React from 'react';
import type {FormSection} from '$src/plotSearch/types';
import type {SavedApplicationFormSection, UploadedFileMeta} from '$src/plotApplications/types';
import type {SectionExtraComponentProps} from '$src/application/types';
import {Column, Row} from 'react-foundation';
import FileDownloadLink from '$components/file/FileDownloadLink';
import {getApplicationAttachmentDownloadLink} from '$src/plotApplications/helpers';
import FormTextTitle from '$components/form/FormTextTitle';
import FormText from '$components/form/FormText';
import ApplicationAnswersSection from '$src/application/ApplicationAnswersSection';

type Props = {
  section: FormSection,
  answer: SavedApplicationFormSection,
  topLevel: boolean,
  fieldTypes: Array<{ value: string, display_name: string }>,
  identifier: string,
  sectionExtraComponent?: React$ComponentType<SectionExtraComponentProps>,
  sectionTitleTransformers?: Array<(string, FormSection, SavedApplicationFormSection) => string>,
};

const ApplicationAnswersField = ({
  section,
  answer,
  fieldTypes,
  topLevel,
  identifier,
  sectionExtraComponent: SectionExtraComponent,
  sectionTitleTransformers,
}: Props): React$Node => {
  return <>
    <Row>
      {section.fields.filter((field) => field.enabled).map((field) => {
        const fieldAnswer = answer.fields[field.identifier];

        const getChoiceName = (id) => {
          if (!id) {
            return null;
          }

          const choice = field.choices.find((choice) => choice.value === id || Number(choice.value) === id);

          let name = choice?.text || '(tuntematon vaihtoehto)';
          if (choice?.has_text_input) {
            name += ` (${fieldAnswer.extra_value})`;
          }

          return name;
        };

        let displayValue = fieldAnswer?.value;
        if (displayValue !== undefined && displayValue !== null) {
          switch (fieldTypes?.find((fieldType) => fieldType.value === field.type)?.display_name) {
            case 'radiobutton':
            case 'radiobuttoninline':
              displayValue = getChoiceName(displayValue);
              break;
            case 'checkbox':
            case 'dropdown':
              if (Array.isArray(displayValue)) {
                displayValue = displayValue.map(getChoiceName).join(', ');
              } else {
                if (field.choices.length > 0) {
                  displayValue = getChoiceName(displayValue);
                } else {
                  displayValue = displayValue === true ? 'Kyllä' : 'Ei';
                }
              }
              break;
            case 'uploadfiles':
              // TODO: can this be cast in a cleaner way?
              const files: Array<UploadedFileMeta> = (displayValue: any);
              displayValue = files.length > 0 ? <ul>{files.map((file) => <li key={file.id}>
                <FileDownloadLink
                  fileUrl={getApplicationAttachmentDownloadLink(file.id)}
                  label={file.name}
                />
              </li>)}</ul> : null;
              break;
            case 'hidden':
              if(!field.choices) {
                displayValue = field.default_value;
                break;
              }

              displayValue = field.choices.find(choice => choice.value === field.default_value)?.text;
              break;
          }
        }

        return <Column small={12} medium={6} large={3} key={field.identifier}>
          <FormTextTitle>
            {field.label}
          </FormTextTitle>
          <FormText className="PlotApplication__field-value">
            {displayValue || '-'}
          </FormText>
        </Column>;
      })}
    </Row>
    {section.subsections.filter((section) => section.visible).map((subsection) =>
      <ApplicationAnswersSection
        section={subsection}
        answer={answer.sections[subsection.identifier]}
        key={subsection.identifier}
        fieldTypes={fieldTypes}
        sectionExtraComponent={SectionExtraComponent}
        sectionTitleTransformers={sectionTitleTransformers}
      />)}
    {SectionExtraComponent ? <SectionExtraComponent
      section={section}
      identifier={identifier}
      answer={answer}
      topLevel={topLevel}
    /> : null}
  </>;
};

export default ApplicationAnswersField;
