import React from "react";
import { Column, Row } from "react-foundation";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import FormTextTitle from "@/components/form/FormTextTitle";
import FormText from "@/components/form/FormText";
import AreaSearchApplicationAnswersSection from "@/areaSearch/components/AreaSearchApplicationAnswersSection";
import { getApplicationAttachmentDownloadLink } from "@/application/helpers";
import type {
  FormSection,
  SavedApplicationFormSection,
  SectionExtraComponentProps,
  UploadedFileMeta,
} from "@/application/types";
import type { HandleShowContactModal } from "@/areaSearch/types";

type Props = {
  section: FormSection;
  answerSection: SavedApplicationFormSection;
  topLevel: boolean;
  fieldTypes: Array<{
    value: string;
    display_name: string;
  }>;
  identifier: string;
  sectionExtraComponent?: React.ComponentType<SectionExtraComponentProps>;
  sectionTitleTransformers?: Array<
    (
      arg0: string,
      arg1: FormSection,
      arg2: SavedApplicationFormSection,
    ) => string
  >;
  handleShowContactModal?: HandleShowContactModal;
};

const AreaSearchApplicationAnswersField = ({
  section,
  answerSection,
  fieldTypes,
  topLevel,
  identifier,
  sectionExtraComponent: SectionExtraComponent,
  sectionTitleTransformers,
  handleShowContactModal,
}: Props): JSX.Element => {
  return (
    <>
      <Row>
        {section.fields
          .filter((field) => field.enabled)
          .map((field) => {
            const fieldAnswer = answerSection.fields[field.identifier];
            const fieldType = fieldTypes?.find(
              (fieldType) => fieldType.value === field.type,
            )?.value;

            if (fieldType === "hidden") {
              return null;
            }

            const getChoiceName = (id) => {
              if (!id) {
                return null;
              }

              const choice = field.choices.find(
                (choice) => choice.value === id || Number(choice.value) === id,
              );
              let name = choice?.text || "(tuntematon vaihtoehto)";

              if (choice?.has_text_input) {
                name += ` (${fieldAnswer.extra_value})`;
              }

              return name;
            };

            let displayValue: any = fieldAnswer?.value;

            if (displayValue !== undefined && displayValue !== null) {
              switch (fieldType) {
                case "radiobutton":
                case "radiobuttoninline":
                  displayValue = getChoiceName(displayValue);
                  break;

                case "checkbox":
                case "dropdown":
                  if (Array.isArray(displayValue)) {
                    displayValue = displayValue.map(getChoiceName).join(", ");
                  } else {
                    if (field.choices.length > 0) {
                      displayValue = getChoiceName(displayValue);
                    } else {
                      displayValue = displayValue === true ? "Kyllä" : "Ei";
                    }
                  }

                  break;

                case "uploadfiles":
                  // TODO: can this be cast in a cleaner way?
                  const files: Array<UploadedFileMeta> = displayValue as any;
                  displayValue =
                    files.length > 0 ? (
                      <ul>
                        {files.map((file) => (
                          <li key={file.id}>
                            <FileDownloadLink
                              fileUrl={getApplicationAttachmentDownloadLink(
                                file.id,
                              )}
                              label={file.name}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : null;
                  break;

                case "hidden":
                  break;
              }
            }

            return (
              <Column small={12} medium={6} large={3} key={field.identifier}>
                <FormTextTitle>{field.label}</FormTextTitle>
                <FormText className="PlotApplication__field-value">
                  {displayValue || "-"}
                </FormText>
              </Column>
            );
          })}
      </Row>
      {section.subsections
        .filter((section) => section.visible)
        .map((subsection) => (
          <AreaSearchApplicationAnswersSection
            section={subsection}
            answerSection={answerSection.sections[subsection.identifier]}
            key={subsection.identifier}
            fieldTypes={fieldTypes}
            sectionExtraComponent={SectionExtraComponent}
            sectionTitleTransformers={sectionTitleTransformers}
            handleShowContactModal={handleShowContactModal}
          />
        ))}
      {SectionExtraComponent ? (
        <SectionExtraComponent
          section={section}
          identifier={identifier}
          answerSection={answerSection}
          topLevel={topLevel}
        />
      ) : null}
    </>
  );
};

export default AreaSearchApplicationAnswersField;
