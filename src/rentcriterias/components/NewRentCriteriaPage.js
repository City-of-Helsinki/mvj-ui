// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

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
        <h1>Uusi vuokrausperuste</h1>
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
