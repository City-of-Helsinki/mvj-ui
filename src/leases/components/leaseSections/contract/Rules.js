// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import {formatDate} from '$util/helpers';
import Collapse from '../../../../components/collapse/Collapse';
import DocIcon from '../../../../components/icons/DocIcon';
import RuleItem from './RuleItem';

type Props = {
  rules: Array<Object>,
}

const Rules = ({rules}: Props) => {
  return (
    <div>
      {rules && rules.length > 0 && rules.map((rule, index) =>
        <Collapse
          key={index}
          defaultOpen={false}
          header={
            <Row>
              <Column small={3}>
                <DocIcon />
                <span className='collapse__header-title'>{get(rule, 'rule_maker')}</span>
              </Column>
              <Column small={3}><span className='collapse__header-subtitle'>{formatDate(get(rule, 'rule_date'))}</span></Column>
              <Column small={3}><span className='collapse__header-subtitle'>{get(rule, 'rule_clause')}</span></Column>
              <Column small={3}><span className='collapse__header-subtitle'>{get(rule, 'rule_type')}</span></Column>
            </Row>
          }
        >
          <RuleItem rule={rule} />
        </Collapse>
      )}
    </div>
  );
};

export default Rules;
