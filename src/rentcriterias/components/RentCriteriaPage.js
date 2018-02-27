// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';

import ControlButtons from '../../components/controlButtons/ControlButtons';

import mockCriteria from '../mock-data-single-criteria.json';

type State = {
  isEditMode: boolean,
}

class RentCriteriaPage extends Component {
  state: State = {
    isEditMode: false,
  }

  hideEditMode = () => {
    this.setState({isEditMode: false});
  }

  showEditMode = () => {
    this.setState({isEditMode: true});
  }

  render() {
    const {isEditMode} = this.state;
    console.log(mockCriteria);

    return (
      <div className='rent-criteria-page'>
        <div className="rent-criteria-page__content">
          <h1>Vuokrausperuste</h1>
          <div className="divider" />
        </div>
        <Row>
          <Column>
            <div className='rent-criteria-page__upper-bar'>
              <div className="rent-criteria-info-wrapper"></div>
              <div className='controls'>
                <ControlButtons
                  isEditMode={isEditMode}
                  isValid={true}
                  onCancelClick={this.hideEditMode}
                  onEditClick={this.showEditMode}
                  onSaveClick={() => console.log('123')}
                  showCommentButton={false}
                />
              </div>
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

export default RentCriteriaPage;
