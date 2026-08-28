import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Field, useForm, useFormState } from "react-final-form";
import { isEqual } from "lodash-es";
import {
  Checkbox,
  DateInput,
  Search as HdsSearch,
  RadioButton,
  Select,
  SelectionGroup,
  TextInput,
  type SearchProps,
  type OptionInProps,
  Fieldset,
  Button,
  ButtonSize,
  ButtonVariant,
  IconPlusCircleFill,
  IconTrash,
  IconMinus,
  IconEye,
  IconEyeCrossed,
} from "hds-react";

import {
  getFieldOptions,
  getUrlParams,
  isMethodAllowed,
  toHdsOption,
} from "@/util/helpers";
import { Methods } from "@/enums";
import {
  getMethods as getLeaseMethods,
  getAttributes as getLeaseAttributes,
} from "@/leases/selectors";
import { useIntendedUses } from "@/intendedUse/useIntendedUses";
import Authorization from "@/components/authorization/Authorization";
import { ButtonLabels } from "@/components/enums";
import SearchContainer from "@/components/search/SearchContainer";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchRow from "@/components/search/SearchRow";
import { Row, Column } from "@/components/grid/Grid";
import { fetchDistrictsByMunicipality } from "@/district/actions";
import {
  LeaseDecisionsFieldPaths,
  LeaseFieldPaths,
  LeaseTenantContactSetFieldPaths,
} from "@/leases/enums";
import { getContactOptions } from "@/contacts/helpers";
import type { Contact } from "@/contacts/types";
import { getDistrictOptions } from "@/district/helpers";
import {
  filterSelectedGroupedOptions,
  filterSelectedOptions,
} from "@/leases/helpers";
import { getDistrictsByMunicipality } from "@/district/selectors";
import { getLessorList } from "@/lessor/selectors";
import { preparationStateFilterOptions } from "@/leases/constants";
import useLocalStorageState from "@/util/useLocalStorageState";
import { LeaseFieldTitles } from "@/leases/enums";
import { fetchOfficers } from "@/users/requestsAsync";
import { getUserOptions } from "@/users/helpers";

const PreparerOwnLeasesOption = {
  label: "Omat vuokraukset",
  value: "preparers_own_leases",
};

type Props = {
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  showCreateLeaseModal: () => void;
};

type DistrictLoaderProps = {
  municipality: any;
};

const SECTIONS = {
  target: {
    label: "Kohde",
    fields: [
      "lessor",
      "intended_use",
      "address",
      "property_identifier",
      "type",
      "municipality",
      "district",
      "sequence",
    ],
  },
  dates: {
    label: "Voimassaolo",
    fields: [
      "lease_start_date_start",
      "lease_start_date_end",
      "lease_end_date_start",
      "lease_end_date_end",
      "only_active_leases",
      "only_expired_leases",
    ],
  },
  decision: {
    label: "Päätös ja laskutus",
    fields: [
      "decision_date",
      "decision_maker",
      "decision_section",
      "reference_number",
      "contract_number",
      "institution_identifier",
      "invoice_number",
    ],
  },
  tenant: {
    label: "Asiakas",
    fields: [
      "tenant_name",
      "tenantcontact_type",
      "business_id",
      "national_identification_number",
      "tenant_activity",
    ],
  },
  preparation: {
    label: "Valmistelu",
    fields: ["preparation_state"],
  },
} as const satisfies Record<string, { label: string; fields: Array<string> }>;

type SearchSectionKey = keyof typeof SECTIONS;

type SearchSectionVisibility = Record<SearchSectionKey, boolean>;

const NON_SECTION_QUERY_KEYS = new Set([
  "page",
  "sort_key",
  "sort_order",
  "lease_state",
  "in_bbox",
  "visualization",
  "zoom",
  "service_unit",
  "preparer",
  "preparers_own_leases",
]);

