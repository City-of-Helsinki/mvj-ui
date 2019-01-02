// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Authorization from '$components/authorization/Authorization';
import AddButton from '$components/form/AddButton';
import ContractItemEdit from './ContractItemEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames, LeaseContractsFieldPaths} from '$src/leases/enums';
import {validateContractForm} from '$src/leases/formValidators';
import {getContentContracts} from '$src/leases/helpers';
import {getDecisionOptions} from '$src/decision/helpers';
import {isFieldAllowedToEdit} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type ContractsProps = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
  fields: any,
  savedContracts: Array<Object>,
}

const renderContracts = ({
  attributes,
  decisionOptions,
  fields,
  savedContracts,
}: ContractsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {fields && !!fields.length && fields.map((contract, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.CONTRACT,
                  confirmationModalTitle: DeleteModalTitles.CONTRACT,
                });
              };

              return <ContractItemEdit
                key={index}
                attributes={attributes}
                decisionOptions={decisionOptions}
                field={contract}
                index={index}
                onRemove={handleRemove}
                savedContracts={savedContracts}
              />;
            })}

            <Authorization allow={isFieldAllowedToEdit(attributes, LeaseContractsFieldPaths.CONTRACTS)}>
              <Row>
                <Column>
                  <AddButton
                    label='Lisää sopimus'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  decisions: Array<Object>,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  currentLease: ?Lease,
  decisionOptions: Array<Object>,
  savedContracts: Array<Object>,
}

class ContractsEdit extends Component<Props, State> {
  state = {
    currentLease: null,
    decisionOptions: [],
    savedContracts: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease,
      newState.savedContracts = getContentContracts(props.currentLease);
    }

    if(props.decisions !== state.decisions) {
      newState.decisionOptions = getDecisionOptions(props.decisions);
      newState.decisions = props.decisions;
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONTRACTS]: this.props.valid,
      });
    }
  }

  render() {
    const {attributes} = this.props;
    const {decisionOptions, savedContracts} = this.state;

    return (
      <form>
        <FieldArray
          attributes={attributes}
          component={renderContracts}
          decisionOptions={decisionOptions}
          name="contracts"
          savedContracts={savedContracts}
        />
      </form>
    );
  }
}

const formName = FormNames.CONTRACTS;

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        decisions: getDecisionsByLease(state, currentLease.id),
      };
    },
    {
      receiveFormValidFlags,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateContractForm,
  }),
)(ContractsEdit);
