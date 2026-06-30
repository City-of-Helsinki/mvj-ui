import React, { useEffect, useCallback, useMemo, useRef } from "react";
import {
  withRouterLegacy,
  type WithRouterProps,
} from "@/root/withRouterLegacy";
import { connect } from "react-redux";
import {
  clearFields,
  formValueSelector,
  getFormValues,
  reduxForm,
} from "redux-form";
import { Row, Column } from "@/components/grid/Grid";
import debounce from "lodash/debounce";
import flowRight from "lodash/flowRight";
import isEqual from "lodash/isEqual";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
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
  municipality: string;
  onClear: (...args: Array<any>) => any;
  onSearch: (...args: Array<any>) => any;
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

const Search: React.FC<Props & WithRouterProps> = (props) => {
  const [state, setState] = React.useState<State>({
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
  });
  const {
    change,
    fetchDistrictsByMunicipality,
    isSearchInitialized,
    leaseAttributes,
    lessors,
    municipality,
    onSearch,
    formValues,
    location: { search: searchParams },
    handleSubmit: reduxFormHandleSubmit,
    districts,
    isFetchingAttributes,
  } = props;

  const isSearchBasicMode = useCallback(() => {
    const searchQuery = getUrlParams(searchParams);
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
      (keys.length === 1 && Object.hasOwn(searchQuery, "search"))
    ) {
      return true;
    }

    return false;
  }, [searchParams]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isBasicSearch: isSearchBasicMode(),
    }));
  }, [isSearchBasicMode]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      decisionMakerOptions: getFieldOptions(
        leaseAttributes,
        LeaseDecisionsFieldPaths.DECISION_MAKER,
      ),
      intendedUseOptions: getFieldOptions(
        leaseAttributes,
        LeaseFieldPaths.INTENDED_USE,
      ),
      municipalityOptions: getFieldOptions(
        leaseAttributes,
        LeaseFieldPaths.MUNICIPALITY,
      ),
      tenantTypeOptions: getFieldOptions(
        leaseAttributes,
        LeaseTenantContactSetFieldPaths.TYPE,
        false,
      ),
      typeOptions: getFieldOptions(leaseAttributes, LeaseFieldPaths.TYPE),
    }));
  }, [leaseAttributes]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      lessorOptions: addEmptyOption(getContactOptions(lessors)),
    }));
  }, [lessors]);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      if (municipality) {
        fetchDistrictsByMunicipality(municipality);
      }
      firstUpdate.current = false;
      return;
    }

    if (municipality) {
      fetchDistrictsByMunicipality(municipality);
    }

    change("district", "");
  }, [municipality, fetchDistrictsByMunicipality, change]);

  const search = useCallback(
    (addOnlyActiveLeases: boolean) => {
      const newValues = { ...formValues };

      if (!addOnlyActiveLeases) {
        delete newValues.only_active_leases;
      }

      onSearch(newValues, true);
    },
    [formValues, onSearch],
  );

  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const onSearchChange = useMemo(
    () =>
      debounce((addOnlyActiveLeases) => {
        searchRef.current(addOnlyActiveLeases);
      }, 1000),
    [],
  );

  const prevFormValues = useRef(formValues);
  useEffect(() => {
    if (isSearchInitialized && !isEqual(prevFormValues.current, formValues)) {
      const searchQuery = getUrlParams(searchParams);
      const addOnlyActiveLeases =
        Object.hasOwn(searchQuery, "only_active_leases") ||
        (prevFormValues.current &&
          prevFormValues.current.only_active_leases !==
            formValues.only_active_leases);

      onSearchChange(addOnlyActiveLeases);
    }
    prevFormValues.current = formValues;
  }, [formValues, isSearchInitialized, searchParams, onSearchChange]);

  const handleSubmit = () => {
    const searchQuery = getUrlParams(searchParams);
    const addOnlyActiveLeases = Object.hasOwn(
      searchQuery,
      "only_active_leases",
    );
    search(addOnlyActiveLeases);
  };

  const toggleSearchType = () => {
    setState((prevState) => ({
      ...prevState,
      isBasicSearch: !prevState.isBasicSearch,
    }));
  };
  const handleClear = () => {
    const query = {};
    onSearch(query, true, true);
  };
  const formHasNoName = () => {
    return formValues ? (formValues.tenant_name ? false : true) : true;
  };

  const {
    decisionMakerOptions,
    intendedUseOptions,
    isBasicSearch,
    lessorOptions,
    municipalityOptions,
    tenantTypeOptions,
    typeOptions,
    serviceUnitOptions,
  } = state;
  const districtOptions = getDistrictOptions(districts);
  const radioButtonsDisabled = formHasNoName();
  return (
    <SearchContainer onSubmit={reduxFormHandleSubmit(handleSubmit)}>
      <Row>
        <Column small={12}>
          <FormFieldLegacy
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
        <>
          <Row>
            {/* First column */}
            <Column small={12} large={6}>
              <SearchRow>
                <SearchLabelColumn>
                  <SearchLabel>Nimi</SearchLabel>
                </SearchLabelColumn>
                <SearchInputColumn>
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
                  <FormFieldLegacy
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
        </>
      )}

      <Row>
        <Column small={6}>
          <SearchChangeTypeLink onClick={toggleSearchType}>
            {isBasicSearch ? "Tarkennettu haku" : "Yksinkertainen haku"}
          </SearchChangeTypeLink>
        </Column>
        <Column small={6}>
          <SearchClearLink onClick={handleClear}>Tyhjennä haku</SearchClearLink>
        </Column>
      </Row>
    </SearchContainer>
  );
};

const formName = FormNames.LEASE_SEARCH;
const selector = formValueSelector(formName);
export default flowRight(
  withRouterLegacy,
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
)(Search) as React.ComponentType;
