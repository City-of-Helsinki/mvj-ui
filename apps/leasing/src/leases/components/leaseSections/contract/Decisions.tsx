import React, { Fragment } from "react";
import { useAppSelector } from "@/root/hooks";
import DecisionItem from "./DecisionItem";
import FormText from "@/components/form/FormText";
import {
  LeaseDecisionConditionsFieldPaths,
  LeaseDecisionsFieldPaths,
} from "@/leases/enums";
import { getContentDecisions } from "@/leases/helpers";
import { getFieldOptions } from "@/util/helpers";
import { getAttributes, getCurrentLease } from "@/leases/selectors";
import type { Attributes } from "types";

const Decisions: React.FC = () => {
  const attributes: Attributes = useAppSelector(getAttributes);
  const currentLease = useAppSelector(getCurrentLease);
  const conditionTypeOptions = getFieldOptions(
    attributes,
    LeaseDecisionConditionsFieldPaths.TYPE,
  );
  const decisionMakerOptions = getFieldOptions(
    attributes,
    LeaseDecisionsFieldPaths.DECISION_MAKER,
  );
  const typeOptions = getFieldOptions(
    attributes,
    LeaseDecisionsFieldPaths.TYPE,
  );
  const decisions = getContentDecisions(currentLease);

  return (
    <Fragment>
      {!decisions ||
        (!decisions.length && (
          <FormText className="no-margin">Ei päätöksiä</FormText>
        ))}
      {decisions &&
        !!decisions.length &&
        decisions.map((decision) => (
          <DecisionItem
            key={decision.id}
            conditionTypeOptions={conditionTypeOptions}
            decisionMakerOptions={decisionMakerOptions}
            decision={decision}
            typeOptions={typeOptions}
          />
        ))}
    </Fragment>
  );
};

export default Decisions;
