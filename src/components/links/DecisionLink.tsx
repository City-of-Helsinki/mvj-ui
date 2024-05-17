import React from "react";
import { getLabelOfOption, getReferenceNumberLink } from "../../util/helpers";
import FormText from "src/components/form/FormText";
type Props = {
  decision: Record<string, any> | null | undefined;
  decisionOptions: Array<Record<string, any>>;
};

const DecisionLink = ({
  decision,
  decisionOptions
}: Props) => decision ? <FormText>{decision.reference_number ? <a className='no-margin' href={getReferenceNumberLink(decision.reference_number)} target='_blank' rel="noopener noreferrer">
      {getLabelOfOption(decisionOptions, decision.id)}
    </a> : getLabelOfOption(decisionOptions, decision.id)}</FormText> : <FormText>-</FormText>;

export default DecisionLink;