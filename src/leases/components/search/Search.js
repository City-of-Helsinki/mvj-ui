// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

import {getSearchQuery} from './helpers';
import SelectInput from '../../../components/SelectInput';
import SingleCheckboxInput from '../../../components/SingleCheckboxInput';
import TextInput from '../../../components/TextInput';

type State = {
  address: string,
  customer: string,
  district: string,
  documentType: string,
  finished: boolean,
  inEffect: boolean,
  isBasicSearch: boolean,
  keyword: string,
  municipality: string,
  oldCustomer: boolean,
  propertyDistrict: string,
  propertyMunicipality: string,
  propertySequence: string,
  propertyType: string,
  roles: Array<string>,
  sequence: string,
  type: string,
  types: Array<string>,
}

class Search extends Component {
  state: State = {
    address: '',
    customer: '',
    district: '',
    documentType: 'all',
    finished: false,
    inEffect: false,
    isBasicSearch: true,
    keyword: '',
    municipality: '',
    oldCustomer: false,
    propertyDistrict: '',
    propertyMunicipality: '',
    propertySequence: '',
    propertyType: '',
    roles: [],
    sequence: '',
    type: '',
    types: [],
  }

  onSearchChange = debounce(() => {
    this.search();
  }, 500);

  search = () => {
    const {district, municipality, sequence, type} = this.state;
    const filters = {};
    filters.district = district ? district : '';
    filters.municipality = municipality ? municipality : '';
    filters.sequence = sequence ? sequence : '';
    filters.type = type ? type : '';
    const query = getSearchQuery(filters);
    console.log(query);
  }

  handleTextInputChange = (e: any, id: string) => {
    this.setState({[id]: e.target.value});
    this.onSearchChange();
  }

  handleCheckboxChange = (id:string) => {
    this.setState({[id]: !this.state[id]});
    this.onSearchChange();
  }

  handleMultiSelectInputChange = (selectedOptions: Array<Object>, id: string) => {
    const options = selectedOptions.map((option) => {
      return (
        get(option, 'value')
      );
    });
    this.setState({[id]: options});
    this.onSearchChange();
  }

  toggleSearchType = () => {
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  render () {
    const {
      address,
      customer,
      district,
      finished,
      inEffect,
      isBasicSearch,
      keyword,
      municipality,
      oldCustomer,
      propertyDistrict,
      propertyMunicipality,
      propertySequence,
      propertyType,
      roles,
      sequence,
      type,
      types,
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
                <div className='advanced-search-row-wrapper'>
                  <div className='column-text-input-first'>
                    <label className='label-long'>Vuokralainen</label>
                    <TextInput disabled placeholder={'Vuokralainen'} onChange={(e) => this.handleTextInputChange(e, 'customer')} value={customer}/>
                  </div>
                  <div className='column-checkbox'>
                    <SingleCheckboxInput
                      disabled
                      isChecked={oldCustomer}
                      onChange={() => this.handleCheckboxChange('oldCustomer')}
                      label='Vain vanhat asiakkaat'
                    />
                  </div>
                  <div className='column-select'>
                    <label className='label-medium'>Rooli</label>
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
                  </div>
                </div>
              </Column>
            </Row>
            <Row>
              <Column large={12}>
                <div className='advanced-search-row-wrapper'>
                  <div className='column-text-input-first'>
                    <label className='label-long'>Vuokraus</label>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'leaseType')} value={type}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'leaseMunicipality')} value={municipality}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'leaseDistrict')} value={district}/>
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'leaseSequence')} value={sequence}/>
                    </div>
                  </div>
                  <div className='column-checkbox'>
                    <SingleCheckboxInput
                      disabled
                      isChecked={inEffect}
                      onChange={() => this.handleCheckboxChange('inEffect')}
                      label='Voimassa'
                    />
                    <SingleCheckboxInput
                      disabled
                      isChecked={finished}
                      onChange={() => this.handleCheckboxChange('finished')}
                      label='Päättyneet'
                    />
                  </div>
                  <div className='column-select'>
                    <label className='label-medium'>Tyyppi</label>
                    <SelectInput
                      multi={true}
                      onChange={(e) => this.handleMultiSelectInputChange(e, 'types')}
                      options={[
                        {value: '1', label: 'Hakemus'},
                        {value: '2', label: 'Varaus'},
                        {value: '3', label: 'Vuokraus'},
                        {value: '4', label: 'Lupa'},
                        {value: '5', label: 'Muistettavat ehdot'},
                      ]}
                      searchable={false}
                      value={types}
                    />
                  </div>
                </div>
              </Column>
            </Row>
            <Row>
              <Column large={12}>
                <div className='advanced-search-row-wrapper'>
                  <div className='column-text-input-first'>
                    <label className='label-long'>Kiinteistö</label>
                    <div className='short-input'>
                      <TextInput disabled onChange={(e) => this.handleTextInputChange(e, 'propertyType')} value={propertyType}/>
                    </div>
                    <div className='short-input'>
                      <TextInput disabled onChange={(e) => this.handleTextInputChange(e, 'propertyMunicipality')} value={propertyMunicipality}/>
                    </div>
                    <div className='short-input'>
                      <TextInput disabled onChange={(e) => this.handleTextInputChange(e, 'propertyDistrict')} value={propertyDistrict}/>
                    </div>
                    <div className='short-input'>
                      <TextInput disabled onChange={(e) => this.handleTextInputChange(e, 'propertySequence')} value={propertySequence}/>
                    </div>
                  </div>
                  <div className='column-text-input-second'>
                    <label className='label-small'>Osoite</label>
                    <div className='nomargin-input'>
                      <TextInput disabled placeholder={'Osoite'} onChange={(e) => this.handleTextInputChange(e, 'address')} value={address}/>
                    </div>
                  </div>
                </div>
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
