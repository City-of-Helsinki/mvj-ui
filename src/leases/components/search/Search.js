// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import toArray from 'lodash/toArray';
import debounce from 'lodash/debounce';

import * as contentHelpers from '$src/leases/helpers';
import SelectInput from '$components/inputs/SelectInput';
import SingleCheckboxInput from '$components/inputs/SingleCheckboxInput';
import TextInput from '$components/inputs/TextInput';

type Props = {
  attributes: Object,
  onSearch: Function,
}

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
  props: Props

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

  initialize = (query: Object) => {
    this.setState({
      district: query.district ? query.district : '',
      keyword: query.keyword ? query.keyword : '',
      municipality: query.municipality ? query.municipality : '',
      sequence: query.sequence ? query.sequence : '',
      type: query.type ? query.type.toUpperCase() : '',
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
      district,
      isBasicSearch,
      // keyword,
      municipality,
      sequence,
      type} = this.state;

    const filters = {};
    if(isBasicSearch) {
      console.log('Basic search');
      //TODO: Uncomment when backend is implemented
      // if(keyword) {
      //   filters.keyword = keyword ? keyword : undefined;
      // }

    } else {
      filters.district = district ? district : undefined;
      filters.municipality = municipality ? municipality : undefined;
      filters.sequence = sequence ? sequence : undefined;
      filters.type = type ? type.toUpperCase() : undefined;
    }
    onSearch(filters);
  }, 300);

  handleTextInputChange = (e: any, id: string) => {
    this.setState({[id]: e.target.value});
    this.onSearchChange();
  }

  handleCheckboxChange = (id:string) => {
    this.setState({[id]: !this.state[id]});
    this.onSearchChange();
  }

  handleSelectInputChange = (selectedOption: Object, id: string) => {
    this.setState({[id]: get(selectedOption, 'value')});
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
    this.onSearchChange();
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  render () {
    const {attributes} = this.props;
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

    const districtOptions = contentHelpers.getDistrictOptions(attributes);
    const municipalityOptions = contentHelpers.getMunicipalityOptions(attributes);
    const typeOptions = contentHelpers.getTypeOptions(attributes);

    return (
      <div className='search'>
        {isBasicSearch && (
          <div>
            <Row>
              <Column large={12}>
                <TextInput disabled placeholder={'Hae hakusanalla'} onChange={(e) => this.handleTextInputChange(e, 'keyword')} value={keyword}/>
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
                      label='Vain entiset asiakkaat'
                    />
                  </div>
                  <div className='column-select'>
                    <label className='label-medium'>Rooli</label>
                    <SelectInput
                      disabled
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
                      <SelectInput
                        multi={false}
                        onChange={(e) => this.handleSelectInputChange(e, 'type')}
                        options={typeOptions}
                        placeholder=''
                        searchable={true}
                        value={type}
                      />
                    </div>
                    <div className='short-input'>
                      <SelectInput
                        multi={false}
                        onChange={(e) => this.handleSelectInputChange(e, 'municipality')}
                        options={municipalityOptions}
                        placeholder=''
                        searchable={true}
                        value={municipality}
                      />
                    </div>
                    <div className='short-input'>
                      <SelectInput
                        multi={false}
                        onChange={(e) => this.handleSelectInputChange(e, 'district')}
                        options={districtOptions}
                        placeholder=''
                        searchable={true}
                        value={district}
                      />
                    </div>
                    <div className='short-input'>
                      <TextInput onChange={(e) => this.handleTextInputChange(e, 'sequence')} value={sequence}/>
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
                      disabled
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
