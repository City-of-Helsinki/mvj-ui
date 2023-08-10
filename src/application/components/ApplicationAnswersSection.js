// @flow

import React from 'react';

import Collapse from '$components/collapse/Collapse';
import SubTitle from '$components/content/SubTitle';
import ApplicationAnswersField from '$src/application/components/ApplicationAnswersField';

import type {
  FormSection,
  SavedApplicationFormSection,
  SectionExtraComponentProps,
} from '$src/application/types';

type Props = {
  section: FormSection,
  answer: SavedApplicationFormSection | Array<SavedApplicationFormSection>,
  topLevel?: boolean,
  fieldTypes: Array<{ value: string, display_name: string }>,
  sectionExtraComponent?: React$ComponentType<SectionExtraComponentProps>,
  sectionTitleTransformers?: Array<(string, FormSection, SavedApplicationFormSection) => string>,
};

const ApplicationAnswersSection = ({
  section,
  answer,
  topLevel = false,
  fieldTypes,
  sectionExtraComponent,
  sectionTitleTransformers,
}: Props): React$Node => {
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
        const subtitle: string = (sectionTitleTransformers || []).reduce(
          (title, transformer) => transformer(title, section, singleAnswer), `#${i + 1}`);

        return <Collapse className="collapse__secondary" key={i} headerTitle={subtitle} defaultOpen={topLevel}>
          <ApplicationAnswersField
            section={section}
            answer={singleAnswer}
            fieldTypes={fieldTypes}
            topLevel={topLevel}
            identifier={`${section.identifier}[${i}]`}
            sectionExtraComponent={sectionExtraComponent}
            sectionTitleTransformers={sectionTitleTransformers}
          />
        </Collapse>;
      })
      : <ApplicationAnswersField
        section={section}
        answer={answer[0] || answer}
        fieldTypes={fieldTypes}
        topLevel={topLevel}
        identifier={section.identifier}
        sectionExtraComponent={sectionExtraComponent}
        sectionTitleTransformers={sectionTitleTransformers}
      />}
  </Wrapper>;
};

export default ApplicationAnswersSection;
