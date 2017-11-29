// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import TextInput from '../../components/TextInput';
import SelectInput from '../../components/SelectInput';

type State = {
  isBasicSearch: boolean,
  keyword: string,
  customer: string,
  roles: Array<string>,
  documentType: string,
}


class Search extends Component {
  state: State = {
    isBasicSearch: true,
    keyword: '',
    customer: '',
    roles: ['1', '2'],
    documentType: 'all',
  }

  handleTextInputChange = (e: any, id: string) => {
    this.setState({[id]: e.target.value});
  }

  handleSelectInputChange = (selectedOption: Object, id: string) => {
    this.setState({[id]: get(selectedOption, 'value', '')});
  }

  handleMultiSelectInputChange = (selectedOptions: Array<Object>, id: string) => {
    const options = selectedOptions.map((option) => {
      return (
        get(option, 'value')
      );
    });
    this.setState({[id]: options});
  }

  toggleSearchType = () => {
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  render () {
    const {
      isBasicSearch,
      keyword,
      customer,
      roles,
    } = this.state;

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
            <Row>
              <Column large={12}>
                <label>Asiakas</label>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'customer')} value={customer}/>
                <label>Rooli</label>
                <SelectInput
                  multi={true}
                  onChange={(e) => this.handleMultiSelectInputChange(e, 'roles')}
                  options={[
                    {value: '1', label: 'Vuokralainen'},
                    {value: '2', label: 'Laskun saaja'},
                    {value: '3', label: 'Yhteyshenkilö'},
                  ]}
                  searchable={false}
                  value={roles}
                />
              </Column>
            </Row>
            <Row>
              <Column large={12}>
                <label>Vuokraus</label>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
              </Column>
            </Row>
            <Row>
              <Column  className='search-box' large={12}>
                <label>Kiinteistö</label>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
                <label>Osoite</label>
                <TextInput placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
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
