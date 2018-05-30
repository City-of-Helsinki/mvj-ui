// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import LeaseItem from './LeaseItem';
import PageContainer from '$components/content/PageContainer';
import {fetchSingleInfillDevelopment} from '$src/infillDevelopment/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {formatDate} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getCurrentInfillDevelopment} from '$src/infillDevelopment/selectors';

import type {InfillDevelopment} from '$src/infillDevelopment/types';

type Props = {
  currentInfillDevelopment: InfillDevelopment,
  fetchSingleInfillDevelopment: Function,
  params: Object,
  receiveTopNavigationSettings: Function,
  router: Object,
}

class InfillDevelopmentPage extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      fetchSingleInfillDevelopment,
      params: {infillDevelopmentId},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('infillDevelopment'),
      pageTitle: 'Täydennysrakentaminen',
      showSearch: false,
    });

    fetchSingleInfillDevelopment(infillDevelopmentId);
  }

  handleControlButtonBarBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('infillDevelopment')}`,
      query,
    });
  }

  handleControlButtonCancel = () => {

  }

  handleControlButtonEdit = () => {
    alert('TODO: Edit infill development');
  }

  handleControlButtonSave = () => {

  }

  render() {
    const {currentInfillDevelopment, params: {infillDevelopmentId}} = this.props;
    const leases = get(currentInfillDevelopment, 'leases', []);

    return (
      <PageContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCancelDisabled={false}
              isEditDisabled={false}
              isEditMode={false}
              isSaveDisabled={true}
              onCancelClick={this.handleControlButtonCancel}
              onEditClick={this.handleControlButtonEdit}
              onSaveClick={this.handleControlButtonSave}
              showCommentButton={false}
            />
          }
          infoComponent={<h1>{infillDevelopmentId}</h1>}
          onBack={this.handleControlButtonBarBack}
        />
        <ContentContainer>
          <GreenBox>
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Asemakaavan nro</FormFieldLabel>
                <p>{currentInfillDevelopment.station_code_number || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Käsittelyvaihe</FormFieldLabel>
                <p>{currentInfillDevelopment.state || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Käsittelyvaiheen päätöslaji</FormFieldLabel>
                <p>{currentInfillDevelopment.decision_type || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Kaavan vaihe pvm</FormFieldLabel>
                <p>{formatDate(currentInfillDevelopment.state_date) || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Vastuuhenkilö</FormFieldLabel>
                <p>{currentInfillDevelopment.responsible_person || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Neuvotteluvaihe</FormFieldLabel>
                <p>{currentInfillDevelopment.nagotiation_state || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Vuokrasopimuksen muutos pvm</FormFieldLabel>
                <p>{formatDate(currentInfillDevelopment.change_of_lease_date) || '-'}</p>
              </Column>
            </Row>
            {!!leases.length &&
              leases.map((lease) =>
                <LeaseItem
                  key={lease.id}
                  id={lease.id}
                  leaseMock={lease}
                />
              )
            }
          </GreenBox>
        </ContentContainer>
      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        currentInfillDevelopment: getCurrentInfillDevelopment(state),
      };
    },
    {
      fetchSingleInfillDevelopment,
      receiveTopNavigationSettings,
    },
  ),
  withRouter,
)(InfillDevelopmentPage);
