import React, { Component, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "app/AppContext";
import AddButton from "components/form/AddButton";
import ContractItemEdit from "./ContractItemEdit";
import { receiveFormValidFlags } from "landUseContract/actions";
import { ConfirmationModalTexts, FormNames } from "enums";
import { ButtonColors } from "components/enums";
import { getContentContracts } from "landUseContract/helpers";
import { getFieldOptions } from "util/helpers";
import { getAttributes, getCurrentLandUseContract, getErrorsByFormName, getIsSaveClicked } from "landUseContract/selectors";
import { getDecisionOptions } from "landUseContract/helpers";
import type { Attributes } from "types";
import type { LandUseContract } from "landUseContract/types";
type ContractsProps = {
  attributes: Attributes;
  contractsData: Array<Record<string, any>>;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
  currentLandUseContract: LandUseContract;
  decisionOptions: Array<Record<string, any>>;
};

const renderContracts = ({
  attributes,
  contractsData,
  errors,
  fields,
  isSaveClicked,
  currentLandUseContract,
  decisionOptions
}: ContractsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  const contractTypeOptions = getFieldOptions(attributes, 'contracts.child.children.type');
  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <div>
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

          return <ContractItemEdit key={index} attributes={attributes} contractsData={contractsData} errors={errors} field={contract} index={index} isSaveClicked={isSaveClicked} onRemove={handleRemove} contractTypeOptions={contractTypeOptions} currentLandUseContract={currentLandUseContract} decisionOptions={decisionOptions} />;
        })}
            <Row>
              <Column>
                <AddButton label='Lisää sopimus' onClick={handleAdd} />
              </Column>
            </Row>
          </div>;
    }}
    </AppConsumer>;
};

type Props = {
  attributes: Attributes;
  currentLandUseContract: LandUseContract;
  errors: Record<string, any> | null | undefined;
  receiveFormValidFlags: (...args: Array<any>) => any;
  isSaveClicked: boolean;
  valid: boolean;
};
type State = {
  contractsData: Array<Record<string, any>>;
  currentLandUseContract: LandUseContract | null | undefined;
  decisionOptions: Array<Record<string, any>>;
};

class ContractsEdit extends Component<Props, State> {
  state = {
    contractsData: [],
    currentLandUseContract: null,
    decisionOptions: []
  };

  componentDidUpdate(prevProps) {
    const {
      receiveFormValidFlags
    } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LAND_USE_CONTRACT_CONTRACTS]: this.props.valid
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentLandUseContract !== state.currentLandUseContract) {
      return {
        contractsData: getContentContracts(props.currentLandUseContract),
        currentLandUseContract: props.currentLandUseContract,
        decisionOptions: getDecisionOptions(props.currentLandUseContract)
      };
    }

    return null;
  }

  render() {
    const {
      attributes,
      errors,
      isSaveClicked
    } = this.props,
          {
      contractsData,
      decisionOptions
    } = this.state;
    return <form>
        <FieldArray attributes={attributes} contractsData={contractsData} component={renderContracts} errors={errors} isSaveClicked={isSaveClicked} name="contracts" decisionOptions={decisionOptions} />
      </form>;
  }

}

const formName = FormNames.LAND_USE_CONTRACT_CONTRACTS;
export default flowRight(connect(state => {
  return {
    attributes: getAttributes(state),
    currentLandUseContract: getCurrentLandUseContract(state),
    errors: getErrorsByFormName(state, formName),
    isSaveClicked: getIsSaveClicked(state)
  };
}, {
  receiveFormValidFlags
}), reduxForm({
  form: formName,
  destroyOnUnmount: false
}))(ContractsEdit) as React.ComponentType<any>;