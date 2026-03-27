import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ContractFileModal from "./ContractFileModal";
import ContractItem from "./ContractItem";
import FormText from "@/components/form/FormText";
import { LeaseContractsFieldPaths } from "@/leases/enums";
import { getContentContracts } from "@/leases/helpers";
import { getFieldOptions } from "@/util/helpers";
import { getAttributes, getCurrentLease } from "@/leases/selectors";
import type { Attributes } from "types";

const Contracts: React.FC = () => {
  const attributes: Attributes = useSelector(getAttributes);
  const currentLease = useSelector(getCurrentLease);

  const [contractId, setContractId] = React.useState<number>(-1);
  const [showContractModal, setShowContractModal] =
    React.useState<boolean>(false);
  const [contracts, setContracts] = React.useState<Array<Record<string, any>>>(
    [],
  );
  const [typeOptions, setTypeOptions] = React.useState<
    Array<Record<string, any>>
  >([]);

  useEffect(() => {
    setTypeOptions(getFieldOptions(attributes, LeaseContractsFieldPaths.TYPE));
    setContracts(getContentContracts(currentLease));
  }, [attributes, currentLease]);

  const handleShowContractFileModal = (contractId: number) => {
    setContractId(contractId);
    setShowContractModal(true);
  };

  const handleCloseContractFileModal = () => {
    setContractId(-1);
    setShowContractModal(false);
  };

  return (
    <>
      <ContractFileModal
        contractId={contractId}
        onClose={handleCloseContractFileModal}
        open={showContractModal}
      />

      {(!contracts || !contracts.length) && (
        <FormText className="no-margin">Ei sopimuksia</FormText>
      )}
      {contracts &&
        !!contracts.length &&
        contracts.map((contract, index) => (
          <ContractItem
            key={index}
            contract={contract}
            onShowContractFileModal={handleShowContractFileModal}
            typeOptions={typeOptions}
          />
        ))}
    </>
  );
};

export default Contracts;
