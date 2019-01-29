// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
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
  initializeContactForm,
} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import {PermissionMissingTexts} from '$src/enums';
import {ContactFieldPaths, FormNames} from '$src/contacts/enums';
import {
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
} from '$src/util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getContactList, getIsFetching} from '../selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {ContactList} from '../types';
import type {Attributes, Methods} from '$src/types';
import type {RootState} from '$src/root/types';

const getContactCount = (contactList: ContactList) => get(contactList, 'count', 0);

const getContacts = (contactList: ContactList) => get(contactList, 'results', []);

const getContactMaxPage = (contactList: ContactList) => {
  const count = getContactCount(contactList);

  return Math.ceil(count/LIST_TABLE_PAGE_SIZE);
};

type Props = {
  contactAttributes: Attributes,
  contactList: ContactList,
  contactMethods: Methods, // get via withCommonAttributes HOC
  fetchContacts: Function,
  history: Object,
  initializeContactForm: Function,
  initialize: Function,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // get via withCommonAttributes HOC
  location: Object,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  activePage: number,
  contactAttributes: Attributes,
  contactList: ContactList,
  contacts: Array<Object>,
  count: number,
  isSearchInitialized: boolean,
  maxPage: number,
  typeOptions: Array<Object>,
}

class ContactListPage extends Component<Props, State> {
  state = {
    activePage: 1,
    contactAttributes: {},
    contactList: {},
    contacts: [],
    count: 0,
    isSearchInitialized: false,
    maxPage: 0,
    typeOptions: [],
  }

  search: any

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.contactAttributes !== state.contactAttributes) {
      newState.contactAttributes = props.contactAttributes;
      newState.typeOptions = getFieldOptions(props.contactAttributes, ContactFieldPaths.TYPE);
    }

    if(props.contactList !== state.contactList) {
      newState.contactList = props.contactList;
      newState.count = getContactCount(props.contactList);
      newState.contacts = getContacts(props.contactList);
      newState.maxPage = getContactMaxPage(props.contactList);
    }

    return newState;
  }

  componentDidMount() {
    const {initialize, receiveTopNavigationSettings} = this.props;
    const {location: {search}} = this.props;
    const query = getUrlParams(search);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.CONTACTS),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

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
    const {location: {search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      this.search();

      delete searchQuery.page;

      if(!Object.keys(searchQuery).length) {
        initialize(FormNames.SEARCH, {});
      }
    }
  }

  handleCreateButtonClick = () => {
    const {initializeContactForm} = this.props;
    const {history, location: {search}} = this.props;

    initializeContactForm({});

    return history.push({
      pathname: getRouteById(Routes.CONTACT_NEW),
      search: search,
    });
  }

  handleSearchChange = (query: any) => {
    const {history} = this.props;

    this.setState({activePage: 1});

    return history.push({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(query),
    });
  }

  search = () => {
    const {fetchContacts, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }

    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    fetchContacts(getSearchQuery(searchQuery));
  }

  handleRowClick = (id) => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.CONTACTS)}/${id}`,
      search: search,
    });
  };

  handlePageClick = (page: number) => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    if(page > 1) {
      query.page = page;
    } else {
      delete query.page;
    }

    this.setState({activePage: page});

    return history.push({
      pathname: getRouteById(Routes.CONTACTS),
      search: getSearchQuery(query),
    });
  }

  getColumns = () => {
    const {contactAttributes} = this.props;
    const {typeOptions} = this.state;
    const columns = [];

    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.TYPE)) {
      columns.push({key: 'type', text: 'Asiakastyyppi', renderer: (val) => getLabelOfOption(typeOptions, val)});
    }
    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.FIRST_NAME)) {
      columns.push({key: 'first_name', text: 'Etunimi'});
    }
    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.LAST_NAME)) {
      columns.push({key: 'last_name', text: 'Sukunimi'});
    }
    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.NATIONAL_IDENTIFICATION_NUMBER)) {
      columns.push({key: 'national_identification_number', text: 'Henkilötunnus'});
    }
    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.NAME)) {
      columns.push({key: 'name', text: 'Yrityksen nimi'});
    }
    if(isFieldAllowedToRead(contactAttributes, ContactFieldPaths.BUSINESS_ID)) {
      columns.push({key: 'business_id', text: 'Y-tunnus'});
    }

    return columns;
  }

  render() {
    const {contactMethods, isFetching, isFetchingCommonAttributes} = this.props;
    const {
      activePage,
      contacts,
      count,
      isSearchInitialized,
      maxPage,
    } = this.state;
    const columns = this.getColumns();

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!contactMethods.GET) return <PageContainer><AuthorizationError text={PermissionMissingTexts.CONTACT} /></PageContainer>;

    return(
      <PageContainer>
        <Row>
          <Column small={12} large={6}>
            <Authorization allow={contactMethods.POST}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo asiakas'
                onClick={this.handleCreateButtonClick}
              />
            </Authorization>
          </Column>
          <Column small={12} large={6}>
            <Search
              isSearchInitialized={isSearchInitialized}
              onSearch={this.handleSearchChange}
            />

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
            columns={columns}
            data={contacts}
            listTable
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
  withCommonAttributes,
  withRouter,
  connect(
    (state: RootState) => {
      return {
        contactList: getContactList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchContacts,
      initialize,
      initializeContactForm,
      receiveTopNavigationSettings,
    },
  ),
)(ContactListPage);
