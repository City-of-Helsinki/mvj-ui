import React, { ReactElement, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButton from "@/components/form/AddButton";
import AttachDecisionModal from "./AttachDecisionModal";
import Authorization from "@/components/authorization/Authorization";
import DecisionItemEdit from "./DecisionItemEdit";
import FormText from "@/components/form/FormText";
import {
  copyDecisionToLeases,
  hideAttachDecisionModal,
  receiveFormValidFlags,
  showAttachDecisionModal,
} from "@/leases/actions";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions } from "@/util/helpers";
import {
  getCurrentLease,
  getIsAttachDecisionModalOpen,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type DecisionsProps = {
  fields: any;
  onAttach: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const renderDecisions = ({
  fields,
  onAttach,
  usersPermissions,
}: DecisionsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_DECISION) &&
              (!fields || !fields.length) && (
                <FormText className="no-margin">Ei päätöksiä</FormText>
              )}
            {fields &&
              !!fields.length &&
              fields.map((decision, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_DECISION.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_DECISION.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_DECISION.TITLE,
                  });
                };

                return (
                  <DecisionItemEdit
                    key={index}
                    field={decision}
                    onAttach={onAttach}
                    onRemove={handleRemove}
                  />
                );
              })}
            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_DECISION,
              )}
            >
              <Row>
                <Column>
                  <AddButton label="Lisää päätös" onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  valid: boolean;
};

const DecisionsEdit: React.FC<Props> = ({ valid }) => {
  const currentLease = useSelector(getCurrentLease);
  const isAttachDecisionModalOpen = useSelector(getIsAttachDecisionModalOpen);
  const usersPermissions = useSelector(getUsersPermissions);

  const [decisionToAttach, setDecisionToAttach] = useState<
    number | null | undefined
  >(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hideAttachDecisionModal());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      receiveFormValidFlags({
        [formName]: valid,
      }),
    );
  }, [valid, dispatch]);

  const handleAttach = (decisionId) => {
    showAttachDecisionModal();
    setDecisionToAttach(decisionId);
  };

  const handleModalCancelAndClose = () => {
    hideAttachDecisionModal();
    setDecisionToAttach(null);
  };

  const handleAttachDecisions = (payload: Record<string, any>) => {
    copyDecisionToLeases({ ...payload, decision: decisionToAttach });
  };

  return (
    <form>
      <AttachDecisionModal
        currentLeaseId={currentLease.id}
        isOpen={isAttachDecisionModalOpen}
        onCancel={handleModalCancelAndClose}
        onClose={handleModalCancelAndClose}
        onSubmit={handleAttachDecisions}
      />

      <FieldArray
        component={renderDecisions}
        name="decisions"
        onAttach={handleAttach}
        usersPermissions={usersPermissions}
      />
    </form>
  );
};

const formName = FormNames.LEASE_DECISIONS;
export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
})(DecisionsEdit) as React.ComponentType<any>;
