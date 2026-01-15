import React, { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButton from "@/components/form/AddButton";
import Authorization from "@/components/authorization/Authorization";
import ContractFileModal from "./ContractFileModal";
import ContractItemEdit from "./ContractItemEdit";
import FormText from "@/components/form/FormText";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentContracts, getDecisionOptions } from "@/leases/helpers";
import { hasPermissions } from "@/util/helpers";
import { getCurrentLease } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type ContractsProps = {
  decisionOptions: Array<Record<string, any>>;
  fields: any;
  onShowContractFileModal: (...args: Array<any>) => any;
  savedContracts: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
  contracts: Array<Record<string, any>>;
};

const Contracts = ({
  decisionOptions,
  fields,
  onShowContractFileModal,
  savedContracts,
  usersPermissions,
  contracts,
}: ContractsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACT) &&
              (!fields || !fields.length) && (
                <FormText className="no-margin">Ei sopimuksia</FormText>
              )}

            {fields &&
              !!fields.length &&
              fields.map((contract, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_CONTRACT.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_CONTRACT.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_CONTRACT.TITLE,
                  });
                };

                return (
                  <ContractItemEdit
                    key={index}
                    decisionOptions={decisionOptions}
                    field={contract}
                    onRemove={handleRemove}
                    onShowContractFileModal={onShowContractFileModal}
                    savedContracts={savedContracts}
                    contract={contracts[index]}
                  />
                );
              })}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_CONTRACT,
              )}
            >
              <Row>
                <Column>
                  <AddButton label="Lisää sopimus" onClick={handleAdd} />
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

const ContractsEdit: React.FC<Props> = ({ formApi }) => {
  const [contractId, setContractId] = React.useState<number>(-1);
  const [decisionOptions, setDecisionOptions] = React.useState<
    Array<Record<string, any>>
  >([]);
  const [savedContracts, setSavedContracts] = React.useState<
    Array<Record<string, any>>
  >([]);
  const [showContractModal, setShowContractModal] =
    React.useState<boolean>(false);

  const currentLease = useSelector(getCurrentLease);
  const usersPermissions = useSelector(getUsersPermissions);

  useEffect(() => {
    if (currentLease) {
      setDecisionOptions(getDecisionOptions(currentLease));
      setSavedContracts(getContentContracts(currentLease));
    }
  }, [currentLease]);

  const handleShowContractFileModal = (contractId: number) => {
    setContractId(contractId);
    setShowContractModal(true);
  };
  const handleCloseContractFileModal = () => {
    setContractId(-1);
    setShowContractModal(false);
  };

  return (
    <Form form={formApi} onSubmit={formApi.submit}>
      {() => (
        <form>
          <ContractFileModal
            contractId={contractId}
            onClose={handleCloseContractFileModal}
            open={showContractModal}
          />

          <FieldArray name="contracts">
            {(fieldArrayProps) =>
              Contracts({
                ...fieldArrayProps,
                decisionOptions: decisionOptions,
                onShowContractFileModal: handleShowContractFileModal,
                savedContracts: savedContracts,
                usersPermissions: usersPermissions,
                contracts: currentLease.contracts,
              })
            }
          </FieldArray>
        </form>
      )}
    </Form>
  );
};

export default ContractsEdit;
