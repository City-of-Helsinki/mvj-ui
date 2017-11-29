// @flow
import React, {Component} from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import Collapse from '../../../../components/Collapse';

import PropertyUnitPlotItem from './PropertyUnitPlotItem';
import PropertyUnitPlanPlotItem from './PropertyUnitPlanPlotItem';

type Props = {
  area: Object,
}

class PropertyUnitPlot extends Component {
  props: Props

  render() {
    const {area} = this.props;

    return (
      <div>
        {get(area, 'plots_in_contract') && area.plots_in_contract.length > 0 &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={6}><span className='collapse__header-title'>KIINTEISTÖT / MÄÄRÄALAT SOPIMUSHETKELLÄ</span></Column>
            </Row>
          }
        >
          {area.plots_in_contract.map((item, index) =>
            <PropertyUnitPlotItem item={item} key={index}/>)
          }
        </Collapse>}

        {get(area, 'plots_at_present') && area.plots_at_present.length > 0 &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={6}><span className='collapse__header-title'>KIINTEISTÖT / MÄÄRÄALAT NYKYHETKELLÄ</span></Column>
            </Row>
          }
        >
          {area.plots_at_present.map((item, index) =>
            <PropertyUnitPlotItem item={item} key={index}/>)
          }
        </Collapse>}

        {get(area, 'plan_plots_in_contract') && area.plan_plots_in_contract.length > 0 &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={6}><span className='collapse__header-title'>KAAVAYKSIKÖT SOPIMUSHETKELLÄ</span></Column>
            </Row>
          }
        >
          {area.plan_plots_in_contract.map((item, index) =>
            <PropertyUnitPlanPlotItem item={item} key={index}/>)
          }
        </Collapse>}

        {get(area, 'plan_plots_at_present') && area.plan_plots_at_present.length > 0 &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={6}><span className='collapse__header-title'>KAAVAYKSIKÖT NYKYHETKELLÄ</span></Column>
            </Row>
          }
        >
          {area.plan_plots_at_present.map((item, index) =>
            <PropertyUnitPlanPlotItem item={item} key={index}/>)
          }
        </Collapse>}
      </div>
    );
  }
}

export default PropertyUnitPlot;
