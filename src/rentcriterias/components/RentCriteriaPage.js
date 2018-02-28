// @flow
import React, {Component} from 'react';

import ControlButtons from '../../components/controlButtons/ControlButtons';
import PageContainer from '../../components/content/PageContainer';
import RentCriteriaEdit from './RentCriteriaEdit';
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
      <PageContainer>
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
        {isEditMode
          ? <RentCriteriaEdit criteria={criteria} />
          : <RentCriteriaReadonly criteria={criteria} />
        }
      </PageContainer>
    );
  }
}

export default RentCriteriaPage;
