// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import RentBasisEdit from './RentBasisEdit';
import RentBasisInfo from './RentBasisInfo';
import RentBasisReadonly from './RentBasisReadonly';
import {
  editRentBasis,
  fetchAttributes,
  fetchSingleRentBasis,
  hideEditMode,
  initializeRentBasis,
  showEditMode,
} from '../actions';
import {
  getAttributes,
  getIsEditMode,
  getIsFetching,
  getIsFormValid,
  getRentBasis,
  getRentBasisFormTouched,
  getRentBasisFormValues,
} from '../selectors';
import {getContentCopiedRentBasis, getContentRentBasis} from '../helpers';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById} from '$src/root/routes';

import type {Attributes, RentBasis} from '../types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  editedRentBasis: Object,
  editRentBasis: Function,
  fetchAttributes: Function,
  fetchSingleRentBasis: Function,
  hideEditMode: Function,
  initializeRentBasis: Function,
  isEditMode: boolean,
  isFetching: boolean,
  isFormTouched: boolean,
  isFormValid: boolean,
  params: Object,
  receiveTopNavigationSettings: Function,
  rentBasisData: RentBasis,
  router: Object,
  showEditMode: Function,
}

type State = {
  isCancelModalOpen: boolean,
}

class RentBasisPage extends Component {
  props: Props

  state: State = {
    isCancelModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      fetchAttributes,
      fetchSingleRentBasis,
      hideEditMode,
      params: {rentBasisId},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentbasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    hideEditMode();

    fetchSingleRentBasis(rentBasisId);
    fetchAttributes();
  }

  copyRentBasis = () => {
    const {initializeRentBasis, rentBasisData, router} = this.props;
    const rentBasis = getContentCopiedRentBasis(rentBasisData);

    initializeRentBasis(rentBasis);

    return router.push({
      pathname: getRouteById('newrentbasis'),
    });
  }

  editRentBasis = () => {
    const {editRentBasis, editedRentBasis} = this.props;
    editRentBasis(editedRentBasis);
  }

  handleCancel = () => {
    const {hideEditMode} = this.props;

    this.setState({isCancelModalOpen: false});
    hideEditMode();
  }

  showEditMode = (rentBasis: Object) => {
    const {initializeRentBasis, showEditMode} = this.props;

    initializeRentBasis(rentBasis);
    showEditMode();
  }

  render() {
    const {
      attributes,
      hideEditMode,
      isEditMode,
      isFetching,
      isFormTouched,
      isFormValid,
      rentBasisData,
    } = this.props;

    const {isCancelModalOpen} = this.state;

    const rentBasis = getContentRentBasis(rentBasisData);

    if(isFetching) {
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <ConfirmationModal
          confirmButtonLabel='Vahvista'
          isOpen={isCancelModalOpen}
          label='Haluatko varmasti peruuttaa muutokset?'
          onCancel={() => this.setState({isCancelModalOpen: false})}
          onClose={() => this.setState({isCancelModalOpen: false})}
          onSave={this.handleCancel}
          title='Peruuta muutokset'
        />
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={!isFormValid}
              onCancelClick={isFormTouched ? () => this.setState({isCancelModalOpen: true}) : hideEditMode}
              onCopyClick={this.copyRentBasis}
              onEditClick={() => this.showEditMode(rentBasis)}
              onSaveClick={this.editRentBasis}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={
            <RentBasisInfo
              identifier={rentBasis.id}
            />
          }
        />
        {isEditMode
          ? (
            <RentBasisEdit
              attributes={attributes}
            />
          ) : (
            <RentBasisReadonly
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
    editedRentBasis: getRentBasisFormValues(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
    isFormTouched: getRentBasisFormTouched(state),
    isFormValid: getIsFormValid(state),
    rentBasisData: getRentBasis(state),
  };
};

export default flowRight(
  withRouter,
  connect(
    mapStateToProps,
    {
      editRentBasis,
      fetchAttributes,
      fetchSingleRentBasis,
      hideEditMode,
      initializeRentBasis,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(RentBasisPage);
