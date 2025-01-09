import React from "react";
import { connect } from "react-redux";
import ContractItem from "./ContractItem";
import FormText from "@/components/form/FormText";
import { getContentContracts } from "@/landUseContract/helpers";
import { getFieldOptions } from "@/util/helpers";
import {
  getAttributes,
  getCurrentLandUseContract,
} from "@/landUseContract/selectors";
import type { Attributes } from "types";
import type { LandUseContract } from "@/landUseContract/types";
type Props = {
  attributes: Attributes;
  currentLandUseContract: LandUseContract;
};

const Contracts = ({ attributes, currentLandUseContract }: Props) => {
  const contracts = getContentContracts(currentLandUseContract),
    stateOptions = getFieldOptions(
      attributes,
      "contracts.child.children.state",
    ),
    contractTypeOptions = getFieldOptions(
      attributes,
      "contracts.child.children.type",
    ),
    decisionOptions = getFieldOptions(
      attributes,
      "contracts.child.children.decision",
    );
  return (
    <div>
      {!contracts.length && (
        <FormText className="no-margin">Ei sopimuksia</FormText>
      )}
      {!!contracts.length &&
        contracts.map((contract, index) => {
          return (
            <ContractItem
              key={index}
              contract={contract}
              stateOptions={stateOptions}
              contractTypeOptions={contractTypeOptions}
              decisionOptions={decisionOptions}
              attributes={attributes}
              currentLandUseContract={currentLandUseContract}
            />
          );
        })}
    </div>
  );
};

export default connect((state) => {
  return {
    attributes: getAttributes(state),
    currentLandUseContract: getCurrentLandUseContract(state),
  };
})(Contracts);
