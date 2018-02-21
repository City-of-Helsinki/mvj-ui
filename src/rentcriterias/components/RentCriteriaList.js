// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {fetchRentCriterias} from '../actions';
import {getIsFetching, getRentCriteriasList} from '../selectors';

type Props = {
  fetchRentCriterias: Function,
  isFetching: boolean,
  rentcriterias: Object,
}

class RentCriteriaList extends Component {
  props: Props

  render() {
    return (
      <div className='rent-criteria-list'>
        <Row>
          <Column>
            <h1>Vuokrauksen perusteet</h1>
          </Column>
        </Row>
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        rentcriterias: getRentCriteriasList(state),
      };
    },
    {
      fetchRentCriterias,
    },
  ),
)(RentCriteriaList);
