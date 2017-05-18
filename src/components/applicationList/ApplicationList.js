// @flow
import React, {Component} from 'react';
import classnames from 'classnames';
import Fuse from 'fuse.js';
import flowRight from 'lodash/flowRight';
import {translate} from 'react-i18next';

import Hero from '../hero/Hero';
import {Column} from 'react-foundation';
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
  handleCreateLeaseClick: Function,
  handleEditClick: Function,
  isFetching: boolean,
  t: Function,
};

type State = {
  items: Array<any>,
  search: string,
};

type FuseType = Object;

class ApplicationList extends Component {
  props: Props;
  state: State;
  fuse: FuseType;

  constructor(props: Object) {
    super(props);

    this.fuse = new Fuse([], fuseOptions);

    this.state = {
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

  render() {
    const {items} = this.state;
    const {className, handleEditClick, handleCreateLeaseClick, isFetching, t} = this.props;

    return (
      <div className={classnames('applications__list', className, {'loading': isFetching})}>
        <Hero className="hero--secondary">
          <Column medium={6} className="applications__search">
            <label htmlFor="search">{t('search')}</label>
            <input type="text"
                   id="search"
                   className="form-field__input form-field__input--search"
                   onChange={this.handleSearch}
            />
          </Column>
        </Hero>
        <Table
          dataKeys={[
            {key: 'id', label: 'ID'},
            {key: 'contact_name', label: 'Nimi'},
            {key: 'created_at', label: 'Luotu'},
          ]}
          data={items}
          injectedControls={[
            {onClick: handleEditClick, className: 'applications__list--edit', text: t('edit')},
            {onClick: handleCreateLeaseClick, className: 'applications__list--edit', text: t('add')},
          ]}
        />
      </div>
    );
  }
}

export default flowRight(
  translate(['common', 'applications'])
)(ApplicationList);
