// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';

import Search from './search/Search';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {
  fetchPlotApplicationsList,
} from '$src/plotApplications/actions';
import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import {LIST_TABLE_PAGE_SIZE} from '$src/constants';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {getRouteById, Routes} from '$src/root/routes';
import {Methods, PermissionMissingTexts} from '$src/enums';
import PageContainer from '$components/content/PageContainer';
import {withPlotApplicationsAttributes} from '$components/attributes/PlotApplicationsAttributes';
import TableWrapper from '$components/table/TableWrapper';
import CreatePlotApplicationsModal from './CreatePlotApplicationsModal';
import {
  isMethodAllowed,
  getUrlParams,
  setPageTitle,
} from '$util/helpers';
import {
  getIsFetching,
  getPlotApplicationsList,
} from '$src/plotApplications/selectors';
import type {Attributes, Methods as MethodsType} from '$src/types';

type Props = {
  history: Object,
  plotApplicationsMethods: MethodsType,
  plotApplicationsAttributes: Attributes,
  isFetching: boolean,
  fetchPlotApplicationsList: Function,
  location: Object,
  receiveTopNavigationSettings: Function,
  plotApplicationsListData: Object,
}

type State = {
  isModalOpen: boolean,
}

class PlotApplicationsListPage extends PureComponent<Props, State> {
  _isMounted: boolean

  state = {
    isModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
    } = this.props;
    setPageTitle('Tonttihakemukset');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PLOT_APPLICATIONS),
      pageTitle: 'Tonttihakemukset',
      showSearch: false,
    });

    this.search();
  }

  hideCreatePlotApplicationsModal = () => {
    this.setState({isModalOpen: false});
  }

  handleCreatePlotApplications = () => {
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.PLOT_APPLICATIONS)}/1`,
      search: search,
    });
  }

  search = () => {
    const {fetchPlotApplicationsList, location: {search}} = this.props;
    const searchQuery = getUrlParams(search);
    const page = searchQuery.page ? Number(searchQuery.page) : 1;

    if(page > 1) {
      searchQuery.offset = (page - 1) * LIST_TABLE_PAGE_SIZE;
    }
    
    searchQuery.limit = LIST_TABLE_PAGE_SIZE;
    delete searchQuery.page;

    fetchPlotApplicationsList(searchQuery);
  }
  openModalhandleCreatePlotApplication = () => {
    this.setState({isModalOpen: true});
  }

  render() {
    const {
      isFetching,
      plotApplicationsMethods,
      plotApplicationsAttributes,
      plotApplicationsListData,
    } = this.props;

    const {
      isModalOpen,
    } = this.state;

    console.log('methods', plotApplicationsMethods);
    console.log('attributes', plotApplicationsAttributes);
    console.log('list', plotApplicationsListData);

    if(!plotApplicationsMethods && !plotApplicationsAttributes) return null;

    if(!isMethodAllowed(plotApplicationsMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_SEARCH} /></PageContainer>;

    return (
      <PageContainer>
        <Authorization allow={isMethodAllowed(plotApplicationsMethods, Methods.POST)}>
          <CreatePlotApplicationsModal
            isOpen={isModalOpen}
            onClose={this.hideCreatePlotApplicationsModal}
            onSubmit={this.handleCreatePlotApplications}
          />
        </Authorization>
        <Row>
          <Column small={12} large={4}>
            <Authorization allow={isMethodAllowed(plotApplicationsMethods, Methods.POST)}>
              <AddButtonSecondary
                className='no-top-margin'
                label='Luo tonttihakemus'
                onClick={this.openModalhandleCreatePlotApplication}
              />
            </Authorization>
          </Column>
          <Column small={12} large={8}>
            <Search
              isSearchInitialized={false}
              onSearch={()=>{}}
              states={[]}
            />
          </Column>
        </Row>

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
          }
        </TableWrapper>
      </PageContainer>
    );
  }
}

export default flowRight(
  withRouter,
  withPlotApplicationsAttributes,
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        plotApplicationsListData: getPlotApplicationsList(state),
      };
    },
    {
      receiveTopNavigationSettings,
      fetchPlotApplicationsList,
    }
  ),
)(PlotApplicationsListPage);
