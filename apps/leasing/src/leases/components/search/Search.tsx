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
import isEqual from "lodash/isEqual";
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
  IconAngleUp,
  IconAngleDown,
  IconTrash,
} from "hds-react";
import type { SelectProps } from "hds-react/lib/components/dropdownComponents/select/types";
import {
  getFieldOptions,
  getUrlParams,
  isMethodAllowed,
  toHdsOption,
} from "@/util/helpers";
import { Methods } from "@/enums";
import { getMethods as getLeaseMethods } from "@/leases/selectors";
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
import { getDistrictOptions } from "@/district/helpers";
import { getDistrictsByMunicipality } from "@/district/selectors";
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes,
} from "@/leases/selectors";
import { getLessorList } from "@/lessor/selectors";
import type { SelectOptionHds } from "@/types";

type Props = {
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  showCreateLeaseModal: () => void;
};

type DistrictLoaderProps = {
  municipality: any;
};

interface SearchFieldsProps {
  isBasicSearch: boolean;
  setIsBasicSearch: React.Dispatch<React.SetStateAction<boolean>>;
  isFetchingAttributes: boolean;
  isFetchingIntendedUses: boolean;
  decisionMakerOptions: Array<SelectOptionHds>;
  intendedUseGroupedOptions: SelectProps["groups"];
  municipalityOptions: Array<SelectOptionHds>;
  tenantTypeOptions: Array<SelectOptionHds>;
  lessorOptions: Array<SelectOptionHds>;
  typeOptions: Array<SelectOptionHds>;
  onSearch: (
    formValues: Record<string, any>,
    resetActivePage: boolean,
    resetFilters: boolean,
  ) => void;
  isSearchInitialized: boolean;
  showCreateLeaseModal: () => void;
}

const BASIC_MODE_IGNORED_QUERY_KEYS = new Set([
  "page",
  "sort_key",
  "sort_order",
  "lease_state",
  "in_bbox",
  "visualization",
  "zoom",
  "intended_use",
  "service_unit",
]);

