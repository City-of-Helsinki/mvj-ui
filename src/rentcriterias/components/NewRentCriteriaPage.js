// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import AddRentCriteriaForm from './forms/AddRentCriteriaForm';

import {getRouteById} from '../../root/routes';
import {setTopNavigationSettings} from '../../components/topNavigation/actions';
import Button from '../../components/button/Button';

type Props = {
  setTopNavigationSettings: Function,
}

class NewRentCriteriaPage extends Component {
  props: Props

  static contextTypes = {
    router: Object,
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
      <div className='rent-criteria-page'>
        <div className="rent-criteria-page__content">
          <h1>Uusi vuokrausperuste</h1>
          <div className="divider" />
          <AddRentCriteriaForm />
        </div>
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
      </div>
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
