// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import ContractItemEdit from './ContractItemEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {validateContractForm} from '$src/leases/formValidators';
import {getContentContracts} from '$src/leases/helpers';
import {getDecisionOptions} from '$src/decision/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type ContractsProps = {
  attributes: Attributes,
  contractsData: Array<Object>,
  decisionOptions: Array<Object>,
  fields: any,
}

const renderContracts = ({
  attributes,
  contractsData,
  decisionOptions,
  fields,
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
                contractsData={contractsData}
                decisionOptions={decisionOptions}
                field={contract}
                index={index}
                onRemove={handleRemove}
              />;
            }

            )}
            <Row>
              <Column>
                <AddButton
                  label='Lisää sopimus'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
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
  contractsData: Array<Object>,
  currentLease: ?Lease,
  decisionOptions: Array<Object>,
}

class ContractsEdit extends Component<Props, State> {
  state = {
    currentLease: null,
    contractsData: [],
    decisionOptions: [],
  }

  static getDerivedStateFromProps(props, state) {
    const retObj = {};

    if(props.currentLease !== state.currentLease) {
      retObj.currentLease = props.currentLease,
      retObj.contractsData = getContentContracts(props.currentLease);
    }

    if(props.decisions !== state.decisions) {
      retObj.decisionOptions = getDecisionOptions(props.decisions);
      retObj.decisions = props.decisions;
    }

    if(!isEmpty(retObj)) {
      return retObj;
    }
    return null;
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
    const {
      contractsData,
      decisionOptions,
    } = this.state;

    return (
      <form>
        <FieldArray
          attributes={attributes}
          component={renderContracts}
          contractsData={contractsData}
          decisionOptions={decisionOptions}
          name="contracts"
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
