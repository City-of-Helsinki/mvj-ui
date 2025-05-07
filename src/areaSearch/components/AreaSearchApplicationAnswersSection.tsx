import React from "react";
import Collapse from "@/components/collapse/Collapse";
import SubTitle from "@/components/content/SubTitle";
import AreaSearchApplicationAnswersField from "@/areaSearch/components/AreaSearchApplicationAnswersField";
import type {
  FormSection,
  SavedApplicationFormSection,
  SectionExtraComponentProps,
} from "@/application/types";
import AddButtonThird from "@/components/form/AddButtonThird";
import { getContactTypeString } from "@/areaSearch/helpers";
import {
  getIsConditionallyHiddenSection,
  getIsCreateContactButtonVisible,
} from "@/areaSearch/helpers";
import type { HandleShowContactModal } from "@/areaSearch/types";
import { isArray } from "lodash";

type Props = {
  section: FormSection;
  answerSection:
    | SavedApplicationFormSection
    | Array<SavedApplicationFormSection>;
  topLevel?: boolean;
  fieldTypes: any;
  sectionExtraComponent?: React.ComponentType<SectionExtraComponentProps>;
  sectionTitleTransformers?: Array<any>;
  plotSearch?: any;
  editMode?: boolean;
  handleShowContactModal?: HandleShowContactModal;
};

const AreaSearchApplicationAnswersSection = ({
  section,
  answerSection,
  topLevel = false,
  fieldTypes,
  sectionExtraComponent,
  sectionTitleTransformers,
  handleShowContactModal,
}: Props): JSX.Element => {
  if (!answerSection) {
    return null;
  }

  const contactType = getContactTypeString(section?.identifier);

  const isCreateContactButtonVisible =
    !isArray(answerSection) &&
    getIsCreateContactButtonVisible(
      handleShowContactModal,
      section,
      answerSection,
    );

  const title = section.title || "(tuntematon osio)";
  const Wrapper = topLevel
    ? ({ children }) => (
        <Collapse defaultOpen={true} headerTitle={title}>
          {children}
        </Collapse>
      )
    : ({ children }) => (
        <div>
          <div className="AreaSearchApplicationAnswersSectionSubtitleWrapper">
            <SubTitle>{title}</SubTitle>
            {isCreateContactButtonVisible && (
              <AddButtonThird
                label="Luo asiakas"
                onClick={() =>
                  handleShowContactModal(
                    contactType,
                    section.identifier,
                    answerSection,
                  )
                }
              />
            )}
          </div>
          {children}
        </div>
      );

  const isHiddenSection = getIsConditionallyHiddenSection(
    section,
    answerSection,
  );

  if (isHiddenSection) {
    return null;
  }

  return (
    <Wrapper>
      {section.add_new_allowed ? (
        (answerSection instanceof Array ? answerSection : []).map(
          (singleAnswerSection, i) => {
            const subtitle: string = (sectionTitleTransformers || []).reduce(
              (title, transformer) =>
                transformer(title, section, singleAnswerSection),
              `#${i + 1}`,
            );
            return (
              <Collapse
                className="collapse__secondary"
                key={i}
                headerTitle={subtitle}
                defaultOpen={topLevel}
              >
                <AreaSearchApplicationAnswersField
                  section={section}
                  answerSection={singleAnswerSection}
                  fieldTypes={fieldTypes}
                  topLevel={topLevel}
                  identifier={`${section.identifier}[${i}]`}
                  sectionExtraComponent={sectionExtraComponent}
                  sectionTitleTransformers={sectionTitleTransformers}
                  handleShowContactModal={handleShowContactModal}
                />
              </Collapse>
            );
          },
        )
      ) : (
        <AreaSearchApplicationAnswersField
          section={section}
          answerSection={answerSection[0] || answerSection}
          fieldTypes={fieldTypes}
          topLevel={topLevel}
          identifier={section.identifier}
          sectionExtraComponent={sectionExtraComponent}
          sectionTitleTransformers={sectionTitleTransformers}
          handleShowContactModal={handleShowContactModal}
        />
      )}
    </Wrapper>
  );
};

export default AreaSearchApplicationAnswersSection;
