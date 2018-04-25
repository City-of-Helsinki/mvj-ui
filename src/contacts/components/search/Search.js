// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';

import TextInput from '$components/inputs/TextInput';

type Props = {
  onSearch: Function,
}

type State = {
  search: string,
}

class Search extends Component {
  props: Props

  state: State = {
    search: '',
  }

  initialize = (query: Object) => {
    this.setState({
      search: query.search || '',
    });
  }

  onSearchChange = debounce(() => {
    const {onSearch} = this.props;
    const {search} = this.state;

    const filters = {};
    filters.search = search || undefined;
    onSearch(filters);
  }, 300);

  handleTextInputChange = (e: any, id: string) => {
    this.setState({[id]: e.target.value});
    this.onSearchChange();
  }

  render () {
    const {search} = this.state;

    return (
      <div className='search'>
        <Row>
          <Column>
            <TextInput
              placeholder={'Hae hakusanalla'}
              onChange={(e) => this.handleTextInputChange(e, 'search')}
              value={search}
            />
          </Column>
        </Row>
      </div>
    );
  }
}

export default Search;
