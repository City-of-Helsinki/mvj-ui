// @flow
import React from 'react';

import {getLabelOfOption, getReferenceNumberLink} from '../../util/helpers';
import FormText from '$components/form/FormText';

type Props = {
  decision: ?Object,
  decisionOptions: Array<Object>,
}

const DecisionLink = ({decision, decisionOptions}: Props) => decision
  ? <FormText>{decision.reference_number
    ? <a className='no-margin' href={getReferenceNumberLink(decision.reference_number)} target='_blank'>
      {getLabelOfOption(decisionOptions, decision.id)}
    </a>
    : getLabelOfOption(decisionOptions, decision.id)
  }</FormText>
  : <FormText>-</FormText>;

export default DecisionLink;
