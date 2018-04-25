// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {createRentBasis, fetchAttributes} from '../actions';
import {getAttributes, getIsFormValid, getRentBasisFormTouched, getRentBasisFormValues} from '../selectors';
import {getRouteById} from '$src/root/routes';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import PageContainer from '$components/content/PageContainer';
import RentBasisForm from './forms/RentBasisForm';

import type {Attributes} from '../types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  createRentBasis: Function,
  editedRentBasis: ?Object,
  fetchAttributes: Function,
  isFormTouched: boolean,
  isFormValid: boolean,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  isCancelModalOpen: boolean,
}

class NewRentBasisPage extends Component {
  props: Props

  state: State = {
    isCancelModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchAttributes, receiveTopNavigationSettings} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentbasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    fetchAttributes();
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentbasis')}`,
      query,
    });
  }

  handleCancel = () => {
    const {router} = this.context;

    return router.push({
      pathname: getRouteById('rentbasis'),
    });
  }

  handleSave = () => {
    const {createRentBasis, editedRentBasis} = this.props;

    createRentBasis(editedRentBasis);
  }

  render() {
    const {attributes, isFormTouched, isFormValid} = this.props;
    const {isCancelModalOpen} = this.state;

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
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={!isFormValid}
              onCancelClick={isFormTouched ? () => this.setState({isCancelModalOpen: true}) : this.handleCancel}
              onSaveClick={this.handleSave}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={
            <h1>Uusi vuokrausperuste</h1>
          }
          onBack={this.handleBack}
        />
        <ContentContainer>
          <GreenBoxEdit>
            <RentBasisForm
              attributes={attributes}
            />
          </GreenBoxEdit>
        </ContentContainer>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    editedRentBasis: getRentBasisFormValues(state),
    isFormTouched: getRentBasisFormTouched(state),
    isFormValid: getIsFormValid(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      createRentBasis,
      fetchAttributes,
      receiveTopNavigationSettings,
    },
  ),
)(NewRentBasisPage);
