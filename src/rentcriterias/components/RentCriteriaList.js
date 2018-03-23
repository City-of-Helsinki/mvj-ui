// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {fetchRentCriterias, initializeRentCriteria} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getIsFetching, getRentCriteriasList} from '../selectors';
import {formatDateObj, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {purposeOptions} from '../constants';
import {getRouteById} from '$src/root/routes';
import Button from '$components/button/Button';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';

type Props = {
  fetchRentCriterias: Function,
  initializeRentCriteria: Function,
  isFetching: boolean,
  receiveTopNavigationSettings: Function,
  rentcriterias: Array<Object>,
  router: Object,
}

class RentCriteriaList extends Component {
  props: Props

  static contextTypes = {
    router: PropTypes.object,
  };

  search: any

  componentWillMount() {
    const {fetchRentCriterias, receiveTopNavigationSettings} = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentcriterias'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    fetchRentCriterias(getSearchQuery(query));
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
  }

  handleSearchChange = (query) => {
    const {fetchRentCriterias} = this.props;
    const {router} = this.context;
    const search = getSearchQuery(query);
    fetchRentCriterias(search);

    return router.push({
      pathname: getRouteById('rentcriterias'),
      query,
    });
  }

  handleCreateButtonClick = () => {
    const {initializeRentCriteria} = this.props;
    const {router} = this.context;

    initializeRentCriteria({
      decisions: [''],
      prices: [{}],
      real_estate_ids: [''],
    });

    return router.push({
      pathname: getRouteById('newrentcriteria'),
    });

  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentcriterias')}/${id}`,
      query,
    });
  };

  render() {
    const {isFetching, rentcriterias} = this.props;

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              label='Luo vuokrausperuste'
              onClick={() => this.handleCreateButtonClick()}
              title='Luo vuokrausperuste'
            />
          }
          searchComponent={
            <Search
              ref={(input) => { this.search = input; }}
              onSearch={(query) => this.handleSearchChange(query)}
            />
          }
        />

        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <div>
            <TableControllers
              title={`Viimeksi muokattuja`}
            />
            <Table
              amount={rentcriterias.length}
              data={rentcriterias}
              dataKeys={[
                {key: 'real_estate_ID', label: 'Kiinteistötunnus'},
                {key: 'purpose', label: 'Pääkäyttötarkoitus', renderer: (val) => val ? getLabelOfOption(purposeOptions, val) : '-'},
                {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
              ]}
              onRowClick={this.handleRowClick}
            />
          </div>
        }
      </PageContainer>
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
      initializeRentCriteria,
      receiveTopNavigationSettings,
    },
  ),
)(RentCriteriaList);
