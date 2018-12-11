// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  conditions: Array<Object>,
  decisionId: number,
  largeScreen: boolean,
  receiveCollapseStates: Function,
}

const DecisionConditions = ({
  attributes,
  collapseState,
  conditions,
  decisionId,
  largeScreen,
  receiveCollapseStates,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.DECISIONS]: {
          [decisionId]: {
            conditions: val,
          },
        },
      },
    });
  };
  const typeOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.conditions.child.children.type');

  return (
    <Collapse
      className='collapse__secondary'
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle={<h4 className='collapse__header-title'>Ehdot</h4>}
      onToggle={handleCollapseToggle}
    >
      <BoxItemContainer>
        {!conditions.length && <p>Ei ehtoja</p>}
        {!!conditions.length &&
          <div>
            {largeScreen &&
              <Row>
                <Column large={2}>
                  <FormTextTitle title='Ehtotyyppi' />
                </Column>
                <Column large={2}>
                  <FormTextTitle title='Valvontapvm' />
                </Column>
                <Column large={2}>
                  <FormTextTitle title='Valvottu pvm' />
                </Column>
                <Column large={6}>
                  <FormTextTitle title='Huomautus' />
                </Column>
              </Row>
            }
            {conditions.map((condition, index) => {
              if(largeScreen) {
                return(
                  <Row key={index}>
                    <Column large={2}>
                      <FormText>{getLabelOfOption(typeOptions, condition.type) || '–'}</FormText>
                    </Column>
                    <Column large={2}>
                      <FormText className={(condition.supervision_date && !condition.supervised_date) ? 'alert' : ''}>
                        {condition.supervision_date
                          ? <span><i/>{formatDate(condition.supervision_date)}</span>
                          : '–'
                        }
                      </FormText>
                    </Column>
                    <Column large={2}>
                      <FormText className={condition.supervised_date ? 'success' : ''}>
                        {condition.supervised_date
                          ? <span><i/>{formatDate(condition.supervised_date)}</span>
                          : '–'
                        }
                      </FormText>
                    </Column>
                    <Column large={6}>
                      <FormText>{condition.description || '–'}</FormText>
                    </Column>
                  </Row>
                );
              } else {
                return(
                  <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                    <Row>
                      <Column small={6} medium={4}>
                        <FormTitleAndText
                          title='Ehtotyyppi'
                          text={getLabelOfOption(typeOptions, condition.type) || '–'}
                        />
                      </Column>
                      <Column small={6} medium={4}>
                        <FormTitleAndText
                          title='Valvontapvm'
                          text={condition.supervision_date
                            ? <span><i/>{formatDate(condition.supervision_date)}</span>
                            : '–'
                          }
                          textClassName={(condition.supervision_date && !condition.supervised_date) ? 'alert' : ''}
                        />
                      </Column>
                      <Column small={6} medium={4}>
                        <FormTitleAndText
                          title='Valvottu pvm'
                          text={condition.supervised_date
                            ? <span><i/>{formatDate(condition.supervised_date)}</span>
                            : '–'
                          }
                          textClassName={condition.supervised_date ? 'success' : ''}
                        />
                      </Column>
                      <Column small={12} medium={12}>
                        <FormTitleAndText
                          title='Huomautus'
                          text={condition.description || '–'}
                        />
                      </Column>
                    </Row>
                  </BoxItem>
                );
              }
            })}
          </div>
        }
      </BoxItemContainer>
    </Collapse>
  );
};

export default flowRight(
  withWindowResize,
  connect(
    (state, props) => {
      const decisionId = props.decisionId;

      return {
        collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.DECISIONS}.${decisionId}.conditions`),
      };
    },
    {
      receiveCollapseStates,
    }
  ),
)(DecisionConditions);
