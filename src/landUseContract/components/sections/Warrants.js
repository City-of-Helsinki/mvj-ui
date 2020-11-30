// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import FormTextTitle from '$components/form/FormTextTitle';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {FormNames, ViewModes} from '$src/enums';
import {formatDate, formatNumber, isEmptyValue, getFieldOptions, getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  collaterals: Array<Object>,
  contractId: number,
  largeScreen: boolean,
  receiveCollapseStates: Function,
}

const Warrants = ({
  attributes,
  collapseState,
  collaterals,
  contractId,
  receiveCollapseStates,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_DECISIONS]: {
          [contractId]: {
            warrants: val,
          },
        },
      },
    });
  };
  const typeOptions = getFieldOptions(attributes, 'contracts.child.children.collaterals.child.children.type');

  return (
    <Collapse
      className='collapse__secondary'
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle='Ehdot'
      onToggle={handleCollapseToggle}
    >
      <BoxItemContainer>
        {collaterals.map((collateral, index) => {
          return(
            <Row key={index}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Vakuuden tyyppi' />
                <FormText>{getLabelOfOption(typeOptions, collateral.type) || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Vakuuden laji' />
                <FormText>{collateral.other_type || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Vuokravakuusnro' />
                <FormText>{collateral.number || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Vakuuden alkupvm' />
                <FormText>{formatDate(collateral.start_date) || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Vakuuden loppupvm' />
                <FormText>{formatDate(collateral.end_date) || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Vakuuden määrä' />
                <FormText>{!isEmptyValue(collateral.total_amount) ? `${formatNumber(collateral.total_amount)} €` : '-'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Palautettu pvm' />
                <FormText>{formatDate(collateral.return_date) || '–'}</FormText>
              </Column>
              <Column small={6} medium={8} large={10}>
                <FormTextTitle title='Huomautus' />
                <FormText>{collateral.note || '–'}</FormText>
              </Column>
            </Row>
          );
        })}
      </BoxItemContainer>
    </Collapse>
  );
};

export default flowRight(
  withWindowResize,
  connect(
    (state, props) => {
      const id = props.contractId;

      return {
        collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_CONTRACTS}.${id}.warrants`),
      };
    },
    {
      receiveCollapseStates,
    }
  ),
)(Warrants);
