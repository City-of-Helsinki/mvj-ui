// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import RentCriteriaEdit from './RentCriteriaEdit';
import RentCriteriaInfo from './RentCriteriaInfo';
import RentCriteriaReadonly from './RentCriteriaReadonly';
import {
  editRentCriteria,
  fetchSingleRentCriteria,
  hideEditMode,
  initializeRentCriteria,
  showEditMode,
} from '../actions';
import {
  getIsEditMode,
  getIsFetching,
  getRentCriteria,
  getRentCriteriaFormValues,
} from '../selectors';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById} from '$src/root/routes';
import type {RootState} from '$src/root/types';

type Props = {
  criteria: Object,
  editedCriteria: Object,
  editRentCriteria: Function,
  fetchSingleRentCriteria: Function,
  hideEditMode: Function,
  initializeRentCriteria: Function,
  isEditMode: boolean,
  isFetching: boolean,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

class RentCriteriaPage extends Component {
  props: Props

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchSingleRentCriteria, receiveTopNavigationSettings} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentbasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });
    fetchSingleRentCriteria();
  }

  copyCriteria = () => {
    const {criteria, initializeRentCriteria, router} = this.props;
    initializeRentCriteria(criteria);
    return router.push({
      pathname: getRouteById('newrentcriteria'),
    });
  }

  saveCriteria = () => {
    const {editRentCriteria, editedCriteria} = this.props;
    editRentCriteria(editedCriteria);
  }

  hideEditMode = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
  }

  showEditMode = () => {
    const {criteria, initializeRentCriteria, showEditMode} = this.props;
    initializeRentCriteria(criteria);
    showEditMode();
  }

  render() {
    const {criteria, isEditMode, isFetching} = this.props;

    if(isFetching) {
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={false}
              onCancelClick={this.hideEditMode}
              onCopyClick={this.copyCriteria}
              onEditClick={this.showEditMode}
              onSaveClick={this.saveCriteria}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={
            <RentCriteriaInfo
              identifier={criteria.id}
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

const mapStateToProps = (state: RootState) => {
  return {
    criteria: getRentCriteria(state),
    editedCriteria: getRentCriteriaFormValues(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      editRentCriteria,
      fetchSingleRentCriteria,
      hideEditMode,
      initializeRentCriteria,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(RentCriteriaPage);
