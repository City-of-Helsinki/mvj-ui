//@flow

import React from 'react';
import {Row} from "react-foundation";
import {connect} from "react-redux";

import PlotSearchSite from "./PlotSearchSite";
import {getCurrentPlotSearch} from "../../../selectors";
import type {PlotSearch} from "../../../types";
import WhiteBox from "../../../../components/content/WhiteBox";
import SubTitle from "../../../../components/content/SubTitle";
import {PlotSearchTargetType} from "../../../enums";

type Props = {
  plotSearch: PlotSearch
};

const PlotSearchTargetListing = ({ plotSearch}: Props) => {
  if (!plotSearch?.plot_search_targets) {
    return null;
  }

  const targets = plotSearch.plot_search_targets;

  const searchableTargets = targets.filter(target => target.target_type === PlotSearchTargetType.SEARCHABLE);
  const proceduralReservationTargets = targets.filter(target => target.target_type === PlotSearchTargetType.PROCEDURAL);
  const directReservationTargets = targets.filter(target => target.target_type === PlotSearchTargetType.DIRECT);

  return (
    <>
      {(searchableTargets.length > 0) &&
        <WhiteBox>
          <SubTitle>
            HAETTAVAT KOHTEET
          </SubTitle>
          {searchableTargets.map((target, index) =>
            <Row key={index}>
              <PlotSearchSite
                plotSearchSite={target}
                index={index}
              />
            </Row>
          )}
        </WhiteBox>
      }
      {(proceduralReservationTargets.length > 0) &&
        <WhiteBox>
          <SubTitle>
            MENETTELYVARAUS
          </SubTitle>
          {proceduralReservationTargets.map((target, index) =>
            <Row key={index}>
              <PlotSearchSite
                plotSearchSite={target}
                index={index}
              />
            </Row>
          )}
        </WhiteBox>
      }
      {(directReservationTargets.length > 0) &&
        <WhiteBox>
          <SubTitle>
            SUORAVARAUS
          </SubTitle>
          {directReservationTargets.map((target, index) =>
            <Row key={index}>
              <PlotSearchSite
                plotSearchSite={target}
                index={index}
              />
            </Row>
          )}
        </WhiteBox>
      }
    </>
  );
};

export default connect((state) => ({
  plotSearch: getCurrentPlotSearch(state)
}))(PlotSearchTargetListing);
