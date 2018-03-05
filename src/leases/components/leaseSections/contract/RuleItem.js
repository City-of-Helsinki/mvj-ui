// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import {formatDate} from '../../../../util/helpers';
import Collapse from '../../../../components/collapse/Collapse';
import GreenBox from '../../../../components/content/GreenBox';
import GreenBoxItem from '../../../../components/content/GreenBoxItem';

type Props = {
  rule: Object,
}

const Rule = ({rule}: Props) => {

  return (
    <div>
      <GreenBox>
        <Row>
          <Column medium={12}>
            <label>Selite</label>
            <p className='no-margin'>{rule.rule_description || '–'}</p>
          </Column>
        </Row>
      </GreenBox>

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
          <GreenBoxItem key={index}>
            <Row>
              <Column medium={4}>
                <label>Ehtotyyppi</label>
                <p>{term.term_purpose || '–'}</p>
              </Column>
              <Column medium={4}>
                <label>Valvonta päivämäärä</label>
                {term.supervision_date
                  ? <p className={classNames({'alert': term.supervision_date && !term.supervised_date})}><i/>{formatDate(term.supervision_date)} </p>
                  : <p>–</p>
                }
              </Column>
              <Column medium={4}>
                <label>Valvottu päivämäärä</label>
                {term.supervised_date
                  ? <p className={classNames({'success': term.supervised_date})}><i/>{formatDate(term.supervised_date)}</p>
                  : <p>–</p>
                }
              </Column>
            </Row>
            <Row>
              <Column medium={12}>
                <label>Selite</label>
                <p className='no-margin'>{term.term_description || '–'}</p>
              </Column>
            </Row>
          </GreenBoxItem>
        )}
      </Collapse>}
    </div>
  );
};

export default Rule;
