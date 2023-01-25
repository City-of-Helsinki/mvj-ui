// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {orderBy} from 'lodash';

import Authorization from '$components/authorization/Authorization';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {FormNames, ViewModes} from '$src/enums';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import Title from '$components/content/Title';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentPlotApplication,
  getIsFetchingApplicationRelatedForm,
  getApplicationRelatedForm,
  getApplicationRelatedAttachments,
  getIsFetchingApplicationRelatedAttachments,
} from '$src/plotApplications/selectors';
import {receiveCollapseStates} from '$src/plotApplications/actions';
// import {getContentBasicInformation} from '$src/plotApplications/helpers';
import {
  isFieldAllowedToRead,
} from '$util/helpers';
import type {Attributes} from '$src/types';
import type {PlotApplication as PlotApplicationType} from '$src/plotApplications/types';
import Loader from '../../components/loader/Loader';
import SubTitle from '../../components/content/SubTitle';
import {getApplicationAttachmentDownloadLink, reshapeSavedApplicationObject} from '../helpers';
import {
  getFormAttributes,
  getIsFetchingFormAttributes,
} from '../../plotSearch/selectors';
import {getFieldAttributes} from '../../util/helpers';
import {APPLICANT_MAIN_IDENTIFIERS, APPLICANT_SECTION_IDENTIFIER, TARGET_SECTION_IDENTIFIER} from '../constants';
import {getApplicationRelatedPlotSearch, getIsFetchingApplicationRelatedPlotSearch} from '../selectors';
import PlotApplicationTargetInfoCheck from './infoCheck/PlotApplicationTargetInfoCheck';
import PlotApplicationApplicantInfoCheck from './infoCheck/PlotApplicationApplicantInfoCheck';
import type {PlotSearch, FormSection} from '../../plotSearch/types';
import type {SavedApplicationFormSection, UploadedFileMeta} from '../types';
import FileDownloadLink from '../../components/file/FileDownloadLink';

type OwnProps = {};

type Props = {
  usersPermissions: UsersPermissionsType,
  applicationCollapseState: Boolean,
  receiveCollapseStates: Function,
  attributes: Attributes,
  currentPlotApplication: PlotApplicationType,
  isFetchingFormAttributes: boolean,
  isFetchingForm: boolean,
  form: Object,
  formAttributes: Attributes,
  isFetchingFormAttachments: boolean,
  attachments: Array<Object>,
  isFetchingPlotSearch: boolean,
  plotSearch: ?Object,
  topLevel: boolean
}

type SingleSectionItemProps = {
  section: FormSection,
  answer: SavedApplicationFormSection,
  topLevel: boolean,
  fieldTypes: Array<{ value: string, display_name: string }>,
  plotSearch: PlotSearch,
  identifier: string
};

const SingleSectionItem = ({section, answer, fieldTypes, plotSearch, topLevel, identifier}: SingleSectionItemProps) => {
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
      <SectionData section={subsection} answer={answer.sections[subsection.identifier]} key={subsection.identifier}
        fieldTypes={fieldTypes} plotSearch={plotSearch} />)}
    {topLevel && section.identifier === TARGET_SECTION_IDENTIFIER &&
      (answer.metadata?.identifier ? <PlotApplicationTargetInfoCheck
        section={section}
        identifier={identifier}
        targetId={(answer.metadata.identifier: any)}
      /> : <Loader isLoading={true} />)}
    {topLevel && section.identifier === APPLICANT_SECTION_IDENTIFIER &&
      <PlotApplicationApplicantInfoCheck
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
  plotSearch: PlotSearch
};

const SectionData = ({section, answer, topLevel = false, fieldTypes, plotSearch}: SectionDataProps) => {
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
            subtitle = `${target.lease_address.address || '-'} (${target.lease_identifier})`;
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
          <SingleSectionItem section={section} answer={singleAnswer} fieldTypes={fieldTypes} plotSearch={plotSearch} topLevel={topLevel} identifier={`${section.identifier}[${i}]`} />
        </Collapse>;
      })
      : <SingleSectionItem section={section} answer={answer[0] || answer} fieldTypes={fieldTypes} plotSearch={plotSearch} topLevel={topLevel} identifier={section.identifier} />}
  </Wrapper>;
};

