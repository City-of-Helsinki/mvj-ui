import React, { Fragment, PureComponent, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButton from "/src/components/form/AddButton";
import AttachDecisionModal from "./AttachDecisionModal";
import Authorization from "/src/components/authorization/Authorization";
import DecisionItemEdit from "./DecisionItemEdit";
import FormText from "/src/components/form/FormText";
import { copyDecisionToLeases, hideAttachDecisionModal, receiveFormValidFlags, showAttachDecisionModal } from "/src/leases/actions";
import { ConfirmationModalTexts, FormNames } from "enums";
import { ButtonColors } from "/src/components/enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { hasPermissions } from "util/helpers";
import { getCurrentLease, getIsAttachDecisionModalOpen } from "/src/leases/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import type { Lease } from "/src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
type DecisionsProps = {
  fields: any;
  onAttach: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const renderDecisions = ({
  fields,
  onAttach,
  usersPermissions
}: DecisionsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_DECISION) && (!fields || !fields.length) && <FormText className='no-margin'>Ei päätöksiä</FormText>}
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

          return <DecisionItemEdit key={index} index={index} field={decision} onAttach={onAttach} onRemove={handleRemove} />;
        })}
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_DECISION)}>
              <Row>
                <Column>
                  <AddButton label='Lisää päätös' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type Props = {
  copyDecisionToLeases: (...args: Array<any>) => any;
  currentLease: Lease;
  hideAttachDecisionModal: (...args: Array<any>) => any;
  isAttachDecisionModalOpen: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  showAttachDecisionModal: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
};
type State = {
  decisionToAttach: number | null | undefined;
};

class DecisionsEdit extends PureComponent<Props, State> {
  state = {
    decisionToAttach: null
  };
  componentDidMount = () => {
    const {
      hideAttachDecisionModal
    } = this.props;
    hideAttachDecisionModal();
  };

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

  handleAttach = decisionId => {
    const {
      showAttachDecisionModal
    } = this.props;
    showAttachDecisionModal();
    this.setState({
      decisionToAttach: decisionId
    });
  };
  handleModalCancelAndClose = () => {
    const {
      hideAttachDecisionModal
    } = this.props;
    hideAttachDecisionModal();
    this.setState({
      decisionToAttach: null
    });
  };
  handleAttachDecisions = (payload: Record<string, any>) => {
    const {
      copyDecisionToLeases
    } = this.props;
    const {
      decisionToAttach
    } = this.state;
    copyDecisionToLeases({ ...payload,
      decision: decisionToAttach
    });
  };

  render() {
    const {
      currentLease,
      isAttachDecisionModalOpen,
      usersPermissions
    } = this.props;
    return <form>
        <AttachDecisionModal currentLeaseId={currentLease.id} isOpen={isAttachDecisionModalOpen} onCancel={this.handleModalCancelAndClose} onClose={this.handleModalCancelAndClose} onSubmit={this.handleAttachDecisions} />

        <FieldArray component={renderDecisions} name="decisions" onAttach={this.handleAttach} usersPermissions={usersPermissions} />
      </form>;
  }

}

const formName = FormNames.LEASE_DECISIONS;
export default flowRight(connect(state => {
  return {
    currentLease: getCurrentLease(state),
    isAttachDecisionModalOpen: getIsAttachDecisionModalOpen(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  copyDecisionToLeases,
  hideAttachDecisionModal,
  receiveFormValidFlags,
  showAttachDecisionModal
}), reduxForm({
  form: formName,
  destroyOnUnmount: false
}))(DecisionsEdit) as React.ComponentType<any>;