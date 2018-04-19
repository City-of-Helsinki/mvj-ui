// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getContactList, getIsFetching} from '../selectors';
import {
  fetchContacts,
  fetchAttributes,
  initializeContactForm,
} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$src/util/helpers';

import type {Attributes, ContactList} from '../types';
import type {RootState} from '../../root/types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  contactList: ContactList,
  fetchAttributes: Function,
  fetchContacts: Function,
  initializeContactForm: Function,
  isFetching: boolean,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  activePage: number,
}

class ContactListPage extends Component {
  props: Props
  state: State = {
    activePage: 1,
  }

  search: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchAttributes, fetchContacts, receiveTopNavigationSettings} = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    const page = Number(query.page);

    if(!page || !isNumber(page) || query.page <= 1) {
      this.setState({activePage: 1});
    } else {
      this.setState({activePage: page});
      query.offset = (page - 1) * PAGE_SIZE;
    }
    query.limit = PAGE_SIZE;

    fetchContacts(getSearchQuery(query));
    delete query.limit;

    fetchAttributes();
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
  }

  handleCreateButtonClick = () => {
    const {initializeContactForm} = this.props;
    const {router} = this.context;

    initializeContactForm({});

    return router.push({
      pathname: getRouteById('newcontact'),
    });
  }

  handleSearchChange = (query: any) => {
    const {fetchContacts} = this.props;
    const {router} = this.context;

    query.limit = PAGE_SIZE;
    fetchContacts(getSearchQuery(query));

    this.setState({activePage: 1});
    delete query.limit;
    delete query.offset;
    delete query.page;

    return router.push({
      pathname: getRouteById('contacts'),
      query,
    });
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('contacts')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {fetchContacts, router: {location: {query}}} = this.props;

    if(page > 1) {
      query.page = page;
      query.offset = (page - 1) * PAGE_SIZE;
    } else {
      query.page = undefined;
      query.offset = undefined;
    }
    query.limit = PAGE_SIZE;

    fetchContacts(getSearchQuery(query));

    this.setState({activePage: page});
    delete query.limit;
    delete query.offset;

    return router.push({
      pathname: getRouteById('contacts'),
      query,
    });
  }

  getContactCount = (contactList: ContactList) => {
    return get(contactList, 'count', 0);
  }

  getContacts = (contactList: ContactList) => {
    return get(contactList, 'results', []);
  }

  getContactMaxPage = (contactList: ContactList) => {
    const count = this.getContactCount(contactList);
    if(!count) {
      return 0;
    }
    else {
      return Math.ceil(count/PAGE_SIZE);
    }
  }

  render() {
    const {attributes, contactList, isFetching} = this.props;
    const {activePage} = this.state;
    const typeOptions = getAttributeFieldOptions(attributes, 'type');

    const count = this.getContactCount(contactList);
    const contacts = this.getContacts(contactList);
    const maxPage = this.getContactMaxPage(contactList);

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
              title={`Löytyi ${count} kpl`}
            />
            <Table
              data={contacts}
              dataKeys={[
                {key: 'type', label: 'Asiakastyyppi', renderer: (val) => getLabelOfOption(typeOptions, val)},
                {key: 'first_name', label: 'Etunimi'},
                {key: 'last_name', label: 'Sukunimi'},
                {key: 'national_identification_number', label: 'Henkilötunnus'},
                {key: 'name', label: 'Yrityksen nimi'},
                {key: 'business_id', label: 'Y-tunnus'},
              ]}
              onRowClick={this.handleRowClick}
            />
            <Pagination
              activePage={activePage}
              maxPage={maxPage}
              onPageClick={(page) => this.handlePageClick(page)}
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
        attributes: getAttributes(state),
        contactList: getContactList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchAttributes,
      fetchContacts,
      initializeContactForm,
      receiveTopNavigationSettings,
    },
  ),
)(ContactListPage);
