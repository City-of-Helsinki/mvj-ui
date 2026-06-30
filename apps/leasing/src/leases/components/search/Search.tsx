import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFormState } from "react-final-form";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import FormField from "@/components/form/final-form/FormField";
import SearchChangeTypeLink from "@/components/search/SearchChangeTypeLink";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import { Row, Column } from "@/components/grid/Grid";
import { fetchDistrictsByMunicipality } from "@/district/actions";
import { FieldTypes } from "@/enums";
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

type Props = {
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
};

type DistrictLoaderProps = {
  municipality: any;
};

interface SearchFieldsProps {
  isBasicSearch: boolean;
  isFetchingAttributes: boolean;
  decisionMakerOptions: Array<any>;
  intendedUseOptions: Array<any>;
  municipalityOptions: Array<any>;
  tenantTypeOptions: Array<any>;
  lessorOptions: Array<any>;
  typeOptions: Array<any>;
  onSearch: (values: any) => void;
  isSearchInitialized: boolean;
}

const SearchFields = ({
  isBasicSearch,
  isFetchingAttributes,
  decisionMakerOptions,
  intendedUseOptions,
  municipalityOptions,
  tenantTypeOptions,
  lessorOptions,
  typeOptions,
  onSearch,
  isSearchInitialized,
}: SearchFieldsProps) => {
  const { values } = useFormState();
  const municipality = values.municipality;
  const districts = useSelector((state: any) =>
    getDistrictsByMunicipality(state, Number(municipality)),
  );

  const prevValues = useRef(values);

  const debouncedSearch = useMemo(
    () =>
      debounce((currentValues) => {
        onSearch({ ...currentValues, page: undefined });
      }, 1000),
    [onSearch],
  );

  useEffect(() => {
    if (isSearchInitialized && !isEqual(prevValues.current, values)) {
      debouncedSearch(values);
    }
    prevValues.current = values;
  }, [values, isSearchInitialized, debouncedSearch]);

  const formHasNoName = () => {
    return values ? (values.tenant_name ? false : true) : true;
  };

  const districtOptions = getDistrictOptions(districts);
  const radioButtonsDisabled = formHasNoName();

  return (
    <>
      <DistrictLoader municipality={municipality} />
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
        <>
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
        </>
      )}
    </>
  );
};

const DistrictLoader = ({ municipality }: DistrictLoaderProps) => {
  const form = useForm();
  const dispatch = useDispatch();
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      if (municipality) {
        dispatch(fetchDistrictsByMunicipality(Number(municipality)));
      }
      firstUpdate.current = false;
      return;
    }

    if (municipality) {
      dispatch(fetchDistrictsByMunicipality(Number(municipality)));
    }

    form.change("district", "");
  }, [municipality, dispatch, form]);

  return null;
};

const Search: React.FC<Props> = (props) => {
  const location = useLocation();
  const { search: searchParams } = location;

  const { isSearchInitialized, onSearch } = props;

  const isSearchBasicMode = useCallback(() => {
    const searchQuery = getUrlParams(searchParams);
    const ignoredKeys = [
      "page",
      "sort_key",
      "sort_order",
      "lease_state",
      "in_bbox",
      "visualization",
      "zoom",
      "intended_use",
      "service_unit",
    ];

    const keys = Object.keys(searchQuery).filter(
      (key) => !ignoredKeys.includes(key),
    );

    if (!keys.length || (keys.length === 1 && "search" in searchQuery)) {
      return true;
    }

    return false;
  }, [searchParams]);

  const [isBasicSearch, setIsBasicSearch] =
    useState<boolean>(isSearchBasicMode());

  const form = useForm();
  const isFetchingAttributes = useSelector(getIsFetchingAttributes);
  const leaseAttributes = useSelector(getLeaseAttributes);
  const lessors = useSelector(getLessorList);

  const decisionMakerOptions = useMemo(
    () =>
      getFieldOptions(leaseAttributes, LeaseDecisionsFieldPaths.DECISION_MAKER),
    [leaseAttributes],
  );

  const intendedUseOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseFieldPaths.INTENDED_USE),
    [leaseAttributes],
  );

  const municipalityOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseFieldPaths.MUNICIPALITY),
    [leaseAttributes],
  );

  const tenantTypeOptions = useMemo(
    () =>
      getFieldOptions(
        leaseAttributes,
        LeaseTenantContactSetFieldPaths.TYPE,
        false,
      ),
    [leaseAttributes],
  );

  const typeOptions = useMemo(
    () => getFieldOptions(leaseAttributes, LeaseFieldPaths.TYPE),
    [leaseAttributes],
  );

  const lessorOptions = useMemo(
    () => addEmptyOption(getContactOptions(lessors)),
    [lessors],
  );

  useEffect(() => {
    setIsBasicSearch(isSearchBasicMode());
  }, [isSearchBasicMode]);

  const toggleSearchType = () => {
    setIsBasicSearch((prevState) => !prevState);
  };

  const handleClear = () => {
    onSearch({}, true, true);
  };

  return (
    <SearchContainer onSubmit={form.submit}>
      <SearchFields
        decisionMakerOptions={decisionMakerOptions}
        intendedUseOptions={intendedUseOptions}
        isBasicSearch={isBasicSearch}
        isFetchingAttributes={isFetchingAttributes}
        isSearchInitialized={isSearchInitialized}
        lessorOptions={lessorOptions}
        municipalityOptions={municipalityOptions}
        onSearch={onSearch}
        tenantTypeOptions={tenantTypeOptions}
        typeOptions={typeOptions}
      />
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

export default Search;
