// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getCollapseStateByKey} from '$src/leases/selectors';

type Props = {
  conditionTypeOptions: Array<Object>,
  conditionsCollapseState: boolean,
  decisionCollapseState: boolean,
  decisionMakerOptions: Array<Object>,
  decision: Object,
  receiveCollapseStates: Function,
  typeOptions: Array<Object>,
}

const DecisionItem = ({
  conditionTypeOptions,
  conditionsCollapseState,
  decisionCollapseState,
  decisionMakerOptions,
  decision,
  receiveCollapseStates,
  typeOptions,
}: Props) => {
  const handleDecisionCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.DECISIONS]: {
          [decision.id]: {
            decision: val,
          },
        },
      },
    });
  };

  const handleConditionsCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.DECISIONS]: {
          [decision.id]: {
            conditions: val,
          },
        },
      },
    });
  };

  return (
    <Collapse
      key={decision.id}
      defaultOpen={decisionCollapseState !== undefined ? decisionCollapseState : false}
      header={
        <div>
          <Column>
            <span className='collapse__header-subtitle'>{formatDate(decision.decision_date) || '-'}</span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>{decision.section ? `${decision.section} §` : '-'}</span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>{getLabelOfOption(typeOptions, decision.type) || '-'}</span>
          </Column>
        </div>
      }
      headerTitle={<h3 className='collapse__header-title'>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}</h3>}
      onToggle={handleDecisionCollapseToggle}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päättäjä'
            text={getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päätöspvm'
            text={formatDate(decision.decision_date) || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Pykälä'
            text={decision.section ? `${decision.section} §` : '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päätöksen tyyppi'
            text={getLabelOfOption(typeOptions, decision.type) || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle title='Diaarinumero' />
          {decision.reference_number
            ? <ExternalLink
              href={getReferenceNumberLink(decision.reference_number)}
              text={decision.reference_number}
            />
            : <FormText>-</FormText>
          }
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <FormTitleAndText
            title='Huomautus'
            text={decision.description || '–'}
          />
        </Column>
      </Row>

      <Collapse
        className='collapse__secondary'
        defaultOpen={conditionsCollapseState !== undefined ? conditionsCollapseState : true}
        headerTitle={<h4 className='collapse__header-title'>Ehdot</h4>}
        onToggle={handleConditionsCollapseToggle}
      >
        {!decision.conditions || !decision.conditions.length &&
          <FormText>Ei ehtoja</FormText>
        }
        {decision.conditions && !!decision.conditions.length &&
          <BoxItemContainer>
            {decision.conditions.map((condition, index) =>
              <BoxItem key={index} className='no-border-on-last-child'>
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <FormTitleAndText
                      title='Ehtotyyppi'
                      text={getLabelOfOption(conditionTypeOptions, condition.type) || '–'}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormTitleAndText
                      title='Valvontapvm'
                      text={condition.supervision_date ? <span><i/>{formatDate(condition.supervision_date)}</span> : '-'}
                      textClassName={condition.supervision_date && !condition.supervised_date ? 'alert' : ''}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormTitleAndText
                      title='Valvottu pvm'
                      text={condition.supervised_date ? <span><i/>{formatDate(condition.supervised_date)}</span> : ''}
                      textClassName={condition.supervised_date ? 'success' : ''}
                    />
                  </Column>
                  <Column small={12} medium={12} large={6}>
                    <FormTitleAndText
                      title='Huomautus'
                      text={condition.description || '–'}
                    />
                  </Column>
                </Row>
              </BoxItem>
            )}
          </BoxItemContainer>
        }
      </Collapse>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.decision.id;
    return {
      conditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${id}.conditions`),
      decisionCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${id}.decision`),
    };
  },
  {
    receiveCollapseStates,
  }
)(DecisionItem);
