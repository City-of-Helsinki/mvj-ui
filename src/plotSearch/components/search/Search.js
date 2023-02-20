// @flow
import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import type {ContextRouter} from 'react-router';

import {getFieldOptions, getUrlParams} from '$util/helpers';
import {getAttributes} from '$src/plotSearch/selectors';
import FormField from '$components/form/FormField';
import SearchChangeTypeLink from '$components/search/SearchChangeTypeLink';
import SearchClearLink from '$components/search/SearchClearLink';
import SearchContainer from '$components/search/SearchContainer';
import SearchInputColumn from '$components/search/SearchInputColumn';
import SearchLabel from '$components/search/SearchLabel';
import SearchLabelColumn from '$components/search/SearchLabelColumn';
import SearchRow from '$components/search/SearchRow';
import {FieldTypes, FormNames} from '$src/enums';
import {
  PlotSearchFieldPaths,
} from '$src/plotSearch/enums';

import type {Attributes} from '$src/types';

type OwnProps = {|
  handleSubmit: Function,
  isSearchInitialized: boolean,
  onSearch: Function,
  states: Array<Object>,
|}

type Props = {
  ...OwnProps,
  ...ContextRouter,
  formValues: Object,
  attributes: Attributes,
};

type State = {
  isBasicSearch: boolean,
  attributes: Attributes,
  typeOptions: Array<Object>,
  subtypeOptions: Array<Object>,
}

class Search extends Component<Props, State> {
  _isMounted: boolean;

  state = {
    isBasicSearch: true,
    attributes: null,
    typeOptions: [],
    subtypeOptions: [],
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({isBasicSearch: this.isSearchBasicMode()});
  }

  isSearchBasicMode = () => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    // Ignore these fields when testing is search query length
    delete searchQuery.page;
    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
    delete searchQuery.lease_state;
    delete searchQuery.in_bbox;
    delete searchQuery.visualization;
    delete searchQuery.zoom;

    const keys = Object.keys(searchQuery);

    // $FlowFixMe[method-unbinding] https://github.com/facebook/flow/issues/8689
    if (!keys.length || (keys.length === 1 && Object.prototype.hasOwnProperty.call(searchQuery, 'search'))) {
      return true;
    }

    return false;  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Object) {
    const {isSearchInitialized} = this.props;

    if(isSearchInitialized && !isEqual(prevProps.formValues, this.props.formValues)) {
      this.onSearchChange();
    }
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    this.search();
  }, 1000);

  search = () => {
    const {formValues, onSearch, states} = this.props;

    onSearch({...formValues, state: (states.length ? states : undefined)});
  }

  handleClear = () => {
    const {onSearch} = this.props;

    onSearch({});
  }

  toggleSearchType = () => {
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.attributes !== state.attributes) {
      newState.typeOptions = getFieldOptions(props.attributes, PlotSearchFieldPaths.TYPE);
      newState.subtypeOptions = getFieldOptions(props.attributes, PlotSearchFieldPaths.SUBTYPE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  render () {
    const {handleSubmit} = this.props;
    const {isBasicSearch, typeOptions, subtypeOptions} = this.state;
    return (
      <SearchContainer onSubmit={handleSubmit(this.search)}>
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
            <Row>
              {/* First column */}
              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Hakutyyppi</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        type: FieldTypes.CHOICE,
                        read_only: false,
                      }}
                      invisibleLabel
                      name='type'
                      overrideValues={{options: typeOptions}}
                    />
                  </SearchInputColumn>
                </SearchRow>
              </Column>

              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Haun alatyyppi</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        type: FieldTypes.CHOICE,
                        read_only: false,
                      }}
                      invisibleLabel
                      name='subtype'
                      overrideValues={{options: subtypeOptions}}
                    />
                  </SearchInputColumn>
                </SearchRow>
              </Column>

              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Alkupvm</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <Row>
                      <Column small={6}>
                        <FormField
                          disableDirty
                          fieldAttributes={{
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name='plot_search_start_date_start'
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          className='with-dash'
                          disableDirty
                          fieldAttributes={{
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name='plot_search_start_date_end'
                        />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>
              </Column>

              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Loppupvm</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <Row>
                      <Column small={6}>
                        <FormField
                          disableDirty
                          fieldAttributes={{
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name='plot_search_end_date_start'
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          className='with-dash'
                          disableDirty
                          fieldAttributes={{
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name='plot_search_end_date_end'
                        />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>
              </Column>
            </Row>
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

const formName = FormNames.PLOT_SEARCH_SEARCH;

export default (flowRight(
  withRouter,
  connect(
    state => {
      return {
        formValues: getFormValues(formName)(state),
        attributes: getAttributes(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(Search): React$ComponentType<OwnProps>);
