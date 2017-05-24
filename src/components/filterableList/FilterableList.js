// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import Fuse from 'fuse.js';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import filter from 'lodash/filter';
import {translate} from 'react-i18next';
import {Column, Row} from 'react-foundation';
import Select from 'react-select';

import Hero from '../hero/Hero';
import Table from '../table/Table';

const fuseOptions = {
  shouldSort: true,
  // threshold: 0.6,
  // distance: 100,
  // maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    'contact_name',
    'organization_name',
  ],
};

type Props = {
  className?: String,
  data: Array<any>,
  dataKeys: Array<any>,
  injectedControls?: Array<any>,
  isFetching: boolean,
  onRowClick: Function,
  t: Function,
};

type State = {
  items: Array<any>,
  search: string,
  filters: Object,
};

type FuseType = Object;

class FilterableList extends Component {
  props: Props;
  state: State;
  fuse: FuseType;

  constructor(props: Object) {
    super(props);

    this.fuse = new Fuse([], fuseOptions);

    this.state = {
      filters: {},
      items: [],
      search: '',
    };
  }

  componentWillReceiveProps(newProps: Object) {
    const {data} = newProps;

    this.setState({
      items: data,
    }, () => {
      this.fuse.set(data);
    });
  }

  handleSearch = (event: Object) => {
    const {target: {value}} = event;
    const {data} = this.props;

    if (value) {
      return this.setState({
        items: this.fuse.search(value),
        search: value,
      });
    }

    return this.setState({
      items: data,
      search: '',
    });
  };

  handleFilterChange = (item, filterKey) => {
    const {items, filters} = this.state;
    const {data} = this.props;
    const newFilters = Object.assign(filters, {[filterKey]: item ? item.value : ''});

    if (item && item.value) {
      const filteredItems = filter(items, (itemObj) => {
        const needles = Object.keys(newFilters).map(singleFilter => get(itemObj, singleFilter));
        return needles.indexOf(item.value) !== -1;
      });

      return this.setState({
        search: '',
        filters: newFilters,
        items: filteredItems,
      });
    }

    return this.setState({
      search: '',
      filters: newFilters,
      items: data,
    });
  };

  render() {
    const {items, filters, search} = this.state;
    const {className, dataKeys, injectedControls, isFetching, onRowClick, t} = this.props;

    return (
      <div className={classnames('applications__list', className, {'loading': isFetching})}>
        <Hero className="hero--secondary">
          <Row>
            <Column medium={6} className="applications__search">
              <label htmlFor="search">{t('search')}</label>
              <input type="text"
                     id="search"
                     value={search}
                     className="form-field__input form-field__input--search"
                     onChange={this.handleSearch}
              />
            </Column>
            <Column medium={3} className="applications__search">
              <label htmlFor="search">{t('preparer')}</label>
              <Select
                value={get(filters, 'preparer.username')}
                autoBlur={true}
                className="form-field__select"
                clearable={true}
                noResultsText={t('noResultsFound')}
                placeholder={t('select')}
                options={[
                  {value: 'preparer', label: 'Vanttu Valmistelija'},
                  {value: 'admin', label: 'Pasi Pääkäyttäjä'},
                ]}
                onChange={(item) => this.handleFilterChange(item, 'preparer.username')}
              />
            </Column>

            <Column medium={3} className="applications__search">
              <label htmlFor="search">{t('state')}</label>
              <Select
                value={get(filters, 'state')}
                autoBlur={true}
                className="form-field__select"
                clearable={true}
                noResultsText={t('noResultsFound')}
                placeholder={t('select')}
                options={[
                  {value: 'draft', label: 'Luonnos'},
                  {value: 'approved', label: 'Hyväksytty'},
                  {value: 'sent', label: 'Lähetetty'},
                  {value: 'archived', label: 'Arkistoitu'},
                ]}
                onChange={(item) => this.handleFilterChange(item, 'state')}
              />
            </Column>
          </Row>
        </Hero>

        <Table
          onRowClick={onRowClick}
          dataKeys={dataKeys}
          data={items}
          injectedControls={injectedControls}
        />
      </div>
    );
  }
}

export default flowRight(
  translate(['common', 'applications'])
)(FilterableList);
