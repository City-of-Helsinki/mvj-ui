import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Field, Form, useFormState } from "react-final-form";
import { debounce, isEmpty } from "lodash-es";
import {
  Checkbox,
  Button,
  ButtonVariant,
  IconPlusCircleFill,
  Search as HdsSearch,
  Select,
  TextInput,
  type SearchProps,
} from "hds-react";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import SearchRow from "@/components/search/SearchRow";
import { fetchServiceUnits } from "@/serviceUnits/actions";
import {
  getServiceUnits,
  getIsFetching as getIsFetchingServiceUnits,
} from "@/serviceUnits/selectors";
import { ContactFieldTitles } from "@/contacts/enums";
import { filterSelectedOptions } from "@/leases/helpers";
import { getUrlParams } from "@/util/helpers";
import type { SelectOptionHds } from "@/types";

type Props = {
  isSearchInitialized: boolean;
  onSearch: (query: Record<string, any>, resetActivePage: boolean) => void;
  sortKey: string;
  sortOrder: string;
  allowCreate: boolean;
  onCreateContact: () => void;
};

const SearchFormFields: React.FC<{
  isSearchInitialized: boolean;
  onSearch: (query: Record<string, any>, resetActivePage: boolean) => void;
  sortKey: string;
  sortOrder: string;
  serviceUnitOptions: SelectOptionHds[];
  allowCreate: boolean;
  onCreateContact: () => void;
}> = ({
  isSearchInitialized,
  onSearch,
  sortKey,
  sortOrder,
  serviceUnitOptions,
  allowCreate,
  onCreateContact,
}) => {
  const { values, dirty } = useFormState();

  const debouncedSearch = useMemo(
    () =>
      debounce((vals: Record<string, any>) => {
        const newValues = { ...vals };
        if (sortKey) {
          newValues.sort_key = sortKey;
          newValues.sort_order = sortOrder;
        }
        onSearch(newValues, true);
      }, 1000),
    [onSearch, sortKey, sortOrder],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (isSearchInitialized && dirty) {
      debouncedSearch(values);
    }
  }, [values, dirty, isSearchInitialized, debouncedSearch]);

  const searchTexts: SearchProps["texts"] = useMemo(
    () => ({
      searchPlaceholder: "Hae hakusanalla",
      historyLabel: "Hakuhistoria",
    }),
    [],
  );

  return (
    <>
      <Row className="contact-search-container">
        <Column small={12} large={2}>
          <Authorization allow={allowCreate}>
            <Button
              variant={ButtonVariant.Supplementary}
              iconStart={<IconPlusCircleFill />}
              onClick={onCreateContact}
            >
              Luo asiakas
            </Button>
          </Authorization>
        </Column>
        <Column small={12} large={10}>
          <Field name="search">
            {({
              input: { value, onChange, onBlur, onFocus },
              meta: { invalid },
            }) => (
              <HdsSearch
                historyId="contact-search"
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
            )}
          </Field>
        </Column>
      </Row>

      <SearchRow>
        <Row className="contact-search-container background-color-light-grey">
          <Column small={6} large={4}>
            <Field name="service_unit">
              {({ input: { value, onChange } }) => (
                <Select
                  id="contact_service_unit"
                  texts={{
                    label: ContactFieldTitles.SERVICE_UNIT,
                    placeholder: "Valitse palvelukokonaisuus",
                    language: "fi",
                  }}
                  value={filterSelectedOptions(value, serviceUnitOptions)}
                  options={serviceUnitOptions}
                  onChange={(selectedOptions) => {
                    onChange(selectedOptions.map((option) => option.value));
                  }}
                  style={{ width: "100%" }}
                  multiSelect
                  noTags
                  clearable
                />
              )}
            </Field>
          </Column>
          <Column small={6} large={2}>
            <Field name="lease">
              {({ input: { value, onChange, onBlur, onFocus } }) => (
                <TextInput
                  id="contact_lease"
                  label="Vuokraustunnus"
                  value={value || ""}
                  onChange={onChange}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  style={{ width: "100%" }}
                />
              )}
            </Field>
          </Column>
          <Column
            small={6}
            large={2}
            className="contact-search-container__vertical_center"
          >
            <Field name="is_tenant">
              {({ input: { value, onChange } }) => (
                <Checkbox
                  id="contact_is_tenant"
                  label="Vain vuokralaiset"
                  checked={value === true || value === "true"}
                  onChange={(event) =>
                    onChange(event.target.checked ? true : undefined)
                  }
                />
              )}
            </Field>
          </Column>
          <Column
            small={6}
            large={2}
            className="contact-search-container__vertical_center"
          >
            <Field name="is_active">
              {({ input: { value, onChange } }) => (
                <Checkbox
                  id="contact_is_active"
                  label="Vain aktiiviset asiakkaat"
                  checked={value === true || value === "true"}
                  onChange={(event) =>
                    onChange(event.target.checked ? true : undefined)
                  }
                />
              )}
            </Field>
          </Column>
        </Row>
      </SearchRow>
    </>
  );
};

const Search: React.FC<Props> = ({
  isSearchInitialized,
  onSearch,
  sortKey,
  sortOrder,
  allowCreate,
  onCreateContact,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const serviceUnits = useSelector(getServiceUnits);
  const isFetchingServiceUnits = useSelector(getIsFetchingServiceUnits);

  useEffect(() => {
    if (!isFetchingServiceUnits && isEmpty(serviceUnits)) {
      dispatch(fetchServiceUnits());
    }
  }, [dispatch, isFetchingServiceUnits, serviceUnits]);

  const serviceUnitOptions: SelectOptionHds[] = useMemo(() => {
    if (!serviceUnits?.length) return [];
    return serviceUnits.map((unit) => ({
      label: unit.name,
      value: String(unit.id),
    }));
  }, [serviceUnits]);

  const initialValues = useMemo(() => {
    const queryParams = getUrlParams(location.search);
    const values: any = { ...queryParams };
    const serviceUnit = [queryParams.service_unit].flatMap((v) => v || []);
    if (serviceUnit.length) {
      values.service_unit = serviceUnit;
    }
    // E.g. to avoid staying on previous page number after searching with new query.
    delete values.page;
    delete values.sort_key;
    delete values.sort_order;
    return values;
  }, [location.search]);

  return (
    <Form
      initialValues={initialValues}
      onSubmit={(values) => onSearch(values, true)}
      enableReinitialize
    >
      {() => (
        <SearchFormFields
          isSearchInitialized={isSearchInitialized}
          onSearch={onSearch}
          sortKey={sortKey}
          sortOrder={sortOrder}
          serviceUnitOptions={serviceUnitOptions}
          allowCreate={allowCreate}
          onCreateContact={onCreateContact}
        />
      )}
    </Form>
  );
};

export default Search;
