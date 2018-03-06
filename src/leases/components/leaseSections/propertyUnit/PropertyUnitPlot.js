// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';

import GreenBox from '$components/content/GreenBox';
import PropertyUnitPlotItem from './PropertyUnitPlotItem';
import PropertyUnitPlanPlotItem from './PropertyUnitPlanPlotItem';
import SubsectionContent from '$components/content/SubsectionContent';

type Props = {
  area: Object,
}

class PropertyUnitPlot extends Component {
  props: Props

  render() {
    const {area} = this.props;
    return (
      <SubsectionContent>
        <h2>Kiinteistöt ja määräalat</h2>
        <Row>
          <Column small={12} medium={6}>
            <GreenBox className='full-height'>
              <h3>Kiinteistöt / määräalat sopimushetkellä</h3>
              {area.plots_in_contract && area.plots_in_contract.length > 0
                ? (
                  <div>
                    {area.plots_in_contract.map((item, index) =>
                      <PropertyUnitPlotItem item={item} key={index} />
                    )}
                  </div>
                ) : (
                  <p className='no-margin'>Ei kiinteistöjä / määräaloja sopimushetkellä</p>
                )
              }
            </GreenBox>
          </Column>
          <Column small={12} medium={6}>
            <GreenBox className='full-height'>
              <h3>Kiinteistöt / määräalat nykyhetkellä</h3>
              {area.plots_at_present && area.plots_at_present.length > 0
                ? (
                  <div>
                    {area.plots_at_present.map((item, index) =>
                      <PropertyUnitPlotItem item={item} key={index} />
                    )}
                  </div>
                ) : (
                  <p className='no-margin'>Ei kiinteistöjä / määräaloja nykyhetkellä</p>
                )
              }
            </GreenBox>
          </Column>
        </Row>
        <h2>Kaavayksiköt</h2>
        <Row>
          <Column small={12} medium={6}>
            <GreenBox className='full-height'>
              <h3>Kaavayksiköt sopimushetkellä</h3>
              {area.plan_plots_in_contract && area.plan_plots_in_contract.length > 0
                ? (
                  <div>
                    {area.plan_plots_in_contract.map((item, index) =>
                      <PropertyUnitPlanPlotItem item={item} key={index} />
                    )}
                  </div>
                ) : (
                  <p className='no-margin'>Ei kaavayksiköitä sopimushetkellä</p>
                )
              }
            </GreenBox>
          </Column>
          <Column small={12} medium={6}>
            <GreenBox className='full-height'>
              <h3>Kaavayksiköt nykyhetkellä</h3>
              {area.plan_plots_at_present && area.plan_plots_at_present.length > 0
                ? (
                  <div>
                    {area.plan_plots_at_present.map((item, index) =>
                      <PropertyUnitPlanPlotItem item={item} key={index} />
                    )}
                  </div>
                ) : (
                  <p className='no-margin'>Ei kaavayksiköitä nykyhetkellä</p>
                )
              }
            </GreenBox>
          </Column>
        </Row>
      </SubsectionContent>
    );
  }
}

export default PropertyUnitPlot;
