import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { formValueSelector, getFormValues, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import debounce from "lodash/debounce";
import flowRight from "lodash/flowRight";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import type { ContextRouter } from "react-router";
import { getFieldOptions, getUrlParams } from "src/util/helpers";
import { getAttributes, getPlotSearchSubTypes } from "src/plotSearch/selectors";
import FormField from "src/components/form/FormField";
import SearchChangeTypeLink from "src/components/search/SearchChangeTypeLink";
import SearchClearLink from "src/components/search/SearchClearLink";
import SearchContainer from "src/components/search/SearchContainer";
import SearchInputColumn from "src/components/search/SearchInputColumn";
import SearchLabel from "src/components/search/SearchLabel";
import SearchLabelColumn from "src/components/search/SearchLabelColumn";
import SearchRow from "src/components/search/SearchRow";
import { FieldTypes, FormNames } from "src/enums";
import { PlotSearchFieldPaths } from "src/plotSearch/enums";
import type { Attributes } from "src/types";
type OwnProps = {
  handleSubmit: (...args: Array<any>) => any;
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  states: Array<Record<string, any>>;
};
type Props = OwnProps & ContextRouter & {
  formValues: Record<string, any>;
  attributes: Attributes;
  plotSearchSubtypes: Record<string, any>;
  selectedMainType: (number | string) | null | undefined;
  change: (...args: Array<any>) => any;
};
type State = {
  isBasicSearch: boolean;
  attributes: Attributes;
  typeOptions: Array<Record<string, any>>;
  subtypeOptions: Array<Record<string, any>>;
};

class Search extends Component<Props, State> {
  _isMounted: boolean;
  state = {
    isBasicSearch: true,
    attributes: null,
    typeOptions: [],
    subtypeOptions: []
  };

  componentDidMount() {
    this._isMounted = true;
    this.setState({
      isBasicSearch: this.isSearchBasicMode()
    });
    this.updateSubtypes();
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
    delete searchQuery.lease_state;
    delete searchQuery.in_bbox;
    delete searchQuery.visualization;
    delete searchQuery.zoom;
    const keys = Object.keys(searchQuery);

    if (keys.length === 0 || keys.length === 1 && searchQuery.q !== undefined) {
      return true;
    }

    return false;
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Record<string, any>) {
    const {
      isSearchInitialized
    } = this.props;

    if (isSearchInitialized && !isEqual(prevProps.formValues, this.props.formValues)) {
      this.onSearchChange();
    }

    if (this.props.plotSearchSubtypes !== prevProps.plotSearchSubtypes) {
      this.updateSubtypes();
    }
  }

  updateSubtypes = () => {
    this.setState(() => ({
      subtypeOptions: [{
        value: '',
        label: '',
        parent: null
      }, ...(this.props.plotSearchSubtypes?.map(subtype => ({
        value: subtype.id,
        label: subtype.name,
        parent: subtype.plot_search_type.id
      })) || [])]
    }));
  };
  resetSelectedSubtype = () => {
    this.props.change('subtype', '');
  };
  onSearchChange = debounce(() => {
    if (!this._isMounted) return;
    this.search();
  }, 1000);
  search = () => {
    const {
      formValues,
      onSearch,
      states
    } = this.props;
    onSearch({ ...formValues,
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

    if (props.attributes !== state.attributes) {
      newState.typeOptions = getFieldOptions(props.attributes, PlotSearchFieldPaths.TYPE);
    }

    return !isEmpty(newState) ? newState : null;
  }

  render() {
    const {
      handleSubmit,
      selectedMainType
    } = this.props;
    const {
      isBasicSearch,
      typeOptions,
      subtypeOptions
    } = this.state;
    const filteredSubtypeOptions = subtypeOptions?.filter(type => type.parent === Number(selectedMainType) || type.parent === null) || [];
    return <SearchContainer onSubmit={handleSubmit(this.search)}>
        <Row>
          <Column large={12}>
            <FormField disableDirty fieldAttributes={{
            label: 'Hae hakusanalla',
            type: FieldTypes.SEARCH,
            read_only: false
          }} invisibleLabel name='q' />
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
                    <SearchLabel>Hakutyyppi</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField disableDirty fieldAttributes={{
                  type: FieldTypes.CHOICE,
                  read_only: false
                }} invisibleLabel name='type' overrideValues={{
                  options: typeOptions
                }} onChange={this.resetSelectedSubtype} />
                  </SearchInputColumn>
                </SearchRow>
              </Column>

              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Haun alatyyppi</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField disableDirty fieldAttributes={{
                  type: FieldTypes.CHOICE,
                  read_only: false
                }} invisibleLabel name='subtype' overrideValues={{
                  options: filteredSubtypeOptions,
                  disabled: filteredSubtypeOptions.length <= 1 || !selectedMainType
                }} />
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
                        <FormField disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name='begin_at_after' />
                      </Column>
                      <Column small={6}>
                        <FormField className='with-dash' disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name='begin_at_before' />
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
                        <FormField disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name='end_at_after' />
                      </Column>
                      <Column small={6}>
                        <FormField className='with-dash' disableDirty fieldAttributes={{
                      type: FieldTypes.DATE,
                      read_only: false
                    }} invisibleLabel name='end_at_before' />
                      </Column>
                    </Row>
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

const formName = FormNames.PLOT_SEARCH_SEARCH;
export default (flowRight(withRouter, connect(state => {
  return {
    formValues: getFormValues(formName)(state),
    attributes: getAttributes(state),
    plotSearchSubtypes: getPlotSearchSubTypes(state),
    selectedMainType: formValueSelector(formName)(state, 'type')
  };
}), reduxForm({
  form: formName
}))(Search) as React.ComponentType<OwnProps>);