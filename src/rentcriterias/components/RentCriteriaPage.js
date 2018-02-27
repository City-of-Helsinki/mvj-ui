// @flow
import React, {Component} from 'react';

import ControlButtons from '../../components/controlButtons/ControlButtons';
import EditRentCriteriaForm from './forms/EditRentCriteriaForm';
import ContentContainer from '../../components/content/ContentContainer';
import GreenBox from '../../components/content/GreenBox';
import GreenBoxEdit from '../../components/content/GreenBoxEdit';
import RentCriteriaReadonly from './RentCriteriaReadonly';

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
        <ContentContainer>
          <h1>Vuokrausperuste</h1>
          <div className="divider" />
          {isEditMode ? (
            <GreenBoxEdit>
              <EditRentCriteriaForm
                initialValues={criteria}
              />
            </GreenBoxEdit>
          ) : (
            <GreenBox>
              <RentCriteriaReadonly
                criteria={criteria}
              />
            </GreenBox>
          )}
        </ContentContainer>
      </div>
    );
  }
}

export default RentCriteriaPage;
