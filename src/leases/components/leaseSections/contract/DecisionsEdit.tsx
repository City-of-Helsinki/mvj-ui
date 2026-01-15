import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
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

const Decisions = ({
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
                    decisionId={fields.value?.[index]?.id}
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
  formApi: FormApi;
};

const DecisionsEdit: React.FC<Props> = ({ formApi }) => {
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

  const handleAttach = (decisionId) => {
    dispatch(showAttachDecisionModal());
    setDecisionToAttach(decisionId);
  };

  const handleModalCancelAndClose = () => {
    dispatch(hideAttachDecisionModal());
    setDecisionToAttach(null);
  };

  const handleAttachDecisions = (payload: Record<string, any>) => {
    dispatch(copyDecisionToLeases({ ...payload, decision: decisionToAttach }));
  };

  return (
    <Form form={formApi} onSubmit={formApi.submit}>
      {() => (
        <form>
          <AttachDecisionModal
            currentLeaseId={currentLease.id}
            isOpen={isAttachDecisionModalOpen}
            onCancel={handleModalCancelAndClose}
            onClose={handleModalCancelAndClose}
            onSubmit={handleAttachDecisions}
          />

          <FieldArray name="decisions">
            {(fieldArrayProps) =>
              Decisions({
                ...fieldArrayProps,
                onAttach: handleAttach,
                usersPermissions,
              })
            }
          </FieldArray>
        </form>
      )}
    </Form>
  );
};

export default DecisionsEdit;
