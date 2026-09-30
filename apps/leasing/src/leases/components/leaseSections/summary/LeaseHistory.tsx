import React, { useMemo } from "react";
import { useAppSelector } from "@/root/hooks";
import TitleH3 from "@/components/content/TitleH3";
import LeaseHistoryNode from "./LeaseHistoryNode";
import { LeaseFieldPaths, LeaseFieldTitles } from "@/leases/enums";
import { getFieldOptions } from "@/util/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { buildLeaseHistory } from "@/leaseHistory/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";

const LeaseHistory: React.FC = () => {
  const currentLease = useAppSelector(getCurrentLease);
  const leaseAttributes = useAppSelector(getLeaseAttributes);
  const stateOptions = getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE);

  const leaseHistoryGroups = useMemo(
    () => buildLeaseHistory(currentLease),
    [currentLease],
  );

  return (
    <div className="summary__related-leases">
      <TitleH3 uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}>
        {LeaseFieldTitles.HISTORY}
      </TitleH3>
      <div className="summary__related-leases_items">
        {leaseHistoryGroups.map((group) => (
          <div
            className="summary__related-leases_group"
            key={`service-unit-${group.serviceUnitId}`}
          >
            {leaseHistoryGroups.length > 1 && (
              <h4 className="summary__related-leases_service-unit">
                {group.serviceUnitName}
              </h4>
            )}
            {group.chains.map((chain) => (
              <div className="summary__related-leases_chain" key={chain.key}>
                {chain.nodes.length > 1 && (
                  <div className="summary__related-leases_chain_line" />
                )}
                {chain.nodes.map((node) => (
                  <LeaseHistoryNode
                    key={node.key}
                    node={node}
                    stateOptions={stateOptions}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaseHistory;
