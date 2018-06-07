// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';

type Props = {
  conditionTypeOptions: Array<Object>,
  decisionMakerOptions: Array<Object>,
  decision: Object,
  typeOptions: Array<Object>,
}

const DecisionItem = ({
  conditionTypeOptions,
  decisionMakerOptions,
  decision,
  typeOptions,
}: Props) =>
  <div>
    <Row>
      <Column small={6} medium={4} large={2}>
        <label>Päättäjä</label>
        <p>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '–'}</p>
      </Column>
      <Column small={6} medium={4} large={2}>
        <label>Päätöspvm</label>
        <p>{formatDate(decision.decision_date) || '–'}</p>
      </Column>
      <Column small={6} medium={4} large={2}>
        <label>Pykälä</label>
        <p>{decision.section || '–'}</p>
      </Column>
      <Column small={6} medium={4} large={2}>
        <label>Päätöksen tyyppi</label>
        <p>{getLabelOfOption(typeOptions, decision.type) || '–'}</p>
      </Column>
      <Column small={6} medium={4} large={2}>
        <label>Diaarinumero</label>
        {decision.reference_number
          ? <a target='_blank' href={getReferenceNumberLink(decision.reference_number)}>{decision.reference_number}</a>
          : <p>-</p>
        }
      </Column>
    </Row>
    <Row>
      <Column small={12}>
        <label>Huomautus</label>
        <p>{decision.description || '–'}</p>
      </Column>
    </Row>

    <Collapse
      className='collapse__secondary'
      defaultOpen={true}
      headerTitle={
        <h4 className='collapse__header-title'>Ehdot</h4>
      }
    >
      {decision.conditions && decision.conditions.length
        ? (
          <BoxItemContainer>
            {decision.conditions.map((condition) =>
              <BoxItem key={condition.id} className='no-border-on-first-child'>
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <label>Ehtotyyppi</label>
                    <p>{getLabelOfOption(conditionTypeOptions, condition.type) || '–'}</p>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <label>Valvontapvm</label>
                    {condition.supervision_date
                      ? (
                        <p className={
                          classNames({'alert': condition.supervision_date && !condition.supervised_date})
                        }>
                          <i/>{formatDate(condition.supervision_date)}
                        </p>
                      ) : <p>–</p>
                    }
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <label>Valvottu pvm</label>
                    {condition.supervised_date
                      ? (
                        <p className={
                          classNames({'success': condition.supervised_date})
                        }>
                          <i/>{formatDate(condition.supervised_date)}
                        </p>
                      ) : <p>–</p>
                    }
                  </Column>
                  <Column small={12} medium={12} large={6}>
                    <label>Huomautus</label>
                    <p>{condition.description || '–'}</p>
                  </Column>
                </Row>
              </BoxItem>
            )}
          </BoxItemContainer>
        ) : (
          <p>Ei ehtoja</p>
        )
      }
    </Collapse>
  </div>;

export default DecisionItem;
