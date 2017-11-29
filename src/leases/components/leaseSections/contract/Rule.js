// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import * as helpers from '../../../helpers';
import classNames from 'classnames';
import Collapse from '../../../../components/Collapse';

type Props = {
  rule: Object,
}

const Rule = ({rule}: Props) => {

  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Päätöksen tiedot</span></Column>
          </Row>
        }
      >
        <div className='section-item'>
          <Row>
            <Column medium={4}>
              <label>Päätöspäivämäärä</label>
              <p>{rule.rule_number ? get(rule, 'rule_date', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Päättäjä</label>
              <p>{rule.rule_maker ? get(rule, 'rule_maker', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Pykälä</label>
              <p>{rule.rule_clause ? get(rule, 'rule_clause', '–') : '–'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={8}>
              <label>Selite</label>
              <p>{rule.rule_description ? get(rule, 'rule_description', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Päätöksen tyyppi</label>
              <p>{rule.rule_type ? get(rule, 'rule_type', '–') : '–'}</p>
            </Column>
          </Row>
        </div>
      </Collapse>

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
              <label>Käyttötarkoitusehto</label>
              <p>{term.term_purpose ? get(term, 'term_purpose', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Valvonta päivämäärä</label>
              {term.supervision_date ? <p className={classNames({'alert': term.supervision_date && !term.supervised_date})}><i/>{helpers.formatDate(get(term, 'supervision_date', '–'))} </p> : <p>–</p>}
            </Column>
            <Column medium={4}>
              <label>Valvottu päivämäärä</label>
              {term.supervised_date ? <p className={classNames({'success': term.supervised_date})}><i/>{term.supervised_date ? helpers.formatDate(get(term, 'supervised_date', '–')) : '–'}</p> : <p>–</p>}
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <label>Selite</label>
              <p>{term.term_description ? get(term, 'term_description', '–') : '–'}</p>
            </Column>
          </Row>
        </div>)}
      </Collapse>}
    </div>
  );
};

export default Rule;
