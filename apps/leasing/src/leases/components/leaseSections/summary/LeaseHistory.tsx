import React, { useState } from "react";
import { useAppSelector } from "@/root/hooks";
import LeaseHistoryNode from "./LeaseHistoryNode";
import LeaseHistoryGraph from "./LeaseHistoryGraph";
import TitleH3 from "@/components/content/TitleH3";
import { LeaseFieldPaths, LeaseFieldTitles } from "@/leases/enums";
import { getFieldOptions } from "@/util/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import { buildLeaseHistory } from "@/leases/leaseHistory";
import { buildLeaseHistoryGraph } from "@/leases/leaseHistoryGraph";

const LeaseHistory: React.FC = () => {
  const currentLease = useAppSelector(getCurrentLease);
  const leaseAttributes = useAppSelector(getLeaseAttributes);
  const stateOptions = getFieldOptions(leaseAttributes, LeaseFieldPaths.STATE);

  // PROTOTYPE toggle: compare the 1D list against the dagre graph view.
  const [view, setView] = useState<"list" | "graph">("list");

  const groups = buildLeaseHistory(currentLease);
  const showServiceUnitHeadings = groups.length > 1;
  const graph = buildLeaseHistoryGraph(currentLease);

  return (
    <div className="summary__related-leases">
      <TitleH3 uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}>
        {LeaseFieldTitles.HISTORY}
      </TitleH3>
      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => setView(view === "list" ? "graph" : "list")}
        >
          {view === "list" ? "Näytä kaaviona" : "Näytä listana"}
        </button>
      </div>
      {view === "graph" ? (
        <LeaseHistoryGraph graph={graph} stateOptions={stateOptions} />
      ) : (
        <div className="summary__related-leases_items">
          {groups.map((group) => (
            <div
              className="summary__related-leases_group"
              key={`service-unit-${group.serviceUnitId}`}
            >
              {showServiceUnitHeadings && (
                <h4 className="summary__related-leases_service-unit">
                  {group.serviceUnitName}
                </h4>
              )}
              <div className="summary__related-leases_group_items">
                <div className="summary__related-leases_items_border-left" />
                {group.nodes.map((node, index) => (
                  <LeaseHistoryNode
                    key={node.key}
                    node={node}
                    stateOptions={stateOptions}
                    isFirstNode={index === 0}
                    isLastNode={index === group.nodes.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaseHistory;
