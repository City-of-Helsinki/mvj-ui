// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import EditRentCriteriaForm from './forms/EditRentCriteriaForm';

import {getRouteById} from '../../root/routes';
import {setTopNavigationSettings} from '../../components/topNavigation/actions';
import Button from '../../components/button/Button';
import ContentContainer from '../../components/content/ContentContainer';
import GreenBoxEdit from '../../components/content/GreenBoxEdit';
import PageContainer from '../../components/content/PageContainer';

type Props = {
  setTopNavigationSettings: Function,
}

class NewRentCriteriaPage extends Component {
  props: Props

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {setTopNavigationSettings} = this.props;
    setTopNavigationSettings({
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });
  }

  handleCancel = () => {
    const {router} = this.context;
    return router.push({
      pathname: getRouteById('rentcriterias'),
    });
  }

  render() {
    return (
      <PageContainer>
        <ContentContainer>
          <h1>Uusi vuokrausperuste</h1>
          <div className="divider" />
          <GreenBoxEdit>
            <EditRentCriteriaForm
              initialValues={{
                decisions: [''],
                prices: [{}],
                real_estate_ids: [''],
              }}
            />
          </GreenBoxEdit>
          <div className="button-wrapper">
            <Button
              className="button-red"
              onClick={() => this.handleCancel()}
              text="Kumoa"
            />
            <Button
              className="button-green"
              onClick={() => alert('TODO: Tallenna uusi vuokraperuste')}
              text="Tallenna"
            />
          </div>
        </ContentContainer>
      </PageContainer>

    );
  }
}

export default flowRight(
  connect(
    null,
    {
      setTopNavigationSettings,
    },
  ),
)(NewRentCriteriaPage);