class PlotApplication extends PureComponent<Props, void> {
  handleBasicInfoCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_APPLICATION]: {
          plot_application: val,
        },
      },
    });
  }

  render() {
    const {
      applicationCollapseState,
      attributes,
      currentPlotApplication,
      isFetchingForm,
      form,
      isFetchingFormAttributes,
      formAttributes,
      isFetchingFormAttachments,
      attachments,
      plotSearch,
      isFetchingPlotSearch,
    } = this.props;

    const plotApplication = currentPlotApplication; // getContentBasicInformation(currentPlotApplication);
    const isLoading = !form || isFetchingForm || isFetchingFormAttributes || isFetchingFormAttachments || !plotSearch?.id || isFetchingPlotSearch;

    let answerData;
    if (!isLoading) {
      answerData = reshapeSavedApplicationObject(plotApplication.entries_data, form, formAttributes, attachments);
    }

    const fieldTypes = getFieldAttributes(formAttributes, 'sections.child.children.fields.child.children.type.choices');

    return (
      <div className="PlotApplication">
        <Title>
          Hakemus
        </Title>
        <Divider />
        <Loader isLoading={isLoading} />
        <Row className='summary__content-wrapper'>
          <Column small={12}>
            <Collapse
              defaultOpen={applicationCollapseState !== undefined ? applicationCollapseState : true}
              headerTitle='Hakemuksen käsittelytiedot'
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Authorization allow={isFieldAllowedToRead(attributes, 'plot_search')}>
                  <Column small={12} medium={6} large={4}>
                    <FormTextTitle>
                      Tonttihakemus
                    </FormTextTitle>
                    <FormText>{plotApplication.plot_search}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'arrival_time')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Saapumisajankohta
                    </FormTextTitle>
                    <FormText>{plotApplication.arrival_time}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'time')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Klo
                    </FormTextTitle>
                    <FormText>{plotApplication.time}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'saver')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Tallentaja
                    </FormTextTitle>
                    <FormText>{plotApplication.saver}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'disapproval_reason')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Hylkäämisen syy
                    </FormTextTitle>
                    <FormText>{plotApplication.disapproval_reason}</FormText>
                  </Column>
                </Authorization>
                <Authorization allow={isFieldAllowedToRead(attributes, 'notice')}>
                  <Column small={6} medium={4} large={2}>
                    <FormTextTitle>
                      Huomautus
                    </FormTextTitle>
                    <FormText>{plotApplication.notice}</FormText>
                  </Column>
                </Authorization>
              </Row>
            </Collapse>
            {!isLoading && fieldTypes && orderBy(form.sections, 'order').filter((section) => section.visible).map((section) =>
              <SectionData section={section} answer={answerData.sections[section.identifier]} topLevel fieldTypes={fieldTypes} key={section.identifier} plotSearch={plotSearch} />)}
          </Column>
        </Row>
      </div>
    );
  }
}

export default (connect(
  (state) => {
    return {
      usersPermissions: getUsersPermissions(state),
      applicationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.PLOT_APPLICATION}.basic_information`),
      attributes: getAttributes(state),
      currentPlotApplication: getCurrentPlotApplication(state),
      isFetchingForm: getIsFetchingApplicationRelatedForm(state),
      form: getApplicationRelatedForm(state),
      formAttributes: getFormAttributes(state),
      isFetchingFormAttributes: getIsFetchingFormAttributes(state),
      attachments: getApplicationRelatedAttachments(state),
      isFetchingAttachments: getIsFetchingApplicationRelatedAttachments(state),
      isFetchingPlotSearch: getIsFetchingApplicationRelatedPlotSearch(state),
      plotSearch: getApplicationRelatedPlotSearch(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(PlotApplication): React$ComponentType<OwnProps>);
