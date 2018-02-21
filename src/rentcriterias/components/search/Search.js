// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import toArray from 'lodash/toArray';
import debounce from 'lodash/debounce';

import TextInput from '../../../components/inputs/TextInput';

type Props = {
  onSearch: Function,
}

type State = {
  isBasicSearch: boolean,
  keyword: string,
}

class Search extends Component {
  props: Props

  state: State = {
    isBasicSearch: true,
    keyword: '',
  }

  initialize = (query: Object) => {
    this.setState({
      keyword: query.keyword ? query.keyword : '',
    });

    if(toArray(query).length > 0 && !query.keyword) {
      this.setState({
        isBasicSearch: false,
      });
    }
  }

  onSearchChange = debounce(() => {
    const {onSearch} = this.props;
    const {
      isBasicSearch,
      keyword,
    } = this.state;

    const filters = {};
    if(isBasicSearch) {
      console.log('Basic search: ', keyword);
      onSearch(filters);
    }
  }, 300);

  handleTextInputChange = (e: any, id: string) => {
    this.setState({[id]: e.target.value});
    this.onSearchChange();
  }

  toggleSearchType = () => {
    this.onSearchChange();
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  render () {
    const {
      isBasicSearch,
      keyword,
    } = this.state;

    return (
      <div className='search'>
        {isBasicSearch && (
          <div>
            <Row>
              <Column  className='search-box' large={12}>
                <TextInput
                  placeholder={'Hae hakusanalla'}
                  onChange={(e) => this.handleTextInputChange(e, 'keyword')}
                  value={keyword}/>
              </Column>
            </Row>
          </div>
        )}
        {!isBasicSearch && (
          <div>
            <Row>
              <Column large={12}>
                <h1>Tarkennettu haku</h1>
              </Column>
            </Row>
          </div>
        )}
        <Row>
          <Column large={12}>
            <a onClick={this.toggleSearchType} className='readme-link'>{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</a>
          </Column>
        </Row>
      </div>
    );
  }
}

export default Search;
