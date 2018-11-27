// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import throttle from 'lodash/throttle';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {Breakpoints} from '$src/foundation/enums';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isLargeScreen,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fixedInitialYearRents: Array<Object>,
}

type State = {
  attributes: Attributes,
  intendedUseOptions: Array<Object>,
  largeScreen: boolean,
}

class FixedInitialYearRentsEdit extends PureComponent<Props, State> {
  state = {
    attributes: {},
    intendedUseOptions: [],
    largeScreen: isLargeScreen(),
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
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

  handleResize = throttle(() => {
    this.setState({largeScreen: isLargeScreen()});
  }, 100);

  render() {
    const {fixedInitialYearRents} = this.props;
    const {intendedUseOptions, largeScreen} = this.state;

    return(
      <div>
        <BoxItemContainer>
          {(!fixedInitialYearRents || !fixedInitialYearRents.length) && <FormText>Ei kiinteitä alkuvuosivuokria</FormText>}

          {fixedInitialYearRents && !!fixedInitialYearRents.length &&
            <Row showFor={Breakpoints.LARGE}>
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
                <BoxItem className='no-border-on-last-child' key={index}>
                  <BoxContentWrapper>
                    <Row>
                      <Column small={3} medium={3} large={2}>
                        <FormTitleAndText
                          title='Käyttötarkoitus'
                          text={getLabelOfOption(intendedUseOptions, rent.intended_use) || '-'}
                        />
                      </Column>
                      <Column small={3} medium={3} large={2}>
                        <FormTitleAndText
                          title='Kiinteä alkuvuosivuokra'
                          text={!isEmptyValue(rent.amount) ? `${formatNumber(rent.amount)} €` : '-'}
                        />
                      </Column>
                      <Column small={3} medium={3} large={1}>
                        <FormTitleAndText
                          title='Alkupvm'
                          text={formatDate(rent.start_date) || '-'}
                        />
                      </Column>
                      <Column  small={3} medium={3} large={1}>
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

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(FixedInitialYearRentsEdit);
