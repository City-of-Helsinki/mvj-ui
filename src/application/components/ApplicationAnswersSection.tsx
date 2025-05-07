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

type Props = {
  section: FormSection;
  answer: SavedApplicationFormSection | Array<SavedApplicationFormSection>;
  topLevel?: boolean;
  fieldTypes: any;
  sectionExtraComponent?: React.ComponentType<SectionExtraComponentProps>;
  sectionTitleTransformers?: Array<any>;
  plotSearch?: any;
  editMode?: boolean;
};

const ApplicationAnswersSection = ({
  section,
  answer,
  topLevel = false,
  fieldTypes,
  sectionExtraComponent,
  sectionTitleTransformers,
}: Props): JSX.Element => {
  if (!answer) {
    return null;
  }

  const handleShowContactModal = () => {
    // const contact = getContactFromAnswerFields(answer);
    // initializeContactForm({ ...contact });
    // receiveContactModalSettings({
    //   field: `${field}.tenant.contact`,
    //   contactId: null,
    //   isNew: false,
    // });
    // receiveIsSaveClicked(false);
    // showContactModal();
  }

  const showCreateContactButton = true;
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
            <SubTitle>
              {title}
            </SubTitle>
            {showCreateContactButton && (
              <AddButtonThird
                label="Luo asiakas"
                onClick={handleShowContactModal}
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
        />
      )}
    </Wrapper>
  );
};

export default ApplicationAnswersSection;
