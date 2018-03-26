// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';

import TextInput from '$components/inputs/TextInput';

type Props = {
  onSearch: Function,
}

type State = {
  keyword: string,
}

class Search extends Component {
  props: Props

  state: State = {
    keyword: '',
  }

  initialize = (query: Object) => {
    this.setState({
      keyword: query.keyword ? query.keyword : '',
    });
  }

  onSearchChange = debounce(() => {
    const {onSearch} = this.props;
    const {keyword} = this.state;

    const filters = {};
    filters.keyword = keyword ? keyword : undefined;
    onSearch(filters);
  }, 300);

  handleTextInputChange = (e: any, id: string) => {
    this.setState({[id]: e.target.value});
    this.onSearchChange();
  }

  render () {
    const {keyword} = this.state;

    return (
      <div className='search'>
        <Row>
          <Column>
            <TextInput
              placeholder={'Hae hakusanalla'}
              onChange={(e) => this.handleTextInputChange(e, 'keyword')}
              value={keyword}
            />
          </Column>
        </Row>
      </div>
    );
  }
}

export default Search;
