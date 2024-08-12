import React, { Component, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, getFormValues, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "app/AppContext";
import AddButton from "components/form/AddButton";
import DecisionItemEdit from "./DecisionItemEdit";
import { receiveFormValidFlags } from "landUseContract/actions";
import { ConfirmationModalTexts, FormNames } from "enums";
import { ButtonColors } from "components/enums";
import { getContentDecisions } from "landUseContract/helpers";
import { getAttributes, getCurrentLandUseContract, getErrorsByFormName, getIsSaveClicked } from "landUseContract/selectors";
import type { Attributes } from "types";
import type { LandUseContract } from "landUseContract/types";
type DecisionsProps = {
  attributes: Attributes;
  decisionsData: Array<Record<string, any>>;
  errors: Record<string, any> | null | undefined;
  fields: any;
  formValues: Record<string, any>;
  isSaveClicked: boolean;
};

const renderDecisions = ({
  attributes,
  decisionsData,
  errors,
  fields,
  isSaveClicked
}: DecisionsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <div>
            {fields && !!fields.length && fields.map((decision, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_DECISION.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_DECISION.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_DECISION.TITLE
            });
          };

          return <DecisionItemEdit key={index} attributes={attributes} decisionsData={decisionsData} errors={errors} field={decision} index={index} isSaveClicked={isSaveClicked} onRemove={handleRemove} />;
        })}
            <Row>
              <Column>
                <AddButton label='Lisää päätös' onClick={handleAdd} />
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
  formValues: Record<string, any>;
  receiveFormValidFlags: (...args: Array<any>) => any;
  isSaveClicked: boolean;
  valid: boolean;
};
type State = {
  currentLandUseContract: LandUseContract | null | undefined;
  decisionsData: Array<Record<string, any>>;
};

class DecisionsEdit extends Component<Props, State> {
  state = {
    currentLandUseContract: null,
    decisionsData: []
  };

  componentDidUpdate(prevProps) {
    const {
      receiveFormValidFlags
    } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LAND_USE_CONTRACT_DECISIONS]: this.props.valid
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentLandUseContract !== state.currentLandUseContract) {
      const decisions = getContentDecisions(props.currentLandUseContract);
      return {
        currentLandUseContract: props.currentLandUseContract,
        decisionsData: decisions
      };
    }

    return null;
  }

  render() {
    const {
      attributes,
      errors,
      formValues,
      isSaveClicked
    } = this.props,
          {
      decisionsData
    } = this.state;
    return <form>
        <FieldArray attributes={attributes} component={renderDecisions} decisionsData={decisionsData} errors={errors} formValues={formValues} isSaveClicked={isSaveClicked} name="decisions" />
      </form>;
  }

}

const formName = FormNames.LAND_USE_CONTRACT_DECISIONS;
export default flowRight(connect(state => {
  return {
    attributes: getAttributes(state),
    currentLandUseContract: getCurrentLandUseContract(state),
    errors: getErrorsByFormName(state, formName),
    formValues: getFormValues(formName)(state),
    isSaveClicked: getIsSaveClicked(state)
  };
}, {
  receiveFormValidFlags
}), reduxForm({
  form: formName,
  destroyOnUnmount: false
}))(DecisionsEdit) as React.ComponentType<any>;