// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import flowRight from 'lodash/flowRight';
import {translate} from 'react-i18next';
import classnames from 'classnames';

import ApplicationListItem from './ApplicationListItem';
import Hero from '../hero/Hero';

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
  handleItemClick: Function,
  isFetching: boolean,
  data: Array<any>,
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
    const {className, handleItemClick, isFetching, t} = this.props;

    return (
      <div className={classnames('applications__list', {'loading': isFetching})}>
        <Hero className="hero--secondary">
          <input type="text"
                 className="form-field__input form-field__input--search"
                 placeholder={t('search')}
                 onChange={this.handleSearch}
          />
        </Hero>
        <ul className={classNames('mvj-application-list', className)}>
          {items.map((itemData, index) => (
            <ApplicationListItem key={index}
                                 data={itemData}
                                 onItemClick={handleItemClick}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default flowRight(
  translate(['common', 'applications'])
)(ApplicationList);
