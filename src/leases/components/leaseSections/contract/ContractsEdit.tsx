import React, { Fragment, PureComponent, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButton from "@/components/form/AddButton";
import Authorization from "@/components/authorization/Authorization";
import ContractFileModal from "./ContractFileModal";
import ContractItemEdit from "./ContractItemEdit";
import FormText from "@/components/form/FormText";
import { receiveFormValidFlags } from "@/leases/actions";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { validateContractForm } from "@/leases/formValidators";
import { getContentContracts, getDecisionOptions } from "@/leases/helpers";
import { hasPermissions } from "@/util/helpers";
import { getCurrentLease } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type ContractsProps = {
  decisionOptions: Array<Record<string, any>>;
  fields: any;
  onShowContractFileModal: (...args: Array<any>) => any;
  savedContracts: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
  contracts: Array<Record<string, any>>;
};

const renderContracts = ({
  decisionOptions,
  fields,
  onShowContractFileModal,
  savedContracts,
  usersPermissions,
  contracts
}: ContractsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACT) && (!fields || !fields.length) && <FormText className='no-margin'>Ei sopimuksia</FormText>}

            {fields && !!fields.length && fields.map((contract, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_CONTRACT.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_CONTRACT.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_CONTRACT.TITLE
            });
          };

          return <ContractItemEdit key={index} decisionOptions={decisionOptions} field={contract} index={index} onRemove={handleRemove} onShowContractFileModal={onShowContractFileModal} savedContracts={savedContracts} contract={contracts[index]} />;
        })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACT)}>
              <Row>
                <Column>
                  <AddButton label='Lisää sopimus' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type Props = {
  attributes: Attributes;
  currentLease: Lease;
  receiveFormValidFlags: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
};
type State = {
  contractId: number;
  currentLease: Lease;
  decisionOptions: Array<Record<string, any>>;
  savedContracts: Array<Record<string, any>>;
  showContractModal: boolean;
};

class ContractsEdit extends PureComponent<Props, State> {
  state = {
    contractId: -1,
    currentLease: {},
    decisionOptions: [],
    savedContracts: [],
    showContractModal: false
  };

  static getDerivedStateFromProps(props, state) {
    const newState: any = {};

    if (props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease, newState.decisionOptions = getDecisionOptions(props.currentLease);
      newState.savedContracts = getContentContracts(props.currentLease);
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {
      receiveFormValidFlags
    } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid
      });
    }
  }

  handleShowContractFileModal = (contractId: number) => {
    this.setState({
      contractId,
      showContractModal: true
    });
  };
  handleCloseContractFileModal = () => {
    this.setState({
      contractId: -1,
      showContractModal: false
    });
  };

  render() {
    const {
      usersPermissions,
      currentLease
    } = this.props;
    const {
      contractId,
      decisionOptions,
      savedContracts,
      showContractModal
    } = this.state;
    return <form>
        <ContractFileModal contractId={contractId} onClose={this.handleCloseContractFileModal} open={showContractModal} />

        <FieldArray component={renderContracts} decisionOptions={decisionOptions} name="contracts" onShowContractFileModal={this.handleShowContractFileModal} savedContracts={savedContracts} usersPermissions={usersPermissions} contracts={currentLease.contracts} />
      </form>;
  }

}

const formName = FormNames.LEASE_CONTRACTS;
export default flowRight(connect(state => {
  return {
    currentLease: getCurrentLease(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  receiveFormValidFlags
}), reduxForm({
  form: formName,
  destroyOnUnmount: false,
  validate: validateContractForm
}))(ContractsEdit) as React.ComponentType<any>;