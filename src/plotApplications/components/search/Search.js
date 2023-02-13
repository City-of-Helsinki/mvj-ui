// @flow
import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {formValueSelector, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import {getUrlParams, getFieldOptions} from '$util/helpers';
import {getAttributes as getPlotSearchAttributes, getPlotSearchList} from '$src/plotSearch/selectors';
import FormField from '$components/form/FormField';
import SearchClearLink from '$components/search/SearchClearLink';
import SearchChangeTypeLink from '$components/search/SearchChangeTypeLink';
import SearchContainer from '$components/search/SearchContainer';
import SearchRow from '$components/search/SearchRow';
import SearchLabelColumn from '$components/search/SearchLabelColumn';
import SearchLabel from '$components/search/SearchLabel';
import SearchInputColumn from '$components/search/SearchInputColumn';
import {FieldTypes, FormNames} from '$src/enums';
import {
  PlotSearchFieldPaths,
} from '$src/plotSearch/enums';
import type {PlotSearchList} from '$src/plotSearch/types';
import type {Attributes} from '$src/types';
import {fetchPlotSearchSubtypes} from '$src/plotApplications/actions';
import {getPlotSearchSubTypes} from '$src/plotApplications/selectors';

type OwnProps = {
  isSearchInitialized: boolean,
  onSearch: Function,
  states: Array<Object>,
};

type Props = {
  ...OwnProps,
  formValues: Object,
  handleSubmit: Function,
  location: Object,
  plotSearchAttributes: Attributes,
  plotSearches: PlotSearchList,
  fetchPlotSearchSubtypes: Function,
  plotSearchSubtypes: Object,
  selectedMainType: ?(number | string),
  change: Function,
  context: string
}

type State = {
  isBasicSearch: boolean,
  typeOptions: Array<Object>,
  subtypeOptions: Array<Object>,
  plotSearches: PlotSearchList,
  plotSearchOptions: Array<Object>,
  plotSearchAttributes: Attributes,
  attributes: Attributes,
}

class Search extends Component<Props, State> {
  _isMounted: boolean;

  state = {
    isBasicSearch: true,
    typeOptions: [],
    subtypeOptions: [],
    plotSearches: {},
    plotSearchOptions: [],
    plotSearchAttributes: {},
    attributes: {},
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({isBasicSearch: this.isSearchBasicMode()});

    this.props.fetchPlotSearchSubtypes();
  }

  componentDidUpdate(prevProps: Props) {
    const {isSearchInitialized} = this.props;
    if (isSearchInitialized && !isEqual(prevProps.formValues, this.props.formValues)) {
      this.onSearchChange();
    }

    if (this.props.plotSearchSubtypes !== prevProps.plotSearchSubtypes) {
      this.setState(() => ({
        subtypeOptions: [
          {
            value: '',
            label: '',
            parent: null,
          },
          ...(this.props.plotSearchSubtypes?.map((subtype) => ({
            value: subtype.id,
            label: subtype.name,
            parent: subtype.plot_search_type.id,
          })) || []),
        ],
      }));
    }

    if (this.props.context !== prevProps.context) {
      this.setState({isBasicSearch: this.isSearchBasicMode()});
    }
  }

  isSearchBasicMode = () => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    // Ignore these fields when testing is search query length
    delete searchQuery.page;
    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
    delete searchQuery.in_bbox;
    delete searchQuery.visualization;
    delete searchQuery.zoom;

    const keys = Object.keys(searchQuery);

    // $FlowFixMe[method-unbinding] https://github.com/facebook/flow/issues/8689
    if (!keys.length || (keys.length === 1 && Object.prototype.hasOwnProperty.call(searchQuery, 'search'))) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSearchChange = debounce(() => {
    if (!this._isMounted) {
      return;
    }
    this.search();
  }, 1000);

  search = () => {
    const {formValues, onSearch, states} = this.props;
    let searchParams = formValues;
    if (this.state.isBasicSearch) {
      searchParams = {
        q: formValues.q,
      };
    }

    onSearch({...searchParams, state: (states.length ? states : undefined)});
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

    if (props.plotSearchAttributes !== state.plotSearchAttributes) {
      newState.typeOptions = getFieldOptions(props.plotSearchAttributes, PlotSearchFieldPaths.TYPE);
    }

    if (props.plotSearches !== state.plotSearches && props.plotSearches.results) {
      newState.plotSearchOptions = props.plotSearches.results.map(result => ({label: result.name, value: result.id}));
    }

    return !isEmpty(newState) ? newState : null;
  }

  resetSelectedSubtype = () => {
    this.props.change('plot_search_subtype', '');
  }

  render() {
    const {
      handleSubmit,
      selectedMainType,
    } = this.props;

    const {
      isBasicSearch,
      typeOptions,
      plotSearchOptions,
      subtypeOptions,
    } = this.state;

    const filteredSubtypeOptions = subtypeOptions?.filter(
      (type) => type.parent === Number(selectedMainType) || type.parent === null
    ) || [];

    return (
      <SearchContainer onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(this.search);
      }}>
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
              name='q'
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
                    <SearchLabel>Tonttihaku</SearchLabel>
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
                      name='plot_search'
                      overrideValues={{
                        options: plotSearchOptions,
                        disabled: (plotSearchOptions?.length || 0) <= 1,
                      }}
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Hakutyyppi</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      disableDirty
                      fieldAttributes={{
                        type: FieldTypes.CHOICE,
                        read_only: false,
                      }}
                      name='plot_search_type'
                      overrideValues={{
                        options: typeOptions,
                        disabled: typeOptions.length <= 1,
                      }}
                      onChange={this.resetSelectedSubtype}
                    />
                  </SearchInputColumn>
                </SearchRow>

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
                          name='begin_at_after'
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
                          name='begin_at_before'
                        />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Voimassa',
                        type: FieldTypes.CHECKBOX,
                        read_only: false,
                      }}
                      invisibleLabel
                      overrideValues={{
                        options: [{value: true, label: 'Voimassa'}],
                      }}
                      name='ongoing'
                    />
                  </SearchInputColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Päättyneet',
                        type: FieldTypes.CHECKBOX,
                        read_only: false,
                      }}
                      invisibleLabel
                      overrideValues={{
                        options: [{value: true, label: 'Päättyneet'}],
                      }}
                      name='ended'
                    />
                  </SearchInputColumn>
                </SearchRow>
              </Column>

              {/* Second column */}
              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Kohteen tunnus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name='identifier'
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Haun alatyyppi</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      disableDirty
                      fieldAttributes={{
                        type: FieldTypes.CHOICE,
                        read_only: false,
                      }}
                      name='plot_search_subtype'
                      overrideValues={{
                        options: filteredSubtypeOptions,
                        disabled: filteredSubtypeOptions.length <= 1 || !selectedMainType,
                      }}
                    />
                  </SearchInputColumn>
                </SearchRow>

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
                          name='end_at_after'
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
                          name='end_at_before'
                        />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Vain varatut kohteet',
                        type: FieldTypes.CHECKBOX,
                        read_only: false,
                      }}
                      invisibleLabel
                      overrideValues={{
                        options: [{value: true, label: 'Vain varatut kohteet'}],
                      }}
                      name='reserved'
                    />
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

const formName = FormNames.PLOT_APPLICATIONS_SEARCH;

export default (flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        plotSearchAttributes: getPlotSearchAttributes(state),
        plotSearches: getPlotSearchList(state),
        plotSearchSubtypes: getPlotSearchSubTypes(state),
        selectedMainType: formValueSelector(formName)(state, 'plot_search_type'),
      };
    },
    {
      fetchPlotSearchSubtypes,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(Search): React$AbstractComponent<OwnProps, mixed>);
