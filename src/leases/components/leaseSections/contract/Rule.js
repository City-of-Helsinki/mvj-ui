// @flow
import React from 'react';
// import get from 'lodash/get';
// import {Row, Column} from 'react-foundation';
//
// import Collapse from '../../../../components/Collapse';

type Props = {
  rule: Object,
}

const Rule = ({rule}: Props) => {

  return (
    <div>
      {rule.rule.maker}
    </div>
  );
};

export default Rule;
