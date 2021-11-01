// @flow
import React, {Fragment, Component, type Element} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {ButtonColors} from '$components/enums';
import FormTextTitle from '$components/form/FormTextTitle';
import AddButtonThird from '$components/form/AddButtonThird';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/landUseContract/actions';
import {FormNames, ViewModes} from '$src/enums';
import {getAttributes, getCollapseStateByKey, getIsSaveClicked} from '$src/landUseContract/selectors';
import type {Attributes} from '$src/types';
import ConditionItemEdit from './ConditionItemEdit';

type ConditionsProps = {
  fields: any,
  formName: string,
  attributes: Object,
  isSaveClicked: boolean,
}

const renderConditions = ({
  fields,
  formName,
  attributes,
  isSaveClicked,
}: ConditionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {fields && !!fields.length &&
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle>
                    {'Hallintamuoto'}
                  </FormTextTitle>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle>
                    {'Velvoite k-m2'}
                  </FormTextTitle>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle>
                    {'Toteutunut k-m2'}
                  </FormTextTitle>
                </Column>
                <Column small={3} medium={2} large={1}>
                  <FormTextTitle>
                    {'Subventio'}
                  </FormTextTitle>
                </Column>
                <Column small={3} medium={2} large={1}>
                  <FormTextTitle>
                    {'Korvaus %'}
                  </FormTextTitle>
                </Column>
                <Column small={3} medium={2} large={2}>
                  <FormTextTitle>
                    {'Valvottupäivämäärä'}
                  </FormTextTitle>
                </Column>
                <Column small={3} medium={2} large={1}>
                  <FormTextTitle>
                    {'Valvontapäivämäärä'}
                  </FormTextTitle>
                </Column>
              </Row>
            }
            {fields && !!fields.length && fields.map((condition, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista hallintamuoto', 
                  confirmationModalLabel: 'Poista hallintamuoto',
                  confirmationModalTitle: 'Oletko varma että haluat poistaa hallintamuodon',
                });
              };

              return (
                <ConditionItemEdit
                  key={index}
                  field={condition}
                  index={index}
                  attributes={attributes}
                  isSaveClicked={isSaveClicked}
                  onRemove={handleRemove}
                  formName={formName}
                />
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  className='no-margin'
                  label='Lisää hallintamuoto'
                  onClick={handleAdd}
                />
              </Column>
            </Row> 
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  ConditionsCollapseState: boolean,
  change: Function,
  isSaveClicked: boolean,
  receiveCollapseStates: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class BasicInformationEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  }

  handleBasicInformationCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          conditions: val,
        },
      },
    });
  }

  render() {
    const {
      attributes,
      ConditionsCollapseState,
      isSaveClicked,
    } = this.props;

    return (
      <form>
        <h2>VALVOTTAVAT EHDOT</h2>
        <Divider />
        <Collapse
          defaultOpen={ConditionsCollapseState !== undefined ? ConditionsCollapseState : true}
          headerTitle='Asuntojen rahoitus ja hallintamuodot'
          onToggle={this.handleBasicInformationCollapseToggle}
        >
          <FieldArray
            attributes={attributes}
            component={renderConditions}
            isSaveClicked={isSaveClicked}
            name='conditions'
            formName={FormNames.LAND_USE_CONTRACT_CONDITIONS}
          />
        </Collapse>
      </form>
    );
  }
}

const formName = FormNames.LAND_USE_CONTRACT_CONDITIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        ConditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.conditions`),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveCollapseStates,
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(BasicInformationEdit);
