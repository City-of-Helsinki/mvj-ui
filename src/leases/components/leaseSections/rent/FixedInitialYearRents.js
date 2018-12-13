// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  isEmptyValue,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  fixedInitialYearRents: Array<Object>,
  largeScreen: boolean,
}

type State = {
  attributes: Attributes,
  intendedUseOptions: Array<Object>,
}

class FixedInitialYearRentsEdit extends PureComponent<Props, State> {
  state = {
    attributes: {},
    intendedUseOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if(props.attributes !== state.attributes) {
      return {
        attributes: props.attributes,
        intendedUseOptions: getAttributeFieldOptions(props.attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use'),
      };
    }

    return null;
  }

  render() {
    const {fixedInitialYearRents, largeScreen} = this.props;
    const {intendedUseOptions} = this.state;

    return(
      <div>
        <BoxItemContainer>
          {(!fixedInitialYearRents || !fixedInitialYearRents.length) && <FormText>Ei kiinteitä alkuvuosivuokria</FormText>}

          {fixedInitialYearRents && !!fixedInitialYearRents.length && largeScreen &&
            <Row>
              <Column large={2}>
                <FormTextTitle title='Käyttötarkoitus' />
              </Column>
              <Column large={2}>
                <FormTextTitle title='Kiinteä alkuvuosivuokra' />
              </Column>
              <Column large={1}>
                <FormTextTitle title='Alkupvm' />
              </Column>
              <Column large={1}>
                <FormTextTitle title='Loppupvm' />
              </Column>
            </Row>
          }
          {fixedInitialYearRents && !!fixedInitialYearRents.length && fixedInitialYearRents.map((rent, index) => {
            if(largeScreen) {
              return (
                <Row key={index}>
                  <Column small={3} medium={3} large={2}>
                    <FormText>{getLabelOfOption(intendedUseOptions, rent.intended_use) || '-'}</FormText>
                  </Column>
                  <Column small={3} medium={3} large={2}>
                    <FormText>{!isEmptyValue(rent.amount) ? `${formatNumber(rent.amount)} €` : '-'}</FormText>
                  </Column>
                  <Column small={3} medium={3} large={1}>
                    <FormText>{formatDate(rent.start_date) || '-'}</FormText>
                  </Column>
                  <Column  small={3} medium={3} large={1}>
                    <FormText>{formatDate(rent.end_date) || '-'}</FormText>
                  </Column>
                </Row>
              );
            } else {
              return (
                <BoxItem className='no-border-on-first-child no-border-on-last-child' key={index}>
                  <BoxContentWrapper>
                    <Row>
                      <Column small={6} medium={3} large={2}>
                        <FormTitleAndText
                          title='Käyttötarkoitus'
                          text={getLabelOfOption(intendedUseOptions, rent.intended_use) || '-'}
                        />
                      </Column>
                      <Column small={6} medium={3} large={2}>
                        <FormTitleAndText
                          title='Kiinteä alkuvuosivuokra'
                          text={!isEmptyValue(rent.amount) ? `${formatNumber(rent.amount)} €` : '-'}
                        />
                      </Column>
                      <Column small={6} medium={3} large={1}>
                        <FormTitleAndText
                          title='Alkupvm'
                          text={formatDate(rent.start_date) || '-'}
                        />
                      </Column>
                      <Column  small={6} medium={3} large={1}>
                        <FormTitleAndText
                          title='Loppupvm'
                          text={formatDate(rent.end_date) || '-'}
                        />
                      </Column>
                    </Row>
                  </BoxContentWrapper>
                </BoxItem>
              );
            }
          })}
        </BoxItemContainer>
      </div>
    );
  }
}

export default flowRight(
  withWindowResize,
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
      };
    },
  )
)(FixedInitialYearRentsEdit);
