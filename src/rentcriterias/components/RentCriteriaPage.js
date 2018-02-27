// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';

import ControlButtons from '../../components/controlButtons/ControlButtons';
import EditRentCriteriaForm from './forms/EditRentCriteriaForm';

import mockCriteria from '../mock-data-single-criteria.json';

type State = {
  criteria: Object,
  isEditMode: boolean,
}

class RentCriteriaPage extends Component {
  state: State = {
    criteria: {},
    isEditMode: false,
  }

  componentWillMount() {
    this.setState({
      criteria: mockCriteria,
    });
  }

  hideEditMode = () => {
    this.setState({isEditMode: false});
  }

  showEditMode = () => {
    this.setState({isEditMode: true});
  }

  render() {
    const {criteria, isEditMode} = this.state;

    return (
      <div className='rent-criteria-page'>
        <div className="rent-criteria-page__content">
          <h1>Vuokrausperuste</h1>
          <div className="divider" />
          {isEditMode
            ? <EditRentCriteriaForm
                initialValues={criteria}
              />
            : <h1>Non edit mode</h1>
          }
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
