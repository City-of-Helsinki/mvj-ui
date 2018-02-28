// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import ControlButtonBar from '../../components/controlButtons/ControlButtonBar';
import ControlButtons from '../../components/controlButtons/ControlButtons';
import PageContainer from '../../components/content/PageContainer';
import RentCriteriaEdit from './RentCriteriaEdit';
import RentCriteriaReadonly from './RentCriteriaReadonly';
import {initializeRentCriteria} from '../actions';
import {getRouteById} from '../../root/routes';

import mockCriteria from '../mock-data-single-criteria.json';

type Props = {
  initializeRentCriteria: Function,
  router: Object,
}

type State = {
  criteria: Object,
  isEditMode: boolean,
}

class RentCriteriaPage extends Component {
  props: Props

  state: State = {
    criteria: {},
    isEditMode: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    this.setState({
      criteria: mockCriteria,
    });
  }

  copyCriteria = () => {
    const {initializeRentCriteria, router} = this.props;
    const {criteria} = this.state;
    initializeRentCriteria(criteria);
    return router.push({
      pathname: getRouteById('newrentcriteria'),
    });
  }

  hideEditMode = () => {
    this.setState({isEditMode: false});
  }

  showEditMode = () => {
    const {initializeRentCriteria} = this.props;
    const {criteria} = this.state;
    initializeRentCriteria(criteria);
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
              onCopyClick={this.copyCriteria}
              onEditClick={this.showEditMode}
              onSaveClick={() => console.log('123')}
              showCommentButton={false}
              showCopyButton={true}
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

export default flowRight(
  connect(
    null,
    {
      initializeRentCriteria,
    }
  ),
)(RentCriteriaPage);
