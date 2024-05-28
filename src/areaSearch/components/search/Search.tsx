import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { formValueSelector, getFormValues, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import debounce from "lodash/debounce";
import flowRight from "lodash/flowRight";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import { getFieldOptions, getUrlParams } from "src/util/helpers";
import FormField from "src/components/form/FormField";
import SearchClearLink from "src/components/search/SearchClearLink";
import SearchChangeTypeLink from "src/components/search/SearchChangeTypeLink";
import SearchContainer from "src/components/search/SearchContainer";
import SearchRow from "src/components/search/SearchRow";
import SearchLabelColumn from "src/components/search/SearchLabelColumn";
import SearchLabel from "src/components/search/SearchLabel";
import SearchInputColumn from "src/components/search/SearchInputColumn";
import { FieldTypes, FormNames } from "src/enums";
import type { ApiResponse, Attributes } from "src/types";
import { getAreaSearchList, getAttributes } from "src/areaSearch/selectors";
import SearchSubtitleLabel from "src/components/search/SearchSubtitleLabel";
import { AreaSearchFieldPaths } from "src/areaSearch/enums";
import { getIsFetching as getIsFetchingDistricts } from "src/district/selectors";
type OwnProps = {
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  states: Array<Record<string, any>>;
  handleSubmit: (...args: Array<any>) => any;
};
type Props = OwnProps & {
  formValues: Record<string, any>;
  location: Record<string, any>;
  areaSearchAttributes: Attributes;
  areaSearches: ApiResponse;
  selectedMainType: (number | string) | null | undefined;
  change: (...args: Array<any>) => any;
  context: string;
};
type State = {
  isBasicSearch: boolean;
  intendedUseOptions: Array<Record<string, any>>;
  lessorOptions: Array<Record<string, any>>;
  districtOptions: Array<Record<string, any>>;
  areaSearches: ApiResponse;
  areaSearchAttributes: Attributes;
  attributes: Attributes;
  serviceUnitOptions: Array<Record<string, any>>;
};

class Search extends Component<Props, State> {
  _isMounted: boolean;
  state = {
    isBasicSearch: true,
    intendedUseOptions: [],
    lessorOptions: [],
    districtOptions: [],
    areaSearches: null,
    areaSearchAttributes: {},
    attributes: {},
    serviceUnitOptions: []
  };

  componentDidMount() {
    this._isMounted = true;
    this.setState({
      isBasicSearch: this.isSearchBasicMode()
    });
  }

  componentDidUpdate(prevProps: Props) {
    const {
      isSearchInitialized
    } = this.props;

    if (isSearchInitialized && !isEqual(prevProps.formValues, this.props.formValues)) {
      this.onSearchChange();
    }

    if (this.props.context !== prevProps.context) {
      this.setState({
        isBasicSearch: this.isSearchBasicMode()
      });
    }
  }

  isSearchBasicMode = () => {
    const {
      location: {
        search
      }
    } = this.props;
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
    if (!keys.length || keys.length === 1 && Object.prototype.hasOwnProperty.call(searchQuery, 'search')) {
      return true;
    }

    return false;
  };

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
    const {
      formValues,
      onSearch,
      states
    } = this.props;
    let searchParams: Record<string, any> = formValues || {};

    if (this.state.isBasicSearch) {
      searchParams = {
        q: formValues.q
      };
    }

    onSearch({ ...searchParams,
      preparer: searchParams.preparer?.id || undefined,
      state: states.length ? states : undefined
    });
  };
  handleClear = () => {
    const {
      onSearch
    } = this.props;
    onSearch({});
  };
  toggleSearchType = () => {
    this.setState({
      isBasicSearch: !this.state.isBasicSearch
    });
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.areaSearchAttributes !== state.areaSearchAttributes) {
      newState.intendedUseOptions = getFieldOptions(props.areaSearchAttributes, AreaSearchFieldPaths.INTENDED_USE);
      newState.lessorOptions = getFieldOptions(props.areaSearchAttributes, AreaSearchFieldPaths.LESSOR);
      newState.serviceUnitOptions = getFieldOptions(props.areaSearchAttributes, 'service_unit', true);
    }

    return !isEmpty(newState) ? newState : null;
  }

  render() {
    const {
      handleSubmit,
      formValues
    } = this.props;
    const {
      isBasicSearch,
      intendedUseOptions,
      lessorOptions,
      serviceUnitOptions
    } = this.state;
    return <SearchContainer onSubmit={e => {
      e.preventDefault();
      handleSubmit(this.search);
    }}>
        <Row>
          <Column large={12}>
            <FormField disableDirty fieldAttributes={{
            label: 'Hae hakusanalla',
            type: FieldTypes.SEARCH,
            read_only: false
          }} invisibleLabel name="q" />
          </Column>
        </Row>
        {!isBasicSearch && <Fragment>
            <Row>
              {
            /* First column */
          }
              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Hakemustunnus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField autoBlur disableDirty fieldAttributes={{
                  type: FieldTypes.STRING,
                  read_only: false
                }} invisibleLabel name="identifier" />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Saapunut</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <Row>
                      <Column small={6}>
                        <FormField disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name="received_date_after" />
                      </Column>
                      <Column small={6}>
                        <FormField className="with-dash" disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name="received_date_before" />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Käyttötarkoitus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField autoBlur disableDirty fieldAttributes={{
                  type: FieldTypes.CHOICE,
                  read_only: false
                }} invisibleLabel overrideValues={{
                  options: intendedUseOptions
                }} name="intended_use" />
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Osoite</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField autoBlur disableDirty fieldAttributes={{
                  type: FieldTypes.STRING,
                  read_only: false
                }} invisibleLabel name="address" />
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Kaupunginosa</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField autoBlur disableDirty fieldAttributes={{
                  type: FieldTypes.STRING,
                  read_only: false
                }} invisibleLabel name="district" />
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Käsittelijä</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField autoBlur disableDirty fieldAttributes={{
                  type: FieldTypes.USER,
                  read_only: false
                }} invisibleLabel name="preparer" />
                  </SearchInputColumn>
                </SearchRow>

                {
              /*<SearchRow>
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
                   name="ongoing"
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
                   name="ended"
                 />
               </SearchInputColumn>
              </SearchRow>*/
            }
              </Column>

              {
            /* Second column */
          }
              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Hakija</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField autoBlur disableDirty fieldAttributes={{
                  type: FieldTypes.STRING,
                  read_only: false
                }} invisibleLabel name="applicant" />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchSubtitleLabel>Vuokra-aika</SearchSubtitleLabel>
                  </SearchLabelColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Alkupvm</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <Row>
                      <Column small={6}>
                        <FormField disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name="start_date_after" />
                      </Column>
                      <Column small={6}>
                        <FormField className="with-dash" disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name="start_date_before" />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Loppupvm</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <Row>
                      <Column small={6}>
                        <FormField disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name="end_date_after" />
                      </Column>
                      <Column small={6}>
                        <FormField className="with-dash" disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name="end_date_before" />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Vuokranantaja</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField autoBlur disableDirty fieldAttributes={{
                  label: 'Vuokranantaja',
                  type: FieldTypes.CHOICE,
                  read_only: false
                }} invisibleLabel overrideValues={{
                  options: lessorOptions
                }} name="lessor" />
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Palvelukokonaisuus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField autoBlur disableDirty fieldAttributes={{
                  label: 'Palvelukokonaisuus',
                  type: FieldTypes.CHOICE,
                  read_only: false
                }} invisibleLabel name='service_unit' overrideValues={{
                  options: serviceUnitOptions
                }} />
                  </SearchInputColumn>
                </SearchRow>

              </Column>
            </Row>
          </Fragment>}
        <Row>
          <Column small={6}>
            <SearchChangeTypeLink onClick={this.toggleSearchType}>{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</SearchChangeTypeLink>
          </Column>
          <Column small={6}>
            <SearchClearLink onClick={this.handleClear}>Tyhjennä haku</SearchClearLink>
          </Column>
        </Row>
      </SearchContainer>;
  }

}

const formName = FormNames.AREA_SEARCH_SEARCH;
export default (flowRight(withRouter, connect(state => {
  return {
    formValues: getFormValues(formName)(state),
    areaSearchAttributes: getAttributes(state),
    areaSearches: getAreaSearchList(state),
    selectedMainType: formValueSelector(formName)(state, 'plot_search_type'),
    isFetchingDistricts: getIsFetchingDistricts(state)
  };
}, {}), reduxForm({
  form: formName
}))(Search) as React.ComponentType<OwnProps>);