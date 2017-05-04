// @flow
import React, {Component} from 'react';
import classNames from 'classnames';
import Fuse from 'fuse.js';

import ApplicationListItem from './ApplicationListItem';

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
    const {className, handleItemClick, isFetching} = this.props;

    if (isFetching) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <input type="text"
               className="form-field__input form-field__input--search"
               placeholder="Hae..."
               onChange={this.handleSearch}
        />
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

export default ApplicationList;
