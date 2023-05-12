// @flow

import React from 'react';
import type {FormSection, PlotSearch} from '$src/plotSearch/types';
import type {SavedApplicationFormSection, UploadedFileMeta} from '$src/plotApplications/types';
import PlotApplicationTargetInfoCheckEdit
  from '$src/plotApplications/components/infoCheck/PlotApplicationTargetInfoCheckEdit';
import PlotApplicationTargetInfoCheck from '$src/plotApplications/components/infoCheck/PlotApplicationTargetInfoCheck';
import PlotApplicationApplicantInfoCheckEdit
  from '$src/plotApplications/components/infoCheck/PlotApplicationApplicantInfoCheckEdit';
import PlotApplicationApplicantInfoCheck
  from '$src/plotApplications/components/infoCheck/PlotApplicationApplicantInfoCheck';
import {Column, Row} from 'react-foundation';
import FileDownloadLink from '$components/file/FileDownloadLink';
import {getApplicationAttachmentDownloadLink} from '$src/plotApplications/helpers';
import FormTextTitle from '$components/form/FormTextTitle';
import FormText from '$components/form/FormText';
import {
  APPLICANT_MAIN_IDENTIFIERS,
  APPLICANT_SECTION_IDENTIFIER,
  TARGET_SECTION_IDENTIFIER,
} from '$src/plotApplications/constants';
import Loader from '$components/loader/Loader';
import Collapse from '$components/collapse/Collapse';
import SubTitle from '$components/content/SubTitle';
import {getTargetTitle} from '$src/plotSearch/helpers';

type SingleSectionItemProps = {
  section: FormSection,
  answer: SavedApplicationFormSection,
  topLevel: boolean,
  fieldTypes: Array<{ value: string, display_name: string }>,
  plotSearch: PlotSearch,
  identifier: string,
  editMode?: boolean,
};

const SingleSectionItem = ({section, answer, fieldTypes, plotSearch, topLevel, identifier, editMode = false}: SingleSectionItemProps) => {
  const TargetInfoCheckComponent = editMode ? PlotApplicationTargetInfoCheckEdit : PlotApplicationTargetInfoCheck;
  const ApplicantInfoCheckComponent = editMode ? PlotApplicationApplicantInfoCheckEdit : PlotApplicationApplicantInfoCheck;

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
                displayValue = getChoiceName(displayValue);
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
      <SectionData
        section={subsection}
        answer={answer.sections[subsection.identifier]}
        key={subsection.identifier}
        fieldTypes={fieldTypes}
        plotSearch={plotSearch}
      />)}
    {topLevel && section.identifier === TARGET_SECTION_IDENTIFIER &&
      (answer.metadata?.identifier ? <TargetInfoCheckComponent
        section={section}
        identifier={identifier}
        targetId={(answer.metadata.identifier: any)}
      /> : <Loader isLoading={true} />)}
    {topLevel && section.identifier === APPLICANT_SECTION_IDENTIFIER &&
      <ApplicantInfoCheckComponent
        section={section}
        identifier={identifier}
        answer={answer}
      />}
  </>;
};

type SectionDataProps = {
  section: FormSection,
  answer: SavedApplicationFormSection | Array<SavedApplicationFormSection>,
  topLevel?: boolean,
  fieldTypes: Array<{ value: string, display_name: string }>,
  plotSearch: PlotSearch,
  editMode?: boolean,
};

const SectionData = ({section, answer, topLevel = false, fieldTypes, plotSearch, editMode}: SectionDataProps): React$Node => {
  if (!answer) {
    return null;
  }

  const title = section.title || '(tuntematon osio)';

  const Wrapper = topLevel ?
    ({children}) => <Collapse
      defaultOpen={true}
      headerTitle={title}
    >{children}</Collapse> : ({children}) => <div>
      <SubTitle>
        {title}
      </SubTitle>
      {children}
    </div>;
  return <Wrapper>
    {section.add_new_allowed
      ? (answer instanceof Array ? answer : []).map((singleAnswer, i) => {
        let subtitle = `#${i + 1}`;
        if (section.identifier === TARGET_SECTION_IDENTIFIER && singleAnswer?.metadata?.identifier) {
          const target = plotSearch?.plot_search_targets.find((target) => target.id === singleAnswer.metadata?.identifier);
          if (target) {
            subtitle = getTargetTitle(target);
          }
        }
        if (section.identifier === APPLICANT_SECTION_IDENTIFIER) {
          if (singleAnswer?.metadata?.identifier) {
            if (singleAnswer?.metadata?.applicantType) {
              const identifiers = APPLICANT_MAIN_IDENTIFIERS[String(singleAnswer?.metadata?.applicantType)];
              const sectionsWithIdentifier = singleAnswer.sections[identifiers?.DATA_SECTION];
              const sectionWithIdentifier = sectionsWithIdentifier instanceof Array ? sectionsWithIdentifier[0] : sectionsWithIdentifier;

              const typeText = identifiers?.LABEL || 'Hakija';
              const nameText = identifiers?.NAME_FIELDS?.map((field) => {
                return sectionWithIdentifier.fields[field]?.value || '';
              }).join(' ') || '-';

              subtitle += ` (${nameText}, ${typeText})`;
            }
          }
        }

        return <Collapse className="collapse__secondary" key={i} headerTitle={subtitle} defaultOpen={topLevel}>
          <SingleSectionItem
            section={section}
            answer={singleAnswer}
            fieldTypes={fieldTypes}
            plotSearch={plotSearch}
            topLevel={topLevel}
            identifier={`${section.identifier}[${i}]`}
            editMode={editMode}
          />
        </Collapse>;
      })
      : <SingleSectionItem
        section={section}
        answer={answer[0] || answer}
        fieldTypes={fieldTypes}
        plotSearch={plotSearch}
        topLevel={topLevel}
        identifier={section.identifier}
        editMode={editMode}
      />}
  </Wrapper>;
};

export default SectionData;
