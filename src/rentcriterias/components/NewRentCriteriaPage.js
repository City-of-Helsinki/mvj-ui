// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import AddRentCriteriaForm from './forms/AddRentCriteriaForm';

import {setTopNavigationSettings} from '../../components/topNavigation/actions';

type Props = {
  setTopNavigationSettings: Function,
}

class NewRentCriteriaPage extends Component {
  props: Props

  componentWillMount() {
    const {setTopNavigationSettings} = this.props;
    setTopNavigationSettings({
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
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
