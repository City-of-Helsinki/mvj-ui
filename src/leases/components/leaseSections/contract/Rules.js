// @flow
import React from 'react';
import get from 'lodash/get';

import Collapse from '../../../../components/Collapse';
import * as helpers from '../../../helpers';
import Rule from './Rule';
import {Row, Column} from 'react-foundation';

type Props = {
  rules: Array<Object>,
}
const Rules = ({rules}: Props) => {

  return (
    <div className='lease-section'>
      {rules && rules.length > 0 && rules.map((rule, index) =>
        <Collapse key={index}
          header={
            <Row>
              <Column small={4}><span className='collapse__header-title'>Päätös {get(rule, 'rule_clause')}</span></Column>
              <Column small={4}><span className='collapse__header-subtitle'>{helpers.formatDate(get(rule, 'rule_date'))}</span></Column>
              <Column small={4}><span className='collapse__header-subtitle'>{get(rule, 'rule_maker')}</span></Column>
            </Row>
          }
        >
          <Rule rule={rule} />
        </Collapse>
      )}
    </div>
  );
};

export default Rules;