const SearchFields = ({
  isBasicSearch,
  setIsBasicSearch,
  decisionMakerOptions,
  intendedUseGroupedOptions,
  isFetchingIntendedUses,
  municipalityOptions,
  tenantTypeOptions,
  lessorOptions,
  typeOptions,
  onSearch,
  isSearchInitialized,
  showCreateLeaseModal,
}: SearchFieldsProps) => {
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
  const toggleSearchType = () => {
    setIsBasicSearch((prevState: boolean) => !prevState);
  };

  const handleClear = () => {
    onSearch({}, true, true);
  };

  return (
    <>
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
          onClick={toggleSearchType}
          iconStart={isBasicSearch ? <IconAngleDown /> : <IconAngleUp />}
        >
          {isBasicSearch ? "Tarkennettu haku" : "Yksinkertainen haku"}
        </Button>
      </Row>
      {!isBasicSearch && (
        <>
          <Row>
            {/* First column */}
            <Column small={12} large={12}>
              <Fieldset heading="Tarkennettu haku" border>
                <Fieldset
                  heading=""
                  className="lease-search-fieldset-group lease-search-fieldset-group__gap"
                >
                  <SearchRow>
                    <Row>
                      <Field name="lessor">
                        {({
                          input: { value, onBlur, onChange, onFocus },
                          meta: { error, invalid },
                        }) => {
                          const selectedOptions = lessorOptions.filter(
                            (option) =>
                              (Array.isArray(value) ? value : [value]).some(
                                (v) => v == option.value,
                              ),
                          );
                          return (
                            <Select
                              id="lessor"
                              texts={{
                                label: "Vuokranantaja",
                                placeholder: "Valitse vuokranantaja",
                                language: "fi",
                              }}
                              value={selectedOptions}
                              options={lessorOptions}
                              onChange={(selectedOptions) =>
                                onChange(
                                  selectedOptions.map((option) => option.value),
                                )
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
                          const selectedOptions = intendedUseGroupedOptions
                            .flatMap((group) => group.options)
                            .filter((option) =>
                              (Array.isArray(value) ? value : [value]).some(
                                (v) => v == option.value,
                              ),
                            );

                          return (
                            <Select
                              id="intended_use"
                              texts={{
                                label: "Vuokrauksen käyttötarkoitus",
                                placeholder: "Valitse käyttötarkoitus",
                                language: "fi",
                              }}
                              disabled={isFetchingIntendedUses}
                              value={selectedOptions}
                              groups={intendedUseGroupedOptions}
                              onChange={(selectedOptions) =>
                                onChange(
                                  selectedOptions.map((option) => option.value),
                                )
                              }
                              multiSelect
                              noTags
                              clearable
                              filter={(option, filterStr) =>
                                option.label
                                  .toLowerCase()
                                  .includes(filterStr.toLowerCase())
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
                                onChange(
                                  selectedOptions.map((option) => option.value),
                                )
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
                          const selectedOption = municipalityOptions.filter(
                            (option) => value == option.value,
                          );
                          return (
                            <Select
                              id="municipality"
                              texts={{
                                label: "Kunta",
                                placeholder: "Valitse kunta",
                                language: "fi",
                              }}
                              value={selectedOption}
                              options={municipalityOptions}
                              onChange={(selectedOptions) =>
                                onChange(
                                  selectedOptions.map((option) => option.value),
                                )
                              }
                              clearable
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
                                onChange(
                                  selectedOptions.map((option) => option.value),
                                )
                              }
                              disabled={!municipality}
                              clearable
                              style={{ width: "100%" }}
                            />
                          );
                        }}
                      </Field>
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
                <Fieldset
                  heading=""
                  className="lease-search-fieldset-group lease-search-fieldset-group__gap"
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
                              helperText="Käytä muotoa P.K.VVVV"
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
                              helperText="Käytä muotoa P.K.VVVV"
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
                              helperText="Käytä muotoa P.K.VVVV"
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
                              helperText="Käytä muotoa P.K.VVVV"
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
                                    onChange(
                                      event.target.checked ? true : undefined,
                                    )
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
                                    onChange(
                                      event.target.checked ? true : undefined,
                                    )
                                  }
                                />
                              );
                            }}
                          </Field>
                        </Column>
                      </Row>
                    </SearchInputColumn>
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
                              value={value || ""}
                              onBlur={onBlur}
                              onChange={onChange}
                              onFocus={onFocus}
                              style={{ width: "100%" }}
                            />
                          );
                        }}
                      </Field>
                    </SearchInputColumn>
                  </SearchRow>
                </Fieldset>

                <Fieldset
                  heading=""
                  className="lease-search-fieldset-group lease-search-fieldset-group__gap"
                >
                  <SearchRow>
                    <Row>
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
                  <SearchRow>
                    <Row>
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
                                onChange(
                                  selectedOptions.map((option) => option.value),
                                )
                              }
                              clearable
                              style={{ width: "100%" }}
                            />
                          );
                        }}
                      </Field>
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
                    </Row>
                  </SearchRow>
                </Fieldset>

                <Fieldset
                  heading=""
                  className="lease-search-fieldset-group lease-search-fieldset-group__gap"
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
                          const selectedOptions = tenantTypeOptions.filter(
                            (option) =>
                              (Array.isArray(value) ? value : [value]).some(
                                (v) => v == option.value,
                              ),
                          );
                          return (
                            <Select
                              id="tenantcontact_type"
                              texts={{
                                label: "Asiakkaan rooli",
                                placeholder: "Valitse rooli",
                                language: "fi",
                              }}
                              value={selectedOptions}
                              options={tenantTypeOptions}
                              onChange={(selectedOptions) =>
                                onChange(
                                  selectedOptions.map((option) => option.value),
                                )
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

                <Fieldset heading="" className="lease-search-fieldset-group">
                  <SearchRow style={{ alignItems: "center" }}>
                    <Row>
                      <SelectionGroup
                        label="Pikavalinnat"
                        direction="horizontal"
                      >
                        <Field name="preparers_own_leases">
                          {({
                            input: { value, onBlur, onChange, onFocus },
                            meta: { error, invalid },
                          }) => {
                            return (
                              <Checkbox
                                label="Omat vuokraukset"
                                id="preparers_own_leases"
                                checked={value === true || value === "true"}
                                onBlur={onBlur}
                                onFocus={onFocus}
                                onChange={(event) =>
                                  onChange(
                                    event.target.checked ? true : undefined,
                                  )
                                }
                              />
                            );
                          }}
                        </Field>
                        <Field name="has_not_geometry">
                          {({
                            input: { value, onBlur, onChange, onFocus },
                            meta: { error, invalid },
                          }) => {
                            return (
                              <Checkbox
                                label="Geometria puuttuu"
                                id="has_not_geometry"
                                checked={value === true || value === "true"}
                                onBlur={onBlur}
                                onFocus={onFocus}
                                onChange={(event) =>
                                  onChange(
                                    event.target.checked ? true : undefined,
                                  )
                                }
                              />
                            );
                          }}
                        </Field>
                      </SelectionGroup>
                    </Row>
                    <Button
                      variant={ButtonVariant.Secondary}
                      size={ButtonSize.Small}
                      iconEnd={<IconTrash />}
                      onClick={handleClear}
                    >
                      Tyhjennä haku
                    </Button>
                  </SearchRow>
                </Fieldset>
              </Fieldset>
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

  const { isSearchInitialized, onSearch, showCreateLeaseModal } = props;

  const isSearchBasicMode = useCallback(() => {
    const searchQuery = getUrlParams(searchParams);
    const keys = Object.keys(searchQuery).filter(
      (key) => !BASIC_MODE_IGNORED_QUERY_KEYS.has(key),
    );

    return !keys.length || (keys.length === 1 && keys[0] === "search");
  }, [searchParams]);

  const [isBasicSearch, setIsBasicSearch] =
    useState<boolean>(isSearchBasicMode());
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);

  if (prevSearchParams !== searchParams) {
    setPrevSearchParams(searchParams);

    // Only auto-expand advanced search if there are advanced search parameters.
    // Don't auto-collapse if they are removed.
    if (!isSearchBasicMode()) {
      setIsBasicSearch(false);
    }
  }

  const form = useForm();
  const isFetchingAttributes = useSelector(getIsFetchingAttributes);
  const leaseAttributes = useSelector(getLeaseAttributes);
  const lessors = useSelector(getLessorList);
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

  return (
    <SearchContainer onSubmit={form.submit}>
      <SearchFields
        decisionMakerOptions={decisionMakerOptions}
        intendedUseGroupedOptions={intendedUseGroupedOptions}
        isBasicSearch={isBasicSearch}
        setIsBasicSearch={setIsBasicSearch}
        isFetchingAttributes={isFetchingAttributes}
        isFetchingIntendedUses={isFetchingIntendedUses}
        isSearchInitialized={isSearchInitialized}
        lessorOptions={lessorOptions}
        municipalityOptions={municipalityOptions}
        onSearch={onSearch}
        tenantTypeOptions={tenantTypeOptions}
        typeOptions={typeOptions}
        showCreateLeaseModal={showCreateLeaseModal}
      />
    </SearchContainer>
  );
};

export default Search;
