import React, { Fragment, PureComponent } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  clearFields,
  formValueSelector,
  getFormValues,
  reduxForm,
} from "redux-form";
import { Row, Column } from "react-foundation";
import debounce from "lodash/debounce";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import FormField from "@/components/form/FormField";
import SearchChangeTypeLink from "@/components/search/SearchChangeTypeLink";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import { fetchDistrictsByMunicipality } from "@/district/actions";
import { FieldTypes, FormNames } from "@/enums";
import {
  LeaseDecisionsFieldPaths,
  LeaseFieldPaths,
  LeaseTenantContactSetFieldPaths,
} from "@/leases/enums";
import { getContactOptions } from "@/contacts/helpers";
import { getDistrictOptions } from "@/district/helpers";
import { addEmptyOption, getFieldOptions, getUrlParams } from "@/util/helpers";
import { getDistrictsByMunicipality } from "@/district/selectors";
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes,
} from "@/leases/selectors";
import { getLessorList } from "@/lessor/selectors";
import type { Attributes } from "types";
import type { LessorList } from "@/lessor/types";
type Props = {
  anyTouched: boolean;
  change: (...args: Array<any>) => any;
  clearFields: (...args: Array<any>) => any;
  districts: Array<Record<string, any>>;
  fetchDistrictsByMunicipality: (...args: Array<any>) => any;
  formValues: Record<string, any>;
  handleSubmit: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  isFetchingAttributes: boolean;
  isSearchInitialized: boolean;
  leaseAttributes: Attributes;
  lessors: LessorList;
  location: Record<string, any>;
  municipality: string;
  onClear: (...args: Array<any>) => any;
  onSearch: (...args: Array<any>) => any;
  router: Record<string, any>;
};
type State = {
  decisionMakerOptions: Array<Record<string, any>>;
  intendedUseOptions: Array<Record<string, any>>;
  isBasicSearch: boolean;
  leaseAttributes: Attributes;
  lessors: LessorList;
  lessorOptions: Array<Record<string, any>>;
  municipalityOptions: Array<Record<string, any>>;
  tenantTypeOptions: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
  serviceUnitOptions: Array<Record<string, any>>;
};

class Search extends PureComponent<Props, State> {
  _isMounted: boolean;
  state = {
    decisionMakerOptions: [],
    intendedUseOptions: [],
    isBasicSearch: true,
    leaseAttributes: null,
    lessors: [],
    lessorOptions: [],
    municipalityOptions: [],
    tenantTypeOptions: [],
    typeOptions: [],
    serviceUnitOptions: [],
  };

