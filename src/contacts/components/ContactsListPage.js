// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableWrapper from '$components/table/TableWrapper';
import {
  fetchContacts,
  fetchAttributes,
  initializeContactForm,
} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '../enums';
import {getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$src/util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getContactList, getIsFetching} from '../selectors';

import type {Attributes, ContactList} from '../types';
import type {RootState} from '../../root/types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  contactList: ContactList,
  fetchAttributes: Function,
  fetchContacts: Function,
  initializeContactForm: Function,
  initialize: Function,
  isFetching: boolean,
  location: Object,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  activePage: number,
  isSearchInitialized: boolean,
}

class ContactListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    isSearchInitialized: false,
  }

  search: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {attributes, fetchAttributes, initialize, receiveTopNavigationSettings} = this.props;
    const {location: {query}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    if(isEmpty(attributes)) {
      fetchAttributes();
    }

    this.search();

    const page = query.page ? Number(query.page) : 1;
    this.setState({activePage: page});

    const setSearchFormReadyFlag = () => {
      this.setState({isSearchInitialized: true});
    };

    const initializeSearchForm = async() => {
      try {
        const searchQuery = {...query};
        delete searchQuery.page;

        await initialize(FormNames.SEARCH, searchQuery);
        setSearchFormReadyFlag();
      } catch(e) {
        console.error(`Failed to initialize search form with error, ${e}`);
      }
    };

    initializeSearchForm();
  }

  componentDidUpdate(prevProps) {
    const {location: {query, search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;

    if(currentSearch !== prevSearch) {
      this.search();

      const searchQuery = {...query};
      delete searchQuery.page;

      if(!Object.keys(searchQuery).length) {
        initialize(FormNames.SEARCH, {});
      }
    }
  }

  handleCreateButtonClick = () => {
    const {initializeContactForm} = this.props;
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    initializeContactForm({});

    return router.push({
      pathname: getRouteById('newContact'),
      query,
    });
  }

  handleSearchChange = (query: any) => {
    const {router} = this.context;
    this.setState({activePage: 1});

    return router.push({
      pathname: getRouteById('contacts'),
      query,
    });
  }

  search = () => {
    const {fetchContacts, router: {location: {query}}} = this.props;

    const searchQuery = {...query};
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * PAGE_SIZE;
    }

    searchQuery.limit = PAGE_SIZE;
    fetchContacts(getSearchQuery(searchQuery));
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
    const {location: {query}} = this.props;

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});

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
    return Math.ceil(count/PAGE_SIZE);
  }

  render() {
    const {attributes, contactList, isFetching} = this.props;
    const {activePage, isSearchInitialized} = this.state;
    const typeOptions = getAttributeFieldOptions(attributes, 'type');

    const count = this.getContactCount(contactList);
    const contacts = this.getContacts(contactList);
    const maxPage = this.getContactMaxPage(contactList);

    return(
      <PageContainer>
        <Row>
          <Column small={12} large={6}>
            <AddButtonSecondary
              className='no-top-margin'
              label='Luo asiakas'
              onClick={this.handleCreateButtonClick}
            />
          </Column>
          <Column small={12} large={6}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
            />
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6}></Column>
          <Column small={12} medium={6}>
            <TableFilters
              amountText={isFetching ? 'Ladataan...' : `Löytyi ${count} kpl`}
              filterOptions={[]}
              filterValue={[]}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={isFetching} /></LoaderWrapper>
          }
          <SortableTable
            columns={[
              {key: 'type', text: 'Asiakastyyppi', renderer: (val) => getLabelOfOption(typeOptions, val)},
              {key: 'first_name', text: 'Etunimi'},
              {key: 'last_name', text: 'Sukunimi'},
              {key: 'national_identification_number', text: 'Henkilötunnus'},
              {key: 'name', text: 'Yrityksen nimi'},
              {key: 'business_id', text: 'Y-tunnus'},
            ]}
            data={contacts}
            onRowClick={this.handleRowClick}
          />
          <Pagination
            activePage={activePage}
            maxPage={maxPage}
            onPageClick={this.handlePageClick}
          />
        </TableWrapper>
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
      initialize,
      initializeContactForm,
      receiveTopNavigationSettings,
    },
  ),
)(ContactListPage);
