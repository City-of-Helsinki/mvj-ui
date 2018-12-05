// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import throttle from 'lodash/throttle';
import get from 'lodash/get';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {ButtonColors} from '$components/enums';
import {Breakpoints} from '$src/foundation/enums';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';
import {isLargeScreen} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

type State = {
  largeScreen: boolean,
}

class FixedInitialYearRentsEdit extends PureComponent<Props, State> {
  state = {
    largeScreen: isLargeScreen(),
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleAdd = () => {
    const {fields} = this.props;

    fields.push({});
  };

  handleResize = throttle(() => {
    this.setState({largeScreen: isLargeScreen()});
  }, 100);

  render() {
    const {attributes, fields, isSaveClicked} = this.props;
    const {largeScreen} = this.state;

    return(
      <AppConsumer>
        {({dispatch}) => {
          return(
            <div>
              <BoxItemContainer>
                {fields && !!fields.length &&
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
                {fields && !!fields.length && fields.map((rent, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.FIXED_INITIAL_YEAR_RENT,
                      confirmationModalTitle: DeleteModalTitles.FIXED_INITIAL_YEAR_RENT,
                    });
                  };

                  if(largeScreen) {
                    return (
                      <Row key={index}>
                        <Column small={3} medium={3} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use')}
                            invisibleLabel={largeScreen}
                            name={`${rent}.intended_use`}
                            overrideValues={{label: 'Käyttötarkoitus'}}
                          />
                        </Column>
                        <Column small={3} medium={3} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.amount')}
                            invisibleLabel={largeScreen}
                            name={`${rent}.amount`}
                            unit='€'
                            overrideValues={{label: 'Kiinteä alkuvuosivuokra'}}
                          />
                        </Column>
                        <Column small={3} medium={3} large={1}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.start_date')}
                            invisibleLabel={largeScreen}
                            name={`${rent}.start_date`}
                            overrideValues={{label: 'Alkupvm'}}
                          />
                        </Column>
                        <Column  small={3} medium={3} large={1}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.end_date')}
                            invisibleLabel={largeScreen}
                            name={`${rent}.end_date`}
                            overrideValues={{label: 'Loppupvm'}}
                          />
                        </Column>

                        {/* Remove button for large screens */}
                        <Column>
                          <RemoveButton
                            className='third-level'
                            onClick={handleRemove}
                            title="Poista alennus/korotus"
                          />
                        </Column>
                      </Row>
                    );
                  } else {
                    return (
                      <BoxItem className='no-border-on-first-child' key={index}>
                        <BoxContentWrapper>
                          <RemoveButton
                            className='position-topright'
                            hideFor={Breakpoints.LARGE}
                            onClick={handleRemove}
                            title="Poista kiinteä alkuvuosivuokra"
                          />

                          <Row>
                            <Column small={3} medium={3} large={2}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use')}
                                invisibleLabel={largeScreen}
                                name={`${rent}.intended_use`}
                                overrideValues={{label: 'Käyttötarkoitus'}}
                              />
                            </Column>
                            <Column small={3} medium={3} large={2}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.amount')}
                                invisibleLabel={largeScreen}
                                name={`${rent}.amount`}
                                unit='€'
                                overrideValues={{label: 'Kiinteä alkuvuosivuokra'}}
                              />
                            </Column>
                            <Column small={3} medium={3} large={1}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.start_date')}
                                invisibleLabel={largeScreen}
                                name={`${rent}.start_date`}
                                overrideValues={{label: 'Alkupvm'}}
                              />
                            </Column>

                            <Column  small={3} medium={3} large={1}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.end_date')}
                                invisibleLabel={largeScreen}
                                name={`${rent}.end_date`}
                                overrideValues={{label: 'Loppupvm'}}
                              />
                            </Column>
                          </Row>
                        </BoxContentWrapper>
                      </BoxItem>
                    );
                  }
                })}
              </BoxItemContainer>
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                    label='Lisää kiinteä alkuvuosivuokra'
                    onClick={this.handleAdd}
                  />
                </Column>
              </Row>
            </div>
          );
        }}
      </AppConsumer>
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
