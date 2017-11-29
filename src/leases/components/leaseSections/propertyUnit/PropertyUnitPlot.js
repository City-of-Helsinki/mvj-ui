// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import PropertyUnitPlotItem from './PropertyUnitPlotItem';
import PropertyUnitPlanPlotItem from './PropertyUnitPlanPlotItem';

type Props = {
  area: Object,
}

type State = {
  isOpenContract: boolean,
  isOpenPresent: boolean,
  isOpenPlanContract: boolean,
  isOpenPlanPresent: boolean,
}

class PropertyUnitPlot extends Component {
  props: Props

  state: State = {
    isOpenContract: true,
    isOpenPresent: true,
    isOpenPlanContract: true,
    isOpenPlanPresent: true,
  }

  toggle = (state: string) => {
    this.setState({[state]: !this.state[state]});
  }

  render() {
    const {isOpenContract, isOpenPresent, isOpenPlanContract, isOpenPlanPresent} = this.state;
    const {area} = this.props;

    return (
      <div>
        {get(area, 'plots_in_contract') && area.plots_in_contract.length > 0 &&
        <Row className='property-unit-premise'>
          <Row>
            <Column medium={12} className='property-unit-premise__title'>
              KIINTEISTÖT / MÄÄRÄALAT SOPIMUSHETKELLÄ
              <p onClick={() => this.toggle('isOpenContract')} className={classNames('arrow-icon', {'isOpen': isOpenContract})}></p>
            </Column>
          </Row>
          {isOpenContract && area.plots_in_contract.map((item, index) =>
            <PropertyUnitPlotItem item={item} key={index}/>)
          }
        </Row>}

        {get(area, 'plots_at_present') && area.plots_at_present.length > 0 &&
        <Row className='property-unit-premise'>
          <Row>
            <Column medium={12} className='property-unit-premise__title'>
              KIINTEISTÖT / MÄÄRÄALAT NYKYHETKELLÄ
              <p onClick={() => this.toggle('isOpenPresent')} className={classNames('arrow-icon', {'isOpen': isOpenPresent})}></p>
            </Column>
          </Row>
          {isOpenPresent && area.plots_at_present.map((item, index) =>
            <PropertyUnitPlotItem item={item} key={index}/>)
          }
        </Row>}

        {get(area, 'plan_plots_in_contract') && area.plan_plots_in_contract.length > 0 &&
        <Row className='property-unit-premise'>
          <Row>
            <Column medium={12} className='property-unit-premise__title'>
              KAAVAYKSIKKÖ SOPIMUSHETKELLÄ
              <p onClick={() => this.toggle('isOpenPlanContract')} className={classNames('arrow-icon', {'isOpen': isOpenPlanContract})}></p>
            </Column>
          </Row>
          {isOpenPlanContract && area.plan_plots_in_contract.map((item, index) =>
            <PropertyUnitPlanPlotItem item={item} key={index}/>
          )}
        </Row>}

        {get(area, 'plan_plots_at_present') && area.plan_plots_at_present.length > 0 &&
        <Row className='property-unit-premise'>
          <Row>
            <Column medium={12} className='property-unit-premise__title'>
              KAAVAYKSIKKÖ NYKYHETKELLÄ
              <p onClick={() => this.toggle('isOpenPlanPresent')} className={classNames('arrow-icon', {'isOpen': isOpenPlanPresent})}></p>
            </Column>
          </Row>
          {isOpenPlanPresent && area.plan_plots_at_present.map((item, index) =>
            <PropertyUnitPlanPlotItem item={item} key={index}/>
          )}
        </Row>}
      </div>
    );
  }
}

export default PropertyUnitPlot;
