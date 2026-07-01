import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Field, useForm, useFormState } from "react-final-form";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import FormField from "@/components/form/final-form/FormField";
import {
  DateInput,
  Search as HdsSearch,
  RadioButton,
  Select,
  SelectionGroup,
  TextInput,
  type SearchProps,
} from "hds-react";
import SearchChangeTypeLink from "@/components/search/SearchChangeTypeLink";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import SearchInputColumn from "@/components/search/SearchInputColumn";
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
    return Boolean(!values?.tenant_name);
  };

  const districtOptions = getDistrictOptions(districts);
  const radioButtonsDisabled = formHasNoName();

  return (
    <>
      <DistrictLoader municipality={municipality} />
      {/* <Row>
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
      </Row> */}
      <Row>
        <Column small={12}>
          <Field name="search">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              // TODO: useMemo
              const searchTexts: SearchProps["texts"] = {
                searchPlaceholder: "Hae hakusanalla",
                error: error,
                historyLabel: "Hakuhistoria",
              };
              return (
                <HdsSearch
                  historyId={"lease-search"}
                  invalid={invalid}
                  // value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  onSend={(val) => {
                    onChange(val);
                  }}
                  texts={searchTexts}
                  visibleOptions={5.5}
                />
              );
            }}
          </Field>
        </Column>
      </Row>
      {!isBasicSearch && (
        <>
          <Row>
            {/* First column */}
            <Column small={12} large={6}>
              <SearchRow>
                <SearchInputColumn>
                  <Field name="tenant_name">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <TextInput
                          id="tenant_name"
                          label="Nimi"
                          invalid={invalid}
                          // value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          onFocus={onFocus}
                        />
                      );
                    }}
                  </Field>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <SelectionGroup label="Asiakkaan tila">
                    <Field name="tenant_activity" type="radio">
                      {({
                        input: { value, onBlur, onChange, onFocus },
                        meta: { error, invalid },
                      }) => {
                        return (
                          <RadioButton
                            id="tenant_activity-1"
                            name="tenant_activity"
                            value=""
                            label="Kaikki asiakkaat"
                            checked={value === ""}
                            onChange={onChange}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            disabled={radioButtonsDisabled}
                          />
                        );
                      }}
                    </Field>
                    <Field name="tenant_activity">
                      {({
                        input: { value, onBlur, onChange, onFocus },
                        meta: { error, invalid },
                      }) => {
                        return (
                          <RadioButton
                            id="tenant_activity-2"
                            name="tenant_activity"
                            value="past"
                            label="Vain entiset asiakkaat"
                            checked={value === "past"}
                            onChange={onChange}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            disabled={radioButtonsDisabled}
                          />
                        );
                      }}
                    </Field>
                    <Field name="tenant_activity">
                      {({
                        input: { value, onBlur, onChange, onFocus },
                        meta: { error, invalid },
                      }) => {
                        return (
                          <RadioButton
                            id="tenant_activity-3"
                            name="tenant_activity"
                            value="active"
                            label="Vain nykyiset asiakkaat"
                            checked={value === "active"}
                            onChange={onChange}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            disabled={radioButtonsDisabled}
                          />
                        );
                      }}
                    </Field>
                  </SelectionGroup>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <Field name="tenantcontact_type">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <Select
                          multiSelect
                          texts={{
                            label: "Asiakkaan rooli",
                            placeholder: "Valitse rooli",
                            language: "fi",
                          }}
                          options={tenantTypeOptions}
                          onChange={(selectedOptions) =>
                            onChange(
                              selectedOptions.map((option) => option.value),
                            )
                          }
                        />
                      );
                    }}
                  </Field>
                  {/* <FormField
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
                  /> */}
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <Field name="business_id">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <TextInput
                          id="business_id"
                          label="Y-tunnus"
                          invalid={invalid}
                          // value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          onFocus={onFocus}
                        />
                      );
                    }}
                  </Field>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <Field name="national_identification_number">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <TextInput
                          id="national_identification_number"
                          label="Henkilötunnus"
                          invalid={invalid}
                          // value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          onFocus={onFocus}
                        />
                      );
                    }}
                  </Field>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
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
                      <Field name="sequence">
                        {({
                          input: { value, onBlur, onChange, onFocus },
                          meta: { error, invalid },
                        }) => {
                          return (
                            <TextInput
                              id="sequence"
                              label="Juokseva numero"
                              invalid={invalid}
                              // value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              onFocus={onFocus}
                            />
                          );
                        }}
                      </Field>
                    </Column>
                  </Row>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <Field name="property_identifier">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <TextInput
                          id="property_identifier"
                          label="Kiinteistötunnus"
                          invalid={invalid}
                          // value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          onFocus={onFocus}
                        />
                      );
                    }}
                  </Field>
                </SearchInputColumn>
              </SearchRow>
              <SearchRow>
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
                <SearchInputColumn>
                  <Row>
                    <Column small={6}>
                      <Field name="lease_start_date_start">
                        {({
                          input: { value, onBlur, onChange, onFocus },
                          meta: { error, invalid },
                        }) => {
                          return (
                            <DateInput
                              helperText="Käytä muotoa P.K.VVVV"
                              id="lease_start_date_start"
                              initialMonth={new Date()}
                              label="Vuokrauksen alkupvm alkaen"
                              language="fi"
                              onChange={onChange}
                            />
                          );
                        }}
                      </Field>
                    </Column>
                    <Column small={6}>
                      <Field name="lease_start_date_end">
                        {({
                          input: { value, onBlur, onChange, onFocus },
                          meta: { error, invalid },
                        }) => {
                          return (
                            <DateInput
                              helperText="Käytä muotoa P.K.VVVV"
                              id="lease_start_date_end"
                              initialMonth={new Date()}
                              label="Vuokrauksen alkupvm loppuen"
                              language="fi"
                              onChange={onChange}
                            />
                          );
                        }}
                      </Field>
                    </Column>
                  </Row>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <Row>
                    <Column small={6}>
                      <Field name="lease_end_date_start">
                        {({
                          input: { value, onBlur, onChange, onFocus },
                          meta: { error, invalid },
                        }) => {
                          return (
                            <DateInput
                              helperText="Käytä muotoa P.K.VVVV"
                              id="lease_end_date_start"
                              initialMonth={new Date()}
                              label="Vuokrauksen loppupvm alkaen"
                              language="fi"
                              onChange={onChange}
                            />
                          );
                        }}
                      </Field>
                    </Column>
                    <Column small={6}>
                      <Field name="lease_end_date_end">
                        {({
                          input: { value, onBlur, onChange, onFocus },
                          meta: { error, invalid },
                        }) => {
                          return (
                            <DateInput
                              helperText="Käytä muotoa P.K.VVVV"
                              id="lease_end_date_end"
                              initialMonth={new Date()}
                              label="Vuokrauksen loppupvm loppuen"
                              language="fi"
                              onChange={onChange}
                            />
                          );
                        }}
                      </Field>
                    </Column>
                  </Row>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
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
                <SearchInputColumn>
                  <Field name="address">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <TextInput
                          id="address"
                          label="Vuokrakohteen osoite"
                          invalid={invalid}
                          // value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          onFocus={onFocus}
                        />
                      );
                    }}
                  </Field>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <Field name="contract_number">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <TextInput
                          id="contract_number"
                          label="Sopimusnro"
                          invalid={invalid}
                          // value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          onFocus={onFocus}
                        />
                      );
                    }}
                  </Field>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
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
                      <Field name="decision_section">
                        {({
                          input: { value, onBlur, onChange, onFocus },
                          meta: { error, invalid },
                        }) => {
                          return (
                            <TextInput
                              id="decision_section"
                              label="Pykälä (§)"
                              invalid={invalid}
                              // value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              onFocus={onFocus}
                              // unit="§"
                            />
                          );
                        }}
                      </Field>
                    </Column>
                  </Row>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <Field name="reference_number">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <TextInput
                          id="reference_number"
                          label="Diaarinro"
                          invalid={invalid}
                          // value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          onFocus={onFocus}
                        />
                      );
                    }}
                  </Field>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
                <SearchInputColumn>
                  <Field name="invoice_number">
                    {({
                      input: { value, onBlur, onChange, onFocus },
                      meta: { error, invalid },
                    }) => {
                      return (
                        <TextInput
                          id="invoice_number"
                          label="Laskunro"
                          invalid={invalid}
                          // value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          onFocus={onFocus}
                        />
                      );
                    }}
                  </Field>
                </SearchInputColumn>
              </SearchRow>

              <SearchRow>
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
