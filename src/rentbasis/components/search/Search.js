// @flow
import React, {Fragment, PureComponent} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import FormField from '$components/form/FormField';
import {FieldTypes} from '$components/enums';
import {FormNames, RentBasisDecisionsFieldPaths} from '$src/rentbasis/enums';
import {getFieldOptions, getUrlParams} from '$util/helpers';
import {getAttributes as getRentBasisAttributes} from '$src/rentbasis/selectors';

import type {Attributes} from '$src/types';

type Props = {
  formValues: Object,
  initialize: Function,
  isSearchInitialized: boolean,
  location: Object,
  onSearch: Function,
  rentBasisAttributes: Attributes,
}

type State = {
  decisionMakerOptions: Array<Object>,
  isBasicSearch: boolean,
  rentBasisAttributes: Attributes,
}

class Search extends PureComponent<Props, State> {
  _isMounted: boolean;

  state = {
    decisionMakerOptions: [],
    isBasicSearch: false,
    rentBasisAttributes: {},
  }

  componentDidMount() {
    this._isMounted = true;

    this.setState({isBasicSearch: this.isSearchBasicMode()});
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.rentBasisAttributes !== state.rentBasisAttributes) {
      newState.rentBasisAttributes = props.rentBasisAttributes;
      newState.decisionMakerOptions = getFieldOptions(props.rentBasisAttributes, RentBasisDecisionsFieldPaths.DECISION_MAKER);
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps: Object) {
    const {isSearchInitialized} = this.props;

    if(isSearchInitialized && !isEqual(prevProps.formValues, this.props.formValues)) {
      this.onSearchChange();
    }
  }

  isSearchBasicMode = () => {
    const {location: {search}} = this.props;
    const query = getUrlParams(search);

    delete query.page;

    if(!Object.keys(query).length || (Object.keys(query).length === 1 && query.search)) return true;

    return false;
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    const {formValues, onSearch} = this.props;

    onSearch({...formValues});
  }, 500);

  toggleSearchType = () => {
    const {formValues, initialize, onSearch} = this.props;
    const isBasicSearch = this.state.isBasicSearch ? true : false;

    this.setState({isBasicSearch: !isBasicSearch});

    if(!isBasicSearch) {
      const newFormValues = {};

      if(formValues.search) {
        newFormValues.search = formValues.search;
      }

      onSearch(newFormValues);
      initialize(newFormValues);
    }
  }

  handleLinkKeyDown = (e: any) => {
    if(e.keyCode === 13){
      e.preventDefault();
      this.toggleSearchType();
    }
  }

  handleClear = () => {
    const {onSearch} = this.props;

    onSearch({});
  }

  handleClearKeyDown = (e: any) => {
    if(e.keyCode === 13){
      e.preventDefault();
      this.handleClear();
    }
  }

  render () {
    const {decisionMakerOptions, isBasicSearch} = this.state;

    return (
      <div className='search'>
        <Row>
          <Column small={12}>
            <FormField
              disableDirty
              fieldAttributes={{
                label: 'Hae hakusanalla',
                type: FieldTypes.SEARCH,
                read_only: false,
              }}
              invisibleLabel
              name='search'
            />
          </Column>
        </Row>

        {!isBasicSearch &&
          <Fragment>
            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Päätös</span>
              </div>
              <div className='lease-search__input-column'>
                <Row>
                  <Column small={6}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Päätöksen tekijä',
                        type: FieldTypes.CHOICE,
                        read_only: false,
                      }}
                      invisibleLabel
                      name='decision_maker'
                      overrideValues={{options: decisionMakerOptions}}
                    />
                  </Column>
                  <Column small={3}>
                    <FormField
                      disableDirty
                      fieldAttributes={{
                        label: 'Päätöspvm',
                        type: FieldTypes.DATE,
                        read_only: false,
                      }}
                      invisibleLabel
                      name='decision_date'
                    />
                  </Column>
                  <Column small={3}>
                    <FormField
                      disableDirty
                      fieldAttributes={{
                        label: 'Pykälä',
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      unit='§'
                      name='decision_section'
                    />
                  </Column>
                </Row>
              </div>
            </div>
            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Diaarinro</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Diaarinro',
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='reference_number'
                />
              </div>
            </div>
          </Fragment>
        }

        <Row>
          <Column small={6}>
            <a
              tabIndex={0}
              onKeyDown={this.handleLinkKeyDown}
              onClick={this.toggleSearchType}
              className='lease-search__search-type-link'
            >{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</a>
          </Column>
          <Column small={6}>
            <a
              tabIndex={0}
              onKeyDown={this.handleClearKeyDown}
              onClick={this.handleClear}
              className='lease-search__clear-link'
            >Tyhjennä haku</a>
          </Column>
        </Row>
      </div>
    );
  }
}


const formName = FormNames.SEARCH;

export default flowRight(
  // $FlowFixMe
  withRouter,
  connect(
    state => {
      return {
        formValues: getFormValues(formName)(state),
        rentBasisAttributes: getRentBasisAttributes(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(Search);
