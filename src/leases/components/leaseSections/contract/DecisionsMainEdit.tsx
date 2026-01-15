import React from "react";
import { useSelector } from "react-redux";
import Authorization from "@/components/authorization/Authorization";
import ContractsEdit from "./ContractsEdit";
import DecisionsEdit from "./DecisionsEdit";
import Divider from "@/components/content/Divider";
import InspectionsEdit from "./InspectionsEdit";
import Title from "@/components/content/Title";
import {
  LeaseContractsFieldPaths,
  LeaseContractsFieldTitles,
  LeaseDecisionsFieldPaths,
  LeaseDecisionsFieldTitles,
  LeaseInspectionsFieldPaths,
  LeaseInspectionsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
import type { FormApi } from "final-form";

type Props = {
  decisionsFormApi: FormApi;
  contractFormApi: FormApi;
  inspectionsFormApi: FormApi;
};

const DecisionsMainEdit: React.FC<Props> = ({
  decisionsFormApi,
  contractFormApi,
  inspectionsFormApi,
}) => {
  const attributes: Attributes = useSelector(getAttributes);

  return (
    <>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseDecisionsFieldPaths.DECISIONS,
        )}
      >
        <>
          <Title
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DECISIONS)}
          >
            {LeaseDecisionsFieldTitles.DECISIONS}
          </Title>
          <Divider />
          <DecisionsEdit formApi={decisionsFormApi} />
        </>
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractsFieldPaths.CONTRACTS,
        )}
      >
        <>
          <Title
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.CONTRACTS)}
          >
            {LeaseContractsFieldTitles.CONTRACTS}
          </Title>
          <Divider />
          <ContractsEdit formApi={contractFormApi} />
        </>
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseInspectionsFieldPaths.INSPECTIONS,
        )}
      >
        <>
          <Title
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseInspectionsFieldPaths.INSPECTIONS,
            )}
          >
            {LeaseInspectionsFieldTitles.INSPECTIONS}
          </Title>
          <Divider />
          <InspectionsEdit formApi={inspectionsFormApi} />
        </>
      </Authorization>
    </>
  );
};

export default DecisionsMainEdit;
