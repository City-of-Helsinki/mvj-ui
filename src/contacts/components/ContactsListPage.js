// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';
import {getRouteById} from '$src/root/routes';
import {getContactList, getIsFetching} from '../selectors';
import {fetchContacts} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getSearchQuery} from '$src/util/helpers';

import type {ContactList} from '../types';
import type {RootState} from '../../root/types';

type Props = {
  contacts: ContactList,
  fetchContacts: Function,
  isFetching: boolean,
  receiveTopNavigationSettings: Function,
  router: Object,
}

class ContactListPage extends Component {
  props: Props

  search: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchContacts, receiveTopNavigationSettings} = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    fetchContacts(getSearchQuery(query));
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
  }

  handleCreateButtonClick = () => {
    // const {initializeRentCriteria} = this.props;
    const {router} = this.context;

    // initializeRentCriteria({
    //   decisions: [''],
    //   prices: [{}],
    //   real_estate_ids: [''],
    // });

    return router.push({
      pathname: getRouteById('newcontact'),
    });
  }

  handleSearchChange = (query: any) => {
    const {fetchContacts} = this.props;
    const {router} = this.context;

    fetchContacts(getSearchQuery(query));

    return router.push({
      pathname: getRouteById('contacts'),
      query,
    });
  }

  handleRowClick = () => {
    console.log('click');
  }

  render() {
    const {contacts, isFetching} = this.props;
    console.log(contacts);
    return(
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              label='Luo uusi asiakas'
              onClick={() => this.handleCreateButtonClick()}
              title='Luo uusi asiakas'
            />
          }
          searchComponent={
            <Search
              ref={(input) => { this.search = input; }}
              onSearch={(query) => this.handleSearchChange(query)}
            />
          }
        />


        {isFetching &&
          <Row>
            <Column>
              <div className='loader__wrapper'><Loader isLoading={!!isFetching} /></div>
            </Column>
          </Row>
        }

        {!isFetching &&
          <div>
            <TableControllers
              title={`Löytyi ${contacts.length} kpl`}
            />
            <Table
              amount={contacts.length}
              data={contacts}
              dataKeys={[
                {key: 'first_name', label: 'Etunimi'},
                {key: 'last_name', label: 'Sukunimi'},
                {key: 'business_name', label: 'Yritys'},
                {key: 'address', label: 'Osoite'},
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
    (state: RootState) => {
      return {
        contacts: getContactList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchContacts,
      receiveTopNavigationSettings,
    },
  ),
)(ContactListPage);
