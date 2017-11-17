// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';

type State = {
  isOpen: boolean,
}

class PropertyUnit extends Component {
  state: State = {
    isOpen: false,
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    const {isOpen} = this.state;

    return (
      <div className='property-unit'>
        <Row>
          <Column medium={4} className='title'>
            <svg className='map-icon' viewBox="0 0 30 30">
              <path d="M28.5 2.06v21.52l-.7.28-7.88 3.37-.42.22-.42-.15-8.58-3.23-7.45 3.16-1.55.71V6.42l.7-.28 7.88-3.37.42-.22.42.15 8.58 3.23L27 2.77zM9.38 5.44L3.75 7.83v16.73l5.63-2.39zm2.24-.07V22.1l6.76 2.53V7.9zm14.63.07l-5.63 2.39v16.73l5.63-2.39z"/>
            </svg>
            <h2>Kaavayksikkö 91-10-9903-10</h2>
          </Column>
          <Column medium={4}>
            <p>Heinäsarankaari 10, 00560 Helsinki</p>
          </Column>
          <Column medium={4} className='property-size'>
            <p>1 034 m<sup>2</sup></p>
            <p onClick={this.toggle} className={classNames('arrow-icon', {'isOpen': isOpen})}></p>
          </Column>
        </Row>
      </div>
    );
  }
}

export default PropertyUnit;
