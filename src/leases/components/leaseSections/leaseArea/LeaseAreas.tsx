import React from "react";
import { useSelector } from "react-redux";
import Authorization from "@/components/authorization/Authorization";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import LeaseAreaWithArchiveInfo from "./LeaseAreaWithArchiveInfo";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import { LeaseAreasFieldPaths } from "@/leases/enums";
import {
  calculateAreasSum,
  getContentLeaseAreas,
  getDecisionOptions,
} from "@/leases/helpers";
import { formatNumber, isFieldAllowedToRead } from "@/util/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getAttributes, getCurrentLease } from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
type Props = {};

const LeaseAreas: React.FC<Props> = () => {
  const attributes: Attributes = useSelector(getAttributes);
  const currentLease: Lease = useSelector(getCurrentLease);

  const areas = getContentLeaseAreas(currentLease);
  const activeAreas = areas.filter((area) => !area.archived_at);
  const archivedAreas = areas.filter((area) => area.archived_at);
  const areasSum = calculateAreasSum(activeAreas);
  const decisionOptions = getDecisionOptions(currentLease);

  // Data state variables
  const noAreaData = !activeAreas.length && !archivedAreas.length;
  const hasActiveAreas = !!activeAreas && !!activeAreas.length;

  return (
    <div>
      <Title uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.LEASE_AREAS)}>
        Vuokra-alue
      </Title>
      <Authorization
        allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}
      >
        <WarningContainer alignCenter hideIcon>
          Kokonaispinta-ala {formatNumber(areasSum) || "-"} m<sup>2</sup>
        </WarningContainer>
      </Authorization>
      <Divider />

      {noAreaData && (
        <FormText className="no-margin">Ei vuokra-alueita</FormText>
      )}
      {hasActiveAreas &&
        activeAreas.map((area, index) => (
          <LeaseAreaWithArchiveInfo
            key={index}
            area={area}
            decisionOptions={decisionOptions}
          />
        ))}

      {archivedAreas && !!archivedAreas.length && (
        <h3
          style={{
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          Arkisto
        </h3>
      )}
      {archivedAreas &&
        !!archivedAreas.length &&
        archivedAreas.map((area, index) => (
          <LeaseAreaWithArchiveInfo
            key={index}
            area={area}
            decisionOptions={decisionOptions}
          />
        ))}
    </div>
  );
};

export default LeaseAreas;
