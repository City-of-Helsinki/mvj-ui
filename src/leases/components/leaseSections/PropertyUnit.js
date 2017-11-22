// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import PropertyUnitPlot from './PropertyUnitPlot';
import {capitalize} from 'lodash';

type Props = {
  area: Object,
}

type State = {
  isOpen: boolean,
}

class PropertyUnit extends Component {
  props: Props

  state: State = {
    isOpen: true,
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    const {isOpen} = this.state;
    const {area} = this.props;


    return (
      <div>
        <Row className='property-unit__summary'>
          <Column medium={4} className='title'>
            <svg className='map-icon' viewBox="0 0 30 30">
              <path d="M28.5 2.06v21.52l-.7.28-7.88 3.37-.42.22-.42-.15-8.58-3.23-7.45 3.16-1.55.71V6.42l.7-.28 7.88-3.37.42-.22.42.15 8.58 3.23L27 2.77zM9.38 5.44L3.75 7.83v16.73l5.63-2.39zm2.24-.07V22.1l6.76 2.53V7.9zm14.63.07l-5.63 2.39v16.73l5.63-2.39z"/>
            </svg>
            <h2>{`${capitalize(area.explanation)} ${area.municipality}-${area.district}-${area.sequence}`}</h2>
          </Column>
          <Column medium={4}>
            <p>{`${capitalize(area.address)}, ${area.zip_code} ${capitalize(area.town)}`}</p>
          </Column>
          <Column medium={4} className='property-size'>
            <p>{area.full_area} m<sup>2</sup> ({area.part_or_whole})</p>
            <p onClick={this.toggle} className={classNames('arrow-icon', {'isOpen': isOpen})}></p>
          </Column>
        </Row>
        {isOpen &&
          <div>
            <PropertyUnitPlot area={area}/>
          </div>
        }
      </div>
    );
  }
}

export default PropertyUnit;