  componentDidMount() {
    const { fetchDistrictsByMunicipality, municipality } = this.props;
    this._isMounted = true;
    this.setState({
      isBasicSearch: this.isSearchBasicMode(),
    });

    if (municipality) {
      fetchDistrictsByMunicipality(municipality);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.decisionMakerOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseDecisionsFieldPaths.DECISION_MAKER,
      );
      newState.intendedUseOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseFieldPaths.INTENDED_USE,
      );
      newState.municipalityOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseFieldPaths.MUNICIPALITY,
      );
      newState.tenantTypeOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseTenantContactSetFieldPaths.TYPE,
        false,
      );
      newState.typeOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseFieldPaths.TYPE,
      );
    }

    if (props.lessors !== state.lessors) {
      newState.lessors = props.lessors;
      newState.lessorOptions = addEmptyOption(getContactOptions(props.lessors));
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps: Props) {
    const { change, fetchDistrictsByMunicipality, isSearchInitialized } =
      this.props;

    if (prevProps.municipality != this.props.municipality) {
      if (this.props.municipality) {
        fetchDistrictsByMunicipality(this.props.municipality);
      }

      change("district", "");
    }

    if (
      isSearchInitialized &&
      !isEqual(prevProps.formValues, this.props.formValues)
    ) {
      const {
        location: { search },
      } = this.props;
      const searchQuery = getUrlParams(search);
      const addOnlyActiveLeases =
        Object.prototype.hasOwnProperty.call(
          searchQuery,
          "only_active_leases",
        ) ||
        prevProps.formValues.only_active_leases !==
          this.props.formValues.only_active_leases;
      this.onSearchChange(addOnlyActiveLeases);
    }
  }

  handleSubmit = () => {
    const {
      location: { search },
    } = this.props;
    const searchQuery = getUrlParams(search);
    const addOnlyActiveLeases = Object.prototype.hasOwnProperty.call(
      searchQuery,
      "only_active_leases",
    );
    this.search(addOnlyActiveLeases);
  };
  isSearchBasicMode = () => {
    const {
      location: { search },
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
    delete searchQuery.intended_use;
    delete searchQuery.service_unit;
    const keys = Object.keys(searchQuery);

    if (
      !keys.length ||
      (keys.length === 1 &&
        Object.prototype.hasOwnProperty.call(searchQuery, "search"))
    ) {
      return true;
    }

    return false;
  };
  onSearchChange = debounce((addOnlyActiveLeases) => {
    this.search(addOnlyActiveLeases);
  }, 1000);
  search = (addOnlyActiveLeases: boolean) => {
    if (!this._isMounted) return;
    const { formValues, onSearch } = this.props;
    const newValues = { ...formValues };

    if (!addOnlyActiveLeases) {
      delete newValues.only_active_leases;
    }

    onSearch(newValues, true);
  };
  toggleSearchType = () => {
    this.setState({
      isBasicSearch: !this.state.isBasicSearch,
    });
  };
  handleClear = () => {
    const { onSearch } = this.props;
    const query = {};
    onSearch(query, true, true);
  };
  formHasNoName = () => {
    const { formValues } = this.props;
    return formValues ? (formValues.tenant_name ? false : true) : true;
  };

  render() {
    const { districts, handleSubmit, isFetchingAttributes } = this.props;
    const {
      decisionMakerOptions,
      intendedUseOptions,
      isBasicSearch,
      lessorOptions,
      municipalityOptions,
      tenantTypeOptions,
      typeOptions,
      serviceUnitOptions,
    } = this.state;
    const districtOptions = getDistrictOptions(districts);
    const radioButtonsDisabled = this.formHasNoName();
    return (
      <SearchContainer onSubmit={handleSubmit(this.handleSubmit)}>
        <Row>
          <Column small={12}>
            <FormField
              autoBlur
              disableDirty
              fieldAttributes={{
                label: "Hae hakusanalla",
                type: FieldTypes.SEARCH,
                read_only: false,
              }}
              invisibleLabel
              name="search"
            />
          </Column>
        </Row>
        {!isBasicSearch && (
          <Fragment>
            <Row>
              {/* First column */}
              <Column small={12} large={6}>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Nimi</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Nimi",
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="tenant_name"
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn></SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disabled={radioButtonsDisabled}
                      disableDirty
                      fieldAttributes={{
                        label: "Kaikki",
                        type: FieldTypes.RADIO_WITH_FIELD,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="tenant_activity"
                      overrideValues={{
                        options: [
                          {
                            value: "",
                            label: "Kaikki",
                          },
                        ],
                      }}
                    />
                    <FormField
                      autoBlur
                      disabled={radioButtonsDisabled}
                      disableDirty
                      fieldAttributes={{
                        label: "Vain entiset asiakkaat",
                        type: FieldTypes.RADIO_WITH_FIELD,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="tenant_activity"
                      overrideValues={{
                        options: [
                          {
                            value: "past",
                            label: "Vain entiset asiakkaat",
                          },
                        ],
                      }}
                    />
                    <FormField
                      autoBlur
                      disabled={radioButtonsDisabled}
                      disableDirty
                      fieldAttributes={{
                        label: "Vain nykyiset asiakkaat",
                        type: FieldTypes.RADIO_WITH_FIELD,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="tenant_activity"
                      overrideValues={{
                        options: [
                          {
                            value: "active",
                            label: "Vain nykyiset asiakkaat",
                          },
                        ],
                      }}
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Rooli</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "",
                        type: FieldTypes.MULTISELECT,
                        read_only: false,
                      }}
                      invisibleLabel
                      isLoading={isFetchingAttributes}
                      name="tenantcontact_type"
                      overrideValues={{
                        options: tenantTypeOptions,
                      }}
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Y-tunnus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Y-tunnus",
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="business_id"
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Henkilötunnus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Henkilötunnus",
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="national_identification_number"
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Vuokranantaja</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Vuokranantaja",
                        type: FieldTypes.CHOICE,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="lessor"
                      overrideValues={{
                        options: lessorOptions,
                      }}
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Vuokraustunnus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <Row>
                      <Column small={6}>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{
                            label: "Tyyppi",
                            type: FieldTypes.CHOICE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="type"
                          overrideValues={{
                            options: typeOptions,
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{
                            label: "Kunta",
                            type: FieldTypes.CHOICE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="municipality"
                          overrideValues={{
                            options: municipalityOptions,
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{
                            label: "Kaupunginosa",
                            type: FieldTypes.CHOICE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="district"
                          overrideValues={{
                            options: districtOptions,
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{
                            label: "Juokseva numero",
                            type: FieldTypes.STRING,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="sequence"
                        />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Kiinteistötunnus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Kiinteistötunnus",
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="property_identifier"
                    />
                  </SearchInputColumn>
                </SearchRow>
                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Geometria puuttuu</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Geometria puuttuu",
                        type: FieldTypes.CHECKBOX,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="has_not_geometry"
                      overrideValues={{
                        options: [
                          {
                            value: true,
                          },
                        ],
                      }}
                    />
                  </SearchInputColumn>
                </SearchRow>
              </Column>

              {/* Second column */}
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
                            label: "Vuokrauksen alkupvm alkaen",
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="lease_start_date_start"
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          className="with-dash"
                          disableDirty
                          fieldAttributes={{
                            label: "Vuokrauksen alkupvm loppuen",
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="lease_start_date_end"
                        />
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
                        <FormField
                          disableDirty
                          fieldAttributes={{
                            label: "Vuokrauksen loppupvm alkaen",
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="lease_end_date_start"
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          className="with-dash"
                          disableDirty
                          fieldAttributes={{
                            label: "Vuokrauksen loppupvm loppuen",
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="lease_end_date_end"
                        />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn></SearchLabelColumn>
                  <SearchInputColumn>
                    <Row>
                      <Column small={6}>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{
                            label: "Voimassa",
                            type: FieldTypes.CHECKBOX,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="only_active_leases"
                          overrideValues={{
                            options: [
                              {
                                value: true,
                                label: "Voimassa",
                              },
                            ],
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{
                            label: "Päättyneet",
                            type: FieldTypes.CHECKBOX,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="only_expired_leases"
                          overrideValues={{
                            options: [
                              {
                                value: true,
                                label: "Päättyneet",
                              },
                            ],
                          }}
                        />
                      </Column>
                    </Row>
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Vuokrakohteen osoite</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Vuokrakohteen osoite",
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="address"
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Sopimusnro</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Sopimusnro",
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="contract_number"
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Päätös</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <Row>
                      <Column small={12}>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{
                            label: "Päätöksen tekijä",
                            type: FieldTypes.CHOICE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="decision_maker"
                          overrideValues={{
                            options: decisionMakerOptions,
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          disableDirty
                          fieldAttributes={{
                            label: "Päätöspvm",
                            type: FieldTypes.DATE,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="decision_date"
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          disableDirty
                          fieldAttributes={{
                            label: "Pykälä",
                            type: FieldTypes.STRING,
                            read_only: false,
                          }}
                          invisibleLabel
                          unit="§"
                          name="decision_section"
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
                        label: "Diaarinro",
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="reference_number"
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Laskunro</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Laskunro",
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="invoice_number"
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Vuokrauksen käyttötarkoitus</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Vuokrauksen käyttötarkoitus",
                        type: FieldTypes.CHOICE,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="intended_use"
                      overrideValues={{
                        options: intendedUseOptions,
                      }}
                    />
                  </SearchInputColumn>
                </SearchRow>

                <SearchRow>
                  {/* Empty row to align Omat Vuokraukset with Geometria Puuttuu */}
                  &nbsp;
                </SearchRow>

                <SearchRow>
                  <SearchLabelColumn>
                    <SearchLabel>Omat vuokraukset</SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: "Omat vuokraukset",
                        type: FieldTypes.CHECKBOX,
                        read_only: false,
                      }}
                      invisibleLabel
                      name="preparers_own_leases"
                      overrideValues={{
                        options: [
                          {
                            value: true,
                          },
                        ],
                      }}
                    />
                  </SearchInputColumn>
                </SearchRow>
              </Column>
            </Row>
          </Fragment>
        )}

        <Row>
          <Column small={6}>
            <SearchChangeTypeLink onClick={this.toggleSearchType}>
              {isBasicSearch ? "Tarkennettu haku" : "Yksinkertainen haku"}
            </SearchChangeTypeLink>
          </Column>
          <Column small={6}>
            <SearchClearLink onClick={this.handleClear}>
              Tyhjennä haku
            </SearchClearLink>
          </Column>
        </Row>
      </SearchContainer>
    );
  }
}

const formName = FormNames.LEASE_SEARCH;
const selector = formValueSelector(formName);
export default flowRight(
  withRouter,
  connect(
    (state) => {
      const municipality = selector(state, "municipality");
      return {
        districts: getDistrictsByMunicipality(state, municipality),
        formValues: getFormValues(formName)(state),
        isFetchingAttributes: getIsFetchingAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        lessors: getLessorList(state),
        municipality: municipality,
      };
    },
    {
      clearFields,
      fetchDistrictsByMunicipality,
    },
  ),
  reduxForm({
    form: formName,
  }),
)(Search) as React.ComponentType<any>;
