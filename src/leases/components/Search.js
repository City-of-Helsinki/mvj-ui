// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';

import TextInput from '../../components/TextInput';

type State = {
  isBasicSearch: boolean,
  keyword: string,
  documentType: string,
}


class Search extends Component {
  state: State = {
    isBasicSearch: true,
    keyword: '',
    documentType: 'all',
  }

  handleTextInputChange = (e: any, id: string) => {
    this.setState({[id]: e.target.value});
  }

  toggleSearchType = () => {
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  render () {
    const {isBasicSearch, keyword} = this.state;

    return (
      <div className='search'>
        {isBasicSearch && (
          <div>
            <Row>
              <Column  className='search-box' large={12}>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
              </Column>
            </Row>
          </div>
        )}
        {!isBasicSearch && (
          <div>
            <h1>Tarkennettu haku</h1>
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
