// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import * as helpers from '../../../../util/helpers';
import classNames from 'classnames';
import Collapse from '../../../../components/collapse/Collapse';

type Props = {
  rule: Object,
}

const Rule = ({rule}: Props) => {

  return (
    <div>
      <div className='green-box'>
        <div className='section-item'>
          <Row>
            <Column medium={12}>
              <label>Selite</label>
              <p>{rule.rule_description ? get(rule, 'rule_description', '–') : '–'}</p>
            </Column>
          </Row>
        </div>
      </div>

      {rule.terms &&
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Ehdot</span></Column>
          </Row>
        }
      >
        {rule.terms && rule.terms.map((term, index) =>
          <div className='section-item' key={index}>
            <Row>
              <Column medium={4}>
                <label>Ehtotyyppi</label>
                <p>{term.term_purpose ? get(term, 'term_purpose', '–') : '–'}</p>
              </Column>
              <Column medium={4}>
                <label>Valvonta päivämäärä</label>
                {term.supervision_date ? <p className={classNames({'alert': term.supervision_date && !term.supervised_date})}><i/>{helpers.formatDate(term.supervision_date)} </p> : <p>–</p>}
              </Column>
              <Column medium={4}>
                <label>Valvottu päivämäärä</label>
                {term.supervised_date ? <p className={classNames({'success': term.supervised_date})}><i/>{helpers.formatDate(term.supervised_date)}</p> : <p>–</p>}
              </Column>
            </Row>
            <Row>
              <Column medium={12}>
                <label>Selite</label>
                <p>{term.term_description ? get(term, 'term_description', '–') : '–'}</p>
              </Column>
            </Row>
          </div>)
        }
      </Collapse>}
    </div>
  );
};

export default Rule;
