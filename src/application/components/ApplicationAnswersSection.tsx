import React from "react";
import Collapse from "@/components/collapse/Collapse";
import SubTitle from "@/components/content/SubTitle";
import ApplicationAnswersField from "@/application/components/ApplicationAnswersField";
import type {
  FormSection,
  SavedApplicationFormSection,
  SectionExtraComponentProps,
} from "@/application/types";
import AddButtonThird from "@/components/form/AddButtonThird";
import { getContactTypeString } from "../helpers";
import { Contact } from "@/contacts/types";

type Props = {
  section: FormSection;
  answer: SavedApplicationFormSection | Array<SavedApplicationFormSection>;
  topLevel?: boolean;
  fieldTypes: any;
  sectionExtraComponent?: React.ComponentType<SectionExtraComponentProps>;
  sectionTitleTransformers?: Array<any>;
  plotSearch?: any;
  editMode?: boolean;
  handleShowContactModal?: (
    contactType: Contact["type"],
    answer: any,
  ) => void;
};

const ApplicationAnswersSection = ({
  section,
  answer,
  topLevel = false,
  fieldTypes,
  sectionExtraComponent,
  sectionTitleTransformers,
  handleShowContactModal,
}: Props): JSX.Element => {
  if (!answer) {
    return null;
  }

  const contactType = getContactTypeString(section?.identifier);

  const showCreateContactButton = true
  
  const title = section.title || "(tuntematon osio)";
  const Wrapper = topLevel
    ? ({ children }) => (
        <Collapse defaultOpen={true} headerTitle={title}>
          {children}
        </Collapse>
      )
    : ({ children }) => (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <SubTitle>{title}</SubTitle>
            {showCreateContactButton && (
              <AddButtonThird
                label="Luo asiakas"
                onClick={() => handleShowContactModal(contactType, answer)}
              />
            )}
          </div>
          {children}
        </div>
      );
  return (
    <Wrapper>
      {section.add_new_allowed ? (
        (answer instanceof Array ? answer : []).map((singleAnswer, i) => {
          const subtitle: string = (sectionTitleTransformers || []).reduce(
            (title, transformer) => transformer(title, section, singleAnswer),
            `#${i + 1}`,
          );
          return (
            <Collapse
              className="collapse__secondary"
              key={i}
              headerTitle={subtitle}
              defaultOpen={topLevel}
            >
              <ApplicationAnswersField
                section={section}
                answer={singleAnswer}
                fieldTypes={fieldTypes}
                topLevel={topLevel}
                identifier={`${section.identifier}[${i}]`}
                sectionExtraComponent={sectionExtraComponent}
                sectionTitleTransformers={sectionTitleTransformers}
                handleShowContactModal={handleShowContactModal}

              />
            </Collapse>
          );
        })
      ) : (
        <ApplicationAnswersField
          section={section}
          answer={answer[0] || answer}
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

export default ApplicationAnswersSection;
