import React from "react";
import { useSelector } from "react-redux";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import GreenBox from "@/components/content/GreenBox";
import InspectionItem from "./InspectionItem";
import { getContentInspections } from "@/leases/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";

const Inspections: React.FC = () => {
  const currentLease: Lease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  const inspections = getContentInspections(currentLease);

  if (!inspections || !inspections.length) {
    return (
      <FormText className="no-margin">
        Ei tarkastuksia tai huomautuksia
      </FormText>
    );
  }

  return (
    <GreenBox>
      {inspections && !!inspections.length && (
        <BoxItemContainer>
          {inspections.map((inspection) => {
            return (
              <BoxItem
                key={inspection.id}
                className="no-border-on-first-child no-border-on-last-child"
              >
                <InspectionItem
                  inspection={inspection}
                  leaseAttributes={leaseAttributes}
                />
              </BoxItem>
            );
          })}
        </BoxItemContainer>
      )}
    </GreenBox>
  );
};

export default Inspections;
