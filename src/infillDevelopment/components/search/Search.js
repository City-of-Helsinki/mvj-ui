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
import SearchChangeTypeLink from '$components/search/SearchChangeTypeLink';
import SearchClearLink from '$components/search/SearchClearLink';
import SearchContainer from '$components/search/SearchContainer';
import SearchLabel from '$components/search/SearchLabel';
import SearchLabelColumn from '$components/search/SearchLabelColumn';
import SearchInputColumn from '$components/search/SearchInputColumn';
import SearchRow from '$components/search/SearchRow';
import {FormNames} from '$src/enums';
import {FieldTypes} from '$components/enums';
import {InfillDevelopmentCompensationLeaseDecisionsFieldPaths} from '$src/infillDevelopment/enums';
import {getFieldOptions, getUrlParams} from '$util/helpers';
import {getAttributes as getInfillDevelopmentAttributes} from '$src/infillDevelopment/selectors';

import type {Attributes} from '$src/types';

type Props = {
  formValues: Object,
  infillDevelopmentAttributes: Attributes,
  initialize: Function,
  isSearchInitialized: boolean,
  location: Object,
  onSearch: Function,
  sortKey: ?string,
  sortOrder: ?string,
  states: Array<Object>,
}

type State = {
  decisionMakerOptions: Array<Object>,
  infillDevelopmentAttributes: Attributes,
  isBasicSearch: boolean,
}

class Search extends PureComponent<Props, State> {
  _isMounted: boolean;

  state = {
    decisionMakerOptions: [],
    infillDevelopmentAttributes: null,
    isBasicSearch: true,
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

    if(props.infillDevelopmentAttributes !== state.infillDevelopmentAttributes) {
      newState.infillDevelopmentAttributes = props.infillDevelopmentAttributes;
      newState.decisionMakerOptions = getFieldOptions(props.infillDevelopmentAttributes, InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER);
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
    delete query.sort_key;
    delete query.sort_order;

    if(!Object.keys(query).length ||
      (Object.keys(query).length === 1 && (query.search || query.state)) ||
      (Object.keys(query).length === 2 && query.search && query.state)) return true;

    return false;
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    const {formValues, onSearch, sortKey, sortOrder, states} = this.props;
    const newValues = {...formValues};

    if(sortKey || sortOrder) {
      newValues.sort_key = sortKey;
      newValues.sort_order = sortOrder;
    }

    if(states.length) {
      newValues.lease_state = states;
    }

    onSearch(newValues, true);
  }, 500);

  toggleSearchType = () => {
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  handleClear = () => {
    const {onSearch, sortKey, sortOrder} = this.props;
    const query = {};

    if(sortKey || sortOrder) {
      query.sort_key = sortKey;
      query.sort_order = sortOrder;
    }

    onSearch(query, true, true);
  }

  render () {
    const {decisionMakerOptions, isBasicSearch} = this.state;

    return (
      <SearchContainer>
        <Row>
          <Column large={12}>
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
            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Päätös</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Diaarinro</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>
          </Fragment>
        }

        <Row>
          <Column small={6}>
            <SearchChangeTypeLink onClick={this.toggleSearchType}>{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</SearchChangeTypeLink>
          </Column>
          <Column small={6}>
            <SearchClearLink onClick={this.handleClear}>Tyhjennä haku</SearchClearLink>
          </Column>
        </Row>
      </SearchContainer>
    );
  }
}


const formName = FormNames.INFILL_DEVELOPMENT_SEARCH;

export default flowRight(
  // $FlowFixMe
  withRouter,
  connect(
    state => {
      return {
        formValues: getFormValues(formName)(state),
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(Search);