const Search: React.FC<Props> = ({
  isSearchInitialized,
  onSearch,
  showCreateLeaseModal,
}) => {
  const location = useLocation();
  const { search: searchParams } = location;

  const form = useForm();
  const { values, dirty } = useFormState();
  const municipality = values.municipality;
  const districts = useSelector((state: any) =>
    getDistrictsByMunicipality(state, Number(municipality)),
  );
  const leaseMethods = useSelector(getLeaseMethods);

  const prevValues = useRef(values);

  useEffect(() => {
    // Avoid URL/form synchronization feedback loops: only push search updates
    // for user-originated edits, not for value changes caused by reinitialize.
    if (isSearchInitialized && dirty && !isEqual(prevValues.current, values)) {
      onSearch({ ...values, page: undefined }, true, false);
    }
    prevValues.current = values;
  }, [values, dirty, isSearchInitialized, onSearch]);

  const districtOptions = getDistrictOptions(
    districts,
    false,
  ) as Array<OptionInProps>;

  const searchTexts: SearchProps["texts"] = useMemo(
    () => ({
      searchPlaceholder: "Hae hakusanalla",
      historyLabel: "Hakuhistoria",
    }),
    [],
  );
  const toggleSection = (key: SearchSectionKey) => {
    setVisibleSections((prev) => {
      const next = { ...prev, [key]: !prev[key] };

      // When hiding a section, clear its field values so the hidden filters
      // don't keep affecting the search silently.
      if (!next[key]) {
        SECTIONS[key].fields.forEach((fieldName) => {
          form.change(fieldName, undefined);
        });
      }

      return next;
    });
  };

  const handleClear = () => {
    onSearch({}, true, true);
  };

  const leaseAttributes = useSelector(getLeaseAttributes);
  const lessors = useSelector(getLessorList) as Array<Contact>;
  const { intendedUseList, isFetchingIntendedUses } = useIntendedUses();

  const decisionMakerOptions = useMemo(
    () =>
      getFieldOptions(
        leaseAttributes,
        LeaseDecisionsFieldPaths.DECISION_MAKER,
        false,
      ).map(toHdsOption),
    [leaseAttributes],
  );

  const intendedUseGroupedOptions = useMemo(() => {
    if (!Array.isArray(intendedUseList) || !intendedUseList?.length) {
      return [];
    }

    const serviceUnits = Object.fromEntries(
      getFieldOptions(leaseAttributes, LeaseFieldPaths.SERVICE_UNIT, false).map(
        (opt) => [opt.value, opt.label],
      ),
    );

    const intendedUsesByServiceUnit = Object.groupBy(
      intendedUseList,
      (item) => serviceUnits[item.service_unit] || "Muut",
    );
    // Note: This gets all IntendedUse's on purpose, even those that are not active (is_active=false).
    // For now no reason to not allow filtering for inactive IntendedUse's has come up.
    const groupedOptions = Object.entries(intendedUsesByServiceUnit).map(
      ([label, options]) => ({
        label,
        options: options.map((item) => ({
          label: item.name,
          value: String(item.id),
        })),
      }),
    );

    return groupedOptions;
  }, [intendedUseList, leaseAttributes]);

  const municipalityOptions = useMemo(
    () =>
      getFieldOptions(leaseAttributes, LeaseFieldPaths.MUNICIPALITY, false).map(
        toHdsOption,
      ),
    [leaseAttributes],
  );

  const municipalityGroupedOptions = useMemo(() => {
    const helsinki = municipalityOptions.filter((opt) =>
      opt.label.toLocaleLowerCase().includes("helsinki"),
    );
    const others = municipalityOptions.filter(
      (opt) => !opt.label.toLocaleLowerCase().includes("helsinki"),
    );

    return [
      { label: "Helsinki", options: helsinki },
      { label: "Ulkokunnat", options: others },
    ];
  }, [municipalityOptions]);

  const tenantTypeOptions = useMemo(
    () =>
      getFieldOptions(
        leaseAttributes,
        LeaseTenantContactSetFieldPaths.TYPE,
        false,
      ).map(toHdsOption),
    [leaseAttributes],
  );

  const typeOptions = useMemo(
    () =>
      getFieldOptions(leaseAttributes, LeaseFieldPaths.TYPE, false).map(
        toHdsOption,
      ),
    [leaseAttributes],
  );

  const lessorOptions = useMemo(
    () => getContactOptions(lessors),
    [lessors],
  ).map(toHdsOption);

  const serviceUnitOptions = useMemo(
    () =>
      getFieldOptions(leaseAttributes, "service_unit", false).map(toHdsOption),
    [leaseAttributes],
  );

  const leaseStateOptions = useMemo(
    () => getFieldOptions(leaseAttributes, "state", false).map(toHdsOption),
    [leaseAttributes],
  );

  const [preparerOptions, setPreparerOptions] = useState<Array<OptionInProps>>(
    [],
  );
  useEffect(() => {
    fetchOfficers({ limit: 300 }).then((users) => {
      setPreparerOptions(getUserOptions(users).map(toHdsOption));
    });
  }, []);

  const sectionsFromParams = useMemo((): SearchSectionVisibility => {
    const searchQuery = getUrlParams(searchParams);
    const activeKeys = new Set(
      Object.keys(searchQuery).filter(
        (key) => !NON_SECTION_QUERY_KEYS.has(key) && key !== "search",
      ),
    );
    return (Object.keys(SECTIONS) as Array<SearchSectionKey>).reduce(
      (acc, key) => {
        acc[key] = SECTIONS[key].fields.some((field) => activeKeys.has(field));
        return acc;
      },
      {} as SearchSectionVisibility,
    );
  }, [searchParams]);

  const [visibleSections, setVisibleSections] =
    useLocalStorageState<SearchSectionVisibility>(
      "lease-search-visible-sections",
      sectionsFromParams,
    );

  // Persist newly-opened sections back to localStorage when searchParams changes.
  useEffect(() => {
    setVisibleSections((prev) => {
      const merged = { ...prev };
      (Object.keys(sectionsFromParams) as Array<SearchSectionKey>).forEach(
        (key) => {
          if (sectionsFromParams[key]) merged[key] = true;
        },
      );
      return isEqual(merged, prev) ? prev : merged;
    });
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Merge URL-derived sections into the current visibility from localStorage.
  // Practically means that if user opens a link that has a queryparam, this
  // queryparams section will be opened even if it is not open according to localStorage.
  const mergedVisibleSections = useMemo(() => {
    const merged = { ...visibleSections };
    (Object.keys(sectionsFromParams) as Array<SearchSectionKey>).forEach(
      (key) => {
        if (sectionsFromParams[key]) merged[key] = true;
      },
    );
    return merged;
  }, [visibleSections, sectionsFromParams]);

  const anySectionVisible = Object.values(mergedVisibleSections).some(Boolean);

  const sectionTarget = (
    <Fieldset
      heading="Kohde"
      className="lease-search-fieldset-group lease-search-fieldset-group--target"
    >
      <SearchRow>
        <Row>
          <Field name="lessor">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <Select
                  id="lessor"
                  texts={{
                    label: "Vuokranantaja",
                    placeholder: "Valitse vuokranantaja",
                    language: "fi",
                  }}
                  value={filterSelectedOptions(value, lessorOptions)}
                  options={lessorOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  clearable
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
          <Field name="intended_use">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <Select
                  id="intended_use"
                  texts={{
                    label: "Vuokrauksen käyttötarkoitus",
                    placeholder: "Valitse käyttötarkoitus",
                    language: "fi",
                  }}
                  disabled={isFetchingIntendedUses}
                  value={filterSelectedGroupedOptions(
                    value,
                    intendedUseGroupedOptions,
                  )}
                  groups={intendedUseGroupedOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  multiSelect
                  noTags
                  clearable
                  filter={(option, filterStr) =>
                    option.label.toLowerCase().includes(filterStr.toLowerCase())
                  }
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
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
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
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
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
        </Row>
      </SearchRow>

      <SearchRow>
        <Row>
          <Field name="type">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              const selectedOption = typeOptions.filter(
                (option) => value == option.value,
              );
              return (
                <Select
                  id="type"
                  texts={{
                    label: "Laji",
                    placeholder: "Valitse laji",
                    language: "fi",
                  }}
                  value={selectedOption}
                  options={typeOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  clearable
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
          <Field name="municipality">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <Select
                  id="municipality"
                  texts={{
                    label: "Kunta",
                    placeholder: "Valitse kunta",
                    language: "fi",
                  }}
                  value={filterSelectedGroupedOptions(
                    value,
                    municipalityGroupedOptions,
                  )}
                  groups={municipalityGroupedOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  clearable
                  multiSelect
                  noTags
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
          <Field name="district">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              const selectedOption = districtOptions.filter(
                (option) => value == option.value,
              );
              return (
                <Select
                  id="district"
                  texts={{
                    label: "Kaupunginosa",
                    placeholder: "Valitse kaupunginosa",
                    language: "fi",
                  }}
                  value={selectedOption}
                  options={districtOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  disabled={
                    // Only allow district selection if one municipality is selected.
                    // Fetching districts from multiple municipalities adds complexity and creates a confusing experience.
                    !municipality || municipality.length !== 1
                  }
                  clearable
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
          <IconMinus
            aria-hidden="true"
            focusable="false"
            style={{
              alignSelf: "flex-end",
              marginBottom: "24px",
              marginLeft: "-0.9rem",
              marginRight: "-0.9rem",
              maxWidth: "20px",
            }}
          />
          <Field name="sequence">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <TextInput
                  id="sequence"
                  label="Tunnus"
                  invalid={invalid}
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ maxWidth: "120px" }}
                />
              );
            }}
          </Field>
        </Row>
      </SearchRow>
    </Fieldset>
  );

  const sectionDates = (
    <Fieldset
      heading="Voimassaolo"
      className="lease-search-fieldset-group lease-search-fieldset-group--dates"
    >
      <SearchRow>
        <Row>
          <Field name="lease_start_date_start">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <DateInput
                  id="lease_start_date_start"
                  initialMonth={new Date()}
                  label="Vuokrauksen alkupvm alkaen"
                  language="fi"
                  value={value || ""}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  onChange={(nextValue) => onChange(nextValue)}
                  style={{ width: "100%" }}
                  disableConfirmation
                />
              );
            }}
          </Field>
          <Field name="lease_start_date_end">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <DateInput
                  id="lease_start_date_end"
                  initialMonth={new Date()}
                  label="Vuokrauksen alkupvm loppuen"
                  language="fi"
                  value={value || ""}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  onChange={(nextValue) => onChange(nextValue)}
                  style={{ width: "100%" }}
                  disableConfirmation
                />
              );
            }}
          </Field>
          <Field name="lease_end_date_start">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <DateInput
                  id="lease_end_date_start"
                  initialMonth={new Date()}
                  label="Vuokrauksen loppupvm alkaen"
                  language="fi"
                  value={value || ""}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  onChange={(nextValue) => onChange(nextValue)}
                  style={{ width: "100%" }}
                  disableConfirmation
                />
              );
            }}
          </Field>
          <Field name="lease_end_date_end">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <DateInput
                  id="lease_end_date_end"
                  initialMonth={new Date()}
                  label="Vuokrauksen loppupvm loppuen"
                  language="fi"
                  value={value || ""}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  onChange={(nextValue) => onChange(nextValue)}
                  style={{ width: "100%" }}
                  disableConfirmation
                />
              );
            }}
          </Field>
        </Row>
      </SearchRow>

      <SearchRow>
        <SearchInputColumn>
          <Row>
            <Column small={6}>
              <SelectionGroup direction="horizontal">
                <Field name="only_active_leases">
                  {({
                    input: { value, onBlur, onChange, onFocus },
                    meta: { error, invalid },
                  }) => {
                    return (
                      <Checkbox
                        label="Voimassa"
                        id="only_active_leases"
                        checked={value === true || value === "true"}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onChange={(event) =>
                          onChange(event.target.checked ? true : undefined)
                        }
                      />
                    );
                  }}
                </Field>
                <Field name="only_expired_leases">
                  {({
                    input: { value, onBlur, onChange, onFocus },
                    meta: { error, invalid },
                  }) => {
                    return (
                      <Checkbox
                        label="Päättyneet"
                        id="only_expired_leases"
                        checked={value === true || value === "true"}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onChange={(event) =>
                          onChange(event.target.checked ? true : undefined)
                        }
                      />
                    );
                  }}
                </Field>
              </SelectionGroup>
            </Column>
          </Row>
        </SearchInputColumn>
      </SearchRow>
    </Fieldset>
  );

  const sectionDecision = (
    <Fieldset
      heading="Päätös ja laskutus"
      className="lease-search-fieldset-group lease-search-fieldset-group--decision"
    >
      <SearchRow>
        <Row>
          <Field name="decision_date">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <DateInput
                  helperText="Käytä muotoa P.K.VVVV"
                  id="decision_date"
                  initialMonth={new Date()}
                  label="Päätöspvm"
                  language="fi"
                  value={value || ""}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  onChange={(nextValue) => onChange(nextValue)}
                  style={{ width: "100%" }}
                  disableConfirmation
                />
              );
            }}
          </Field>
          <Field name="decision_maker">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              const selectedOption = decisionMakerOptions.filter(
                (option) => value == option.value,
              );
              return (
                <Select
                  id="decision_maker"
                  texts={{
                    label: "Päätöksentekijä",
                    placeholder: "Valitse päätöksentekijä",
                    language: "fi",
                  }}
                  value={selectedOption}
                  options={decisionMakerOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  clearable
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
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
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
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
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
        </Row>
      </SearchRow>
      <SearchRow>
        <Row>
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
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
          <Field name="institution_identifier">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <TextInput
                  id="institution_identifier"
                  label="Laitostunnus"
                  invalid={invalid}
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
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
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
        </Row>
      </SearchRow>
    </Fieldset>
  );

  const sectionTenant = (
    <Fieldset
      heading="Asiakas"
      className="lease-search-fieldset-group lease-search-fieldset-group--tenant"
    >
      <SearchRow>
        <Row>
          <Field name="tenant_name">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <TextInput
                  id="tenant_name"
                  label="Asiakkaan nimi"
                  invalid={invalid}
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
          <Field name="tenantcontact_type">
            {({
              input: { value, onBlur, onChange, onFocus },
              meta: { error, invalid },
            }) => {
              return (
                <Select
                  id="tenantcontact_type"
                  texts={{
                    label: "Asiakkaan rooli",
                    placeholder: "Valitse rooli",
                    language: "fi",
                  }}
                  value={filterSelectedOptions(value, tenantTypeOptions)}
                  options={tenantTypeOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  clearable
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
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
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
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
                  value={value || ""}
                  onBlur={onBlur}
                  onChange={onChange}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
        </Row>
      </SearchRow>
      <SearchRow>
        <SearchInputColumn>
          <SelectionGroup
            label="Asiakkaan tila"
            direction="horizontal"
            style={{ width: "100%" }}
          >
            <Field name="tenant_activity" key="tenant_activity-1">
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
                  />
                );
              }}
            </Field>
            <Field name="tenant_activity" key="tenant_activity-2">
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
                  />
                );
              }}
            </Field>
            <Field name="tenant_activity" key="tenant_activity-3">
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
                  />
                );
              }}
            </Field>
          </SelectionGroup>
        </SearchInputColumn>
      </SearchRow>
    </Fieldset>
  );

  const sectionPreparation = (
    <Fieldset
      heading="Valmistelu"
      className="lease-search-fieldset-group lease-search-fieldset-group--preparation"
    >
      <SearchRow style={{ alignItems: "center" }}>
        <Row>
          <Field name="preparation_state">
            {({ input: { value, onChange } }) => {
              const selectedOptions = preparationStateFilterOptions.filter(
                (option) =>
                  (Array.isArray(value) ? value : [value]).some(
                    (v) => v == option.value,
                  ),
              );

              return (
                <Select
                  id="preparation_state"
                  texts={{
                    label: "Valmistelu kesken",
                    placeholder: "Valitse vaihe",
                    language: "fi",
                  }}
                  value={selectedOptions}
                  options={preparationStateFilterOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  multiSelect
                  noTags
                  clearable
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
        </Row>
      </SearchRow>
    </Fieldset>
  );

  return (
    <SearchContainer onSubmit={form.submit}>
      <DistrictLoader municipality={municipality} />
      <Row className="lease-search-row">
        <Authorization allow={isMethodAllowed(leaseMethods, Methods.POST)}>
          <Button
            variant={ButtonVariant.Supplementary}
            iconStart={<IconPlusCircleFill />}
            onClick={showCreateLeaseModal}
          >
            {ButtonLabels.CREATE_LEASE_IDENTIFIER}
          </Button>
        </Authorization>

        <Field name="search">
          {({
            input: { value, onBlur, onChange, onFocus },
            meta: { error, invalid },
          }) => {
            return (
              <HdsSearch
                historyId={"lease-search"}
                invalid={invalid}
                value={value || ""}
                onBlur={onBlur}
                onChange={onChange}
                onFocus={onFocus}
                onSend={(val) => {
                  onChange(val);
                }}
                texts={searchTexts}
                visibleOptions={5.5}
                style={{ width: "100%" }}
              />
            );
          }}
        </Field>
        <Button
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Small}
          iconEnd={<IconTrash />}
          onClick={handleClear}
          style={{ marginLeft: "auto" }}
        >
          Tyhjennä haku
        </Button>
      </Row>

      <Row className="lease-search-section-toggles">
        {(
          Object.entries(SECTIONS) as Array<
            [SearchSectionKey, { label: string; fields: Array<string> }]
          >
        ).map(([key, { label }]) => (
          <Button
            key={key}
            id={`lease-search-toggle-${key}`}
            size={ButtonSize.Small}
            variant={
              mergedVisibleSections[key]
                ? ButtonVariant.Primary
                : ButtonVariant.Supplementary
            }
            aria-pressed={mergedVisibleSections[key]}
            onClick={() => toggleSection(key)}
            iconStart={
              mergedVisibleSections[key] ? <IconEye /> : <IconEyeCrossed />
            }
          >
            {label}
          </Button>
        ))}
      </Row>

      {anySectionVisible && (
        <>
          <Row>
            {/* First column */}
            <Column small={12} large={12}>
              <Fieldset
                heading="Tarkennettu haku"
                className="lease-search-advanced-section"
              >
                {mergedVisibleSections.target && sectionTarget}
                {mergedVisibleSections.dates && sectionDates}
                {mergedVisibleSections.decision && sectionDecision}
                {mergedVisibleSections.tenant && sectionTenant}
                {mergedVisibleSections.preparation && sectionPreparation}
              </Fieldset>
            </Column>
          </Row>
        </>
      )}

      <SearchRow>
        <Row className="lease-search-fieldset-group">
          <Field name="service_unit">
            {({ input: { value, onChange } }) => (
              <Select
                id="service_unit"
                texts={{
                  label: LeaseFieldTitles.SERVICE_UNIT,
                  placeholder: "Valitse palvelukokonaisuus",
                  language: "fi",
                }}
                value={filterSelectedOptions(value, serviceUnitOptions)}
                options={serviceUnitOptions}
                onChange={(selectedOptions) =>
                  onChange(selectedOptions.map((option) => option.value))
                }
                style={{ width: "100%" }}
                multiSelect
                noTags
                clearable
              />
            )}
          </Field>
          <Field name="lease_state">
            {({ input: { value, onChange } }) => {
              const selected = leaseStateOptions.filter((option) =>
                (Array.isArray(value) ? value : [value]).some(
                  (v) => v == option.value,
                ),
              );
              return (
                <Select
                  id="lease_state"
                  texts={{
                    label: "Tyyppi",
                    placeholder: "Valitse tyyppi",
                    language: "fi",
                  }}
                  value={selected}
                  options={leaseStateOptions}
                  onChange={(selectedOptions) =>
                    onChange(selectedOptions.map((option) => option.value))
                  }
                  style={{ width: "100%" }}
                  multiSelect
                  noTags
                  clearable
                />
              );
            }}
          </Field>
          <Field name="preparer">
            {({ input: { value, onChange } }) => {
              // Combines "preparer" and "preparers_own_leases" into one select
              const allPreparers = [
                PreparerOwnLeasesOption,
                ...preparerOptions,
              ];
              const selected =
                value === PreparerOwnLeasesOption.value
                  ? [PreparerOwnLeasesOption]
                  : preparerOptions.filter((option) =>
                      (Array.isArray(value) ? value : [value]).some(
                        (v) => v == option.value,
                      ),
                    );
              return (
                <Select
                  id="preparer"
                  texts={{
                    label: "Valmistelija",
                    placeholder: "Valitse valmistelija",
                    language: "fi",
                  }}
                  value={selected}
                  options={allPreparers}
                  filter={(option, filterStr) =>
                    option.label.toLowerCase().includes(filterStr.toLowerCase())
                  }
                  onChange={(selectedOptions) => {
                    if (
                      selectedOptions.some(
                        (option) =>
                          option.value === PreparerOwnLeasesOption.value,
                      )
                    ) {
                      onChange(PreparerOwnLeasesOption.value);
                    } else {
                      onChange(selectedOptions.map((option) => option.value));
                    }
                  }}
                  clearable
                  style={{ width: "100%" }}
                />
              );
            }}
          </Field>
        </Row>
      </SearchRow>
    </SearchContainer>
  );
};

const DistrictLoader = ({ municipality }: DistrictLoaderProps) => {
  const form = useForm();
  const dispatch = useDispatch();
  const firstUpdate = useRef(true);
  const prevValue = useRef(municipality);

  useEffect(() => {
    // Avoids double fetching when changing the selected options.
    if (isEqual(prevValue.current, municipality)) {
      return;
    }
    prevValue.current = municipality;

    if (municipality?.length === 1) {
      dispatch(fetchDistrictsByMunicipality(Number(municipality)));
    }

    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    form.change("district", "");
  }, [dispatch, form, municipality]);

  return null;
};

export default Search;
