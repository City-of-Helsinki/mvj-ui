// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import PropertyUnitPlotItem from './PropertyUnitPlotItem';
import PropertyUnitPlanPlotItem from './PropertyUnitPlanPlotItem'

type Props = {
  data: Object,
}

type State = {
  isOpen: boolean,
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
    const {data} = this.props;

    return (
      <div>
        {data.plots_in_contract && data.plots_in_contract.length > 0 &&
        <Row className='property-unit-premise'>
          <Row>
            <Column medium={12} className='property-unit-premise__title'>
              KIINTEISTÖT / MÄÄRÄALAT SOPIMUSHETKELLÄ
              <p onClick={() => this.toggle('isOpenContract')} className={classNames('arrow-icon', {'isOpen': isOpenContract})}></p>
            </Column>
          </Row>
          {isOpenContract && data.plots_in_contract.map(item =>
          <PropertyUnitPlotItem item={item} />)}
        </Row>}

        {data.plots_at_present && data.plots_at_present.length > 0 &&
        <Row className='property-unit-premise'>
          <Row>
            <Column medium={12} className='property-unit-premise__title'>
              KIINTEISTÖT / MÄÄRÄALAT NYKYHETKELLÄ
              <p onClick={() => this.toggle('isOpenPresent')} className={classNames('arrow-icon', {'isOpen': isOpenPresent})}></p>
            </Column>
          </Row>
          {isOpenPresent && data.plots_at_present.map(item =>
          <PropertyUnitPlotItem item={item} />)}
        </Row>}

        {data.plan_plot_in_contract && data.plan_plot_in_contract.length > 0 &&
        <Row className='property-unit-premise'>
          <Row>
            <Column medium={12} className='property-unit-premise__title'>
              KAAVAYKSIKKÖ SOPIMUSHETKELLÄ
              <p onClick={() => this.toggle('isOpenPlanContract')} className={classNames('arrow-icon', {'isOpen': isOpenPlanContract})}></p>
            </Column>
          </Row>
          {isOpenPlanContract &&
          <PropertyUnitPlanPlotItem item={data.plan_plot_in_contract} />}
        </Row>}

        {data.plan_plot_at_present && data.plan_plot_at_present.length > 0 &&
        <Row className='property-unit-premise'>
          <Row>
            <Column medium={12} className='property-unit-premise__title'>
              KAAVAYKSIKKÖ NYKYHETKELLÄ
              <p onClick={() => this.toggle('isOpenPlanPresent')} className={classNames('arrow-icon', {'isOpen': isOpenPlanPresent})}></p>
            </Column>
          </Row>
          {isOpenPlanPresent &&
          <PropertyUnitPlanPlotItem item={data.plan_plot_at_present} />}
        </Row>}
      </div>
    );
  }
}

export default PropertyUnitPlot;
