import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ConstructabilityItem from "./ConstructabilityItem";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import SendEmail from "./SendEmail";
import Title from "@/components/content/Title";
import { LeaseAreasFieldPaths, LeaseAreasFieldTitles } from "@/leases/enums";
import { getContentConstructabilityAreas } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getFieldOptions } from "@/util/helpers";
import { getAttributes, getCurrentLease } from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";

const Constructability: React.FC = () => {
  const attributes: Attributes = useSelector(getAttributes);
  const currentLease: Lease = useSelector(getCurrentLease);

  const [areas, setAreas] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [constructabilityStateOptions, setConstructabilityStateOptions] =
    useState([]);
  const [
    constructabilityReportInvestigationStateOptions,
    setConstructabilityReportInvestigationStateOptions,
  ] = useState([]);
  const [
    pollutedLandRentConditionStateOptions,
    setPollutedLandRentConditionStateOptions,
  ] = useState([]);

  // State to update when lease changes
  useEffect(() => {
    setAreas(getContentConstructabilityAreas(currentLease));
  }, [currentLease]);

  // State to update when lease attributes change
  useEffect(() => {
    setConstructabilityReportInvestigationStateOptions(
      getFieldOptions(
        attributes,
        LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE,
      ),
    );
    setConstructabilityStateOptions(
      getFieldOptions(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE),
    );
    setLocationOptions(
      getFieldOptions(attributes, LeaseAreasFieldPaths.LOCATION),
    );
    setPollutedLandRentConditionStateOptions(
      getFieldOptions(
        attributes,
        LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE,
      ),
    );
    setTypeOptions(getFieldOptions(attributes, LeaseAreasFieldPaths.TYPE));
  }, [attributes]);

  return (
    <>
      <Title
        uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY)}
      >
        {LeaseAreasFieldTitles.CONSTRUCTABILITY}
      </Title>
      <Divider />
      <SendEmail />

      {!areas ||
        (!areas.length && (
          <FormText className="no-margin">Ei vuokra-alueita</FormText>
        ))}
      {areas &&
        !!areas.length &&
        areas.map((area) => (
          <ConstructabilityItem
            key={area.id}
            area={area}
            constructabilityReportInvestigationStateOptions={
              constructabilityReportInvestigationStateOptions
            }
            constructabilityStateOptions={constructabilityStateOptions}
            locationOptions={locationOptions}
            pollutedLandRentConditionStateOptions={
              pollutedLandRentConditionStateOptions
            }
            typeOptions={typeOptions}
          />
        ))}
    </>
  );
};

export default Constructability;
