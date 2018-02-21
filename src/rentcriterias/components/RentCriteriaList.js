// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {fetchRentCriterias} from '../actions';
import {getIsFetching, getRentCriteriasList} from '../selectors';
import {formatDateObj, getLabelOfOption} from '../../util/helpers';
import {purposeOptions} from '../constants';
import Loader from '../../components/loader/Loader';
import Table from '../../components/table/Table';

type Props = {
  fetchRentCriterias: Function,
  isFetching: boolean,
  rentcriterias: Array<Object>,
}

class RentCriteriaList extends Component {
  props: Props

  componentWillMount() {
    const {fetchRentCriterias} = this.props;
    fetchRentCriterias();
  }

  render() {
    const {isFetching, rentcriterias} = this.props;

    return (
      <div className='rent-criteria-list'>
        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <Row>
            <Column>
              <Table
                amount={rentcriterias.length}
                data={rentcriterias}
                dataKeys={[
                  {key: 'real_estate_ID', label: 'Kiinteistötunnus'},
                  {key: 'purpose', label: 'Pääkäyttötarkoitus', renderer: (val) => val ? getLabelOfOption(purposeOptions, val) : '-'},
                  {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                  {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                ]}
                onRowClick={(item) => console.log(item)}
              />
            </Column>
          </Row>

        }
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
