// @flow
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import ExternalLink from '$components/links/ExternalLink';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import IconRadioButtons from '$components/button/IconRadioButtons';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import MapIcon from '$components/icons/MapIcon';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import Search from './search/Search';
import SortableTable from '$components/table/SortableTable';
import TableFilters from '$components/table/TableFilters';
import TableFilterWrapper from '$components/table/TableFilterWrapper';
import TableWrapper from '$components/table/TableWrapper';
import TableIcon from '$components/icons/TableIcon';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import VisualisationTypeWrapper from '$components/table/VisualisationTypeWrapper';
import {
  createProperty, 
  /* fetchPropertyList TODO */
} from '$src/property/actions';
import {getRouteById, Routes} from '$src/root/routes';
import {
  formatDate,
  getReferenceNumberLink,
  getLabelOfOption,
  setPageTitle,
} from '$util/helpers';
import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  DEFAULT_PROPERTY_STATES,
  propertyStateFilterOptions,
} from '$src/property/constants';
import type {Property} from '$src/property/types';

import AddButtonSecondary from '$components/form/AddButtonSecondary';

import properties from './dummyProperties';

const VisualizationTypes = {
  MAP: 'map',
  TABLE: 'table',
};

const visualizationTypeOptions = [
  {value: VisualizationTypes.TABLE, label: 'Taulukko', icon: <TableIcon className='icon-medium' />},
  {value: VisualizationTypes.MAP, label: 'Kartta', icon: <MapIcon className='icon-medium' />},
];

type Props = {
  createProperty: Function,
  usersPermissions: UsersPermissionsType,
  receiveTopNavigationSettings: Function,
}

type State = {
  visualizationType: string,
  propertyStates: Array<string>,
  sortKey: string,
  sortOrder: string,
}

class PropertyListPage extends PureComponent<Props, State> {

  state = {
    visualizationType: VisualizationTypes.TABLE,
    propertyStates: DEFAULT_PROPERTY_STATES,
    sortKey: DEFAULT_SORT_KEY,
    sortOrder: DEFAULT_SORT_ORDER,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
    } = this.props;
    setPageTitle('Tonttihaut');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PROPERTY),
      pageTitle: 'Tonttihaut',
      showSearch: false,
    });
  }

  handleVisualizationTypeChange = () => {

  }

  handleSearchChange = () => {

  }

  showCreateLeaseModal = () => {

  }

  handleLeaseStatesChange = () => {

  }

  getColumns = () => {
    
    const columns = [];
    const typeOptions =  [
      {
        'value': 'construction',
        'label': 'Asuntorakentaminen',
      },
      {
        'value': 'company_property',
        'label': 'Yritystontit',
      },
      {
        'value': 'small_housing',
        'label': 'Pientalotontit',
      },
    ];

    const subTypeOptions =  [
      {
        'value': 'price_n_quality',
        'label': 'Hinta- ja laatukilpailu',
      },
      {
        'value': 'price',
        'label': 'Hintakilpailu',
      },
      {
        'value': 'general',
        'label': 'Yleinen asuntotonttien varauskierros',
      },
      {
        'value': 'consecutive',
        'label': 'Jatkuva haku',
      },
    ];

    const stepOptions =  [
      {
        'value': 'in_handling',
        'label': 'käsittelyssä',
      },
    ];

    columns.push({
      key: 'property_search',
      text: 'Haku',
      sortable: false,
    });

    columns.push({
      key: 'type',
      text: 'Hakutyyppi',
      sortable: false,
      renderer: (val) => getLabelOfOption(typeOptions, val),
    });
  
    columns.push({
      key: 'subtype',
      text: 'Haun alatyyppi',
      sortable: false,
      renderer: (val) => getLabelOfOption(subTypeOptions, val),
    });

    columns.push({
      key: 'step',
      text: 'Haun vaihe',
      sortable: false,
      renderer: (val) => getLabelOfOption(stepOptions, val),
    });

    columns.push({
      key: 'start_date', 
      text: 'Alkupvm', 
      sortable: false,
      renderer: (val) => formatDate(val),
    });

    columns.push({
      key: 'end_date', 
      text: 'Loppupvm', 
      sortable: false,
      renderer: (val) => formatDate(val),
    });
    
    columns.push({
      key: 'latest_decicion', 
      text: 'Viimeisin päätös', 
      sortable: false,
      renderer: (id) => id 
        ? <ExternalLink href={getReferenceNumberLink(id)} text={id}/>
        : null,
    });
    
    columns.push({
      key: 'id', 
      text: 'Kohteen tunnus', 
      sortable: false,
      renderer: (id) => id 
        ? <ExternalLink href={getReferenceNumberLink(id)} text={id}/>
        : null,
    });

    return columns;
  }

  handleRowClick = () => {
    // TODO 
  }

  handleSortingChange = () => {

  }

  handlePageClick = (page: number) => {
    console.log(page);
  }

  handleCreateProperty = (property: Property) => {
    const {createProperty} = this.props;
    createProperty(property);
  }

  // AUTHORIZE

  render() {
    const {
      visualizationType,
      propertyStates,
      sortKey,
      sortOrder,
    } = this.state;

    const isFetching = false;

    const columns = this.getColumns();

    return (
      <PageContainer>

        {/* AUTHORIZE */}
        <Row>
          <Column small={12} large={4}>
            <AddButtonSecondary
              className='no-top-margin'
              label='Luo tonttihaku'
              onClick={this.handleCreateProperty}
            />
          </Column>
          <Column small={12} large={8}>
            <Search
            />
          </Column>
        </Row>

        <TableFilterWrapper
          filterComponent={
            <TableFilters
              amountText={`Löytyi 7 kpl`}
              filterOptions={propertyStateFilterOptions}
              filterValue={propertyStates}
              onFilterChange={this.handleLeaseStatesChange}
            />
            
          }
          visualizationComponent={
            <VisualisationTypeWrapper>
              <IconRadioButtons
                legend={'Kartta/taulukko'}
                onChange={this.handleVisualizationTypeChange}
                options={visualizationTypeOptions}
                radioName='visualization-type-radio'
                value={visualizationType}
              />
            </VisualisationTypeWrapper>
          }
        />

        <TableWrapper>
          {isFetching &&
            <LoaderWrapper className='relative-overlay-wrapper'><Loader isLoading={true} /></LoaderWrapper>
          }

          {visualizationType === 'table' &&
            <Fragment>
              <SortableTable
                columns={columns}
                data={properties}
                listTable
                onRowClick={this.handleRowClick}
                onSortingChange={this.handleSortingChange}
                serverSideSorting
                showCollapseArrowColumn
                sortable
                sortKey={sortKey}
                sortOrder={sortOrder}
              />
              <Pagination
                activePage={1}
                maxPage={2}
                onPageClick={(page) => this.handlePageClick(page)}
              />
            </Fragment>
          }
        </TableWrapper>

      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      receiveTopNavigationSettings,
      createProperty,
    },
  ),
)(PropertyListPage);
