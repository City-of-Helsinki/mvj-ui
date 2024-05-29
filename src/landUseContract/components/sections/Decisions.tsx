import React from "react";
import { connect } from "react-redux";
import DecisionItem from "./DecisionItem";
import { getContentDecisions } from "landUseContract/helpers";
import { getAttributes, getCurrentLandUseContract } from "landUseContract/selectors";
import type { Attributes } from "types";
import type { LandUseContract } from "landUseContract/types";
type Props = {
  attributes: Attributes;
  currentLandUseContract: LandUseContract;
};

const Decisions = ({
  attributes,
  currentLandUseContract
}: Props) => {
  const decisions = getContentDecisions(currentLandUseContract);
  return <div>
      {!!decisions.length && decisions.map((decision, index) => {
      return <DecisionItem key={index} attributes={attributes} decision={decision} />;
    })}
    </div>;
};

export default connect(state => {
  return {
    attributes: getAttributes(state),
    currentLandUseContract: getCurrentLandUseContract(state)
  };
})(Decisions);