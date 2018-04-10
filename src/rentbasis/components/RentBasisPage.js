// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
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
  fetchAttributes,
  fetchSingleRentBasis,
  hideEditMode,
  initializeRentCriteria,
  showEditMode,
} from '../actions';
import {
  getAttributes,
  getIsEditMode,
  getIsFetching,
  getRentBasis,
  getRentCriteriaFormValues,
} from '../selectors';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById} from '$src/root/routes';

import type {Attributes, RentBasis} from '../types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  editedCriteria: Object,
  editRentCriteria: Function,
  fetchAttributes: Function,
  fetchSingleRentBasis: Function,
  hideEditMode: Function,
  initializeRentCriteria: Function,
  isEditMode: boolean,
  isFetching: boolean,
  params: Object,
  receiveTopNavigationSettings: Function,
  rentBasis: RentBasis,
  router: Object,
  showEditMode: Function,
}

class RentBasisPage extends Component {
  props: Props

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      fetchAttributes,
      fetchSingleRentBasis,
      params: {rentBasisId},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentbasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    fetchSingleRentBasis(rentBasisId);
    fetchAttributes();
  }

  copyCriteria = () => {
    const {initializeRentCriteria, rentBasis, router} = this.props;
    initializeRentCriteria(rentBasis);
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
    const {initializeRentCriteria, rentBasis, showEditMode} = this.props;
    initializeRentCriteria(rentBasis);
    showEditMode();
  }

  render() {
    const {attributes, isEditMode, isFetching, rentBasis} = this.props;

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
              identifier={rentBasis.id}
            />
          }
        />
        {isEditMode
          ? (
            <RentCriteriaEdit criteria={rentBasis} />
          ) : (
            <RentCriteriaReadonly
              attributes={attributes}
              rentBasis={rentBasis}
            />
          )
        }
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    editedCriteria: getRentCriteriaFormValues(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
    rentBasis: getRentBasis(state),
  };
};

export default flowRight(
  withRouter,
  connect(
    mapStateToProps,
    {
      editRentCriteria,
      fetchAttributes,
      fetchSingleRentBasis,
      hideEditMode,
      initializeRentCriteria,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(RentBasisPage);
