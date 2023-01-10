//@flow

import React from 'react';
import {Row} from 'react-foundation';
import {connect} from 'react-redux';

import {
  getCurrentPlotSearch,
  getPlanUnitAttributes,
  getCustomDetailedPlanAttributes,
} from '$src/plotSearch/selectors';
import type {PlotSearch} from '$src/plotSearch/types';
import WhiteBox from '$src/components/content/WhiteBox';
import SubTitle from '$src/components/content/SubTitle';
import {PlotSearchTargetType} from '$src/plotSearch/enums';
import type {Attributes} from '$src/types';
import PlotSearchSitePlanUnit from './PlotSearchSitePlanUnit';
import PlotSearchSiteCustomDetailedPlan from './PlotSearchSiteCustomDetailedPlan';

type OwnProps = {};
type Props = {
  plotSearch: PlotSearch,
  planUnitAttributes: Attributes,
  customDetailedPlanAttributes: Attributes,
};

const PlotSearchTargetListing = ({plotSearch, planUnitAttributes, customDetailedPlanAttributes}: Props) => {
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
              {target.plan_unit ? 
                <PlotSearchSitePlanUnit
                  plotSearchSite={target}
                  index={index}
                  planUnitAttributes={planUnitAttributes}
                />
                :
                <PlotSearchSiteCustomDetailedPlan
                  plotSearchSite={target}
                  index={index}
                  customDetailedPlanAttributes={customDetailedPlanAttributes}
                />
              }
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
              {target.plan_unit ? 
                <PlotSearchSitePlanUnit
                  plotSearchSite={target}
                  index={index}
                  planUnitAttributes={planUnitAttributes}
                />
                :
                <PlotSearchSiteCustomDetailedPlan
                  plotSearchSite={target}
                  index={index}
                  customDetailedPlanAttributes={customDetailedPlanAttributes}
                />
              }
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
              {target.plan_unit ? 
                <PlotSearchSitePlanUnit
                  plotSearchSite={target}
                  index={index}
                  planUnitAttributes={planUnitAttributes}
                />
                :
                <PlotSearchSiteCustomDetailedPlan
                  plotSearchSite={target}
                  index={index}
                  customDetailedPlanAttributes={customDetailedPlanAttributes}
                />
              }
            </Row>
          )}
        </WhiteBox>
      }
    </>
  );
};

export default (connect((state) => ({
  plotSearch: getCurrentPlotSearch(state),
  planUnitAttributes: getPlanUnitAttributes(state),
  customDetailedPlanAttributes: getCustomDetailedPlanAttributes(state),
}))(PlotSearchTargetListing): React$AbstractComponent<OwnProps, mixed>);
