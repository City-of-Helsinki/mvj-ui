// @flow
import React, {Component} from 'react';

import ControlButtonBar from '../../components/controlButtons/ControlButtonBar';
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
        <ControlButtonBar
          buttonsComponent={
            <ControlButtons
              isEditMode={isEditMode}
              isValid={true}
              onCancelClick={this.hideEditMode}
              onEditClick={this.showEditMode}
              onSaveClick={() => console.log('123')}
              showCommentButton={false}
            />
          }
        />
        {isEditMode
          ? <RentCriteriaEdit criteria={criteria} />
          : <RentCriteriaReadonly criteria={criteria} />
        }
      </PageContainer>
    );
  }
}

export default RentCriteriaPage;
