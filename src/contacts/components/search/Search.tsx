import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import debounce from "lodash/debounce";
import flowRight from "lodash/flowRight";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import { Form, FormSpy } from "react-final-form";
import FormField from "@/components/form/final-form/FormField";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import { FieldTypes } from "@/enums";
import { fetchServiceUnits } from "@/serviceUnits/actions";
import {
  getServiceUnits,
  getIsFetching as getIsFetchingServiceUnits,
} from "@/serviceUnits/selectors";
import type { ServiceUnit, ServiceUnits } from "@/serviceUnits/types";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";

type Props = {
  formValues: Record<string, any>;
  fetchServiceUnits: (...args: Array<any>) => any;
  isFetchingServiceUnits: boolean;
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  serviceUnits: ServiceUnits;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
  userActiveServiceUnit: ServiceUnit;
};

const Search: React.FC<Props> = ({
  formValues,
  fetchServiceUnits,
  isFetchingServiceUnits,
  isSearchInitialized,
  onSearch,
  serviceUnits,
  sortKey,
  sortOrder,
  userActiveServiceUnit,
}) => {
  const isMounted = useRef(true);
  const prevFormValues = useRef(formValues);

  useEffect(() => {
    if (!isFetchingServiceUnits && isEmpty(serviceUnits)) {
      fetchServiceUnits();
    }
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, [fetchServiceUnits, isFetchingServiceUnits, serviceUnits]);

  const search = useCallback(
    (values: Record<string, any>) => {
      const newValues = { ...values };
      if (sortKey) {
        newValues.sort_key = sortKey;
        newValues.sort_order = sortOrder;
      }
      onSearch(newValues, true);
    },
    [onSearch, sortKey, sortOrder],
  );

  // debounce search
  const debouncedSearch = useMemo(
    () =>
      debounce((values: Record<string, any>) => {
        if (!isMounted.current) return;
        search(values);
      }, 1000),
    [search],
  );

  // Track form values for search triggering
  const handleFormChange = useCallback(
    (values: Record<string, any>) => {
      if (isSearchInitialized && !isEqual(prevFormValues.current, values)) {
        debouncedSearch(values);
      }
      prevFormValues.current = values;
    },
    [isSearchInitialized, debouncedSearch],
  );

  const handleClear = useCallback(
    (form: any) => {
      const query: any = {};
      if (sortKey || sortOrder) {
        query.sort_key = sortKey;
        query.sort_order = sortOrder;
      }
      form.reset();
      onSearch(query, true);
    },
    [onSearch, sortKey, sortOrder],
  );

  const getServiceUnitOptions = useCallback((): Array<Record<string, any>> => {
    const options = [
      {
        id: "",
        value: "",
        label: "",
      },
    ];
    serviceUnits.map((serviceUnit) => {
      options.push({
        id: serviceUnit.id.toString(),
        value: serviceUnit.id.toString(),
        label: serviceUnit.name,
      });
    });
    return options;
  }, [serviceUnits]);

  if (!serviceUnits.length) {
    return null;
  }

  return (
    <Form
      onSubmit={search}
      initialValues={{ service_unit: userActiveServiceUnit?.id }} // <-- use initialValues from props
      subscription={{}}
      render={({ handleSubmit, form }) => (
        <SearchContainer onSubmit={handleSubmit}>
          <Row>
            <Column large={12}>
              <div className="inline-search-fields">
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: "Palvelukokonaisuus",
                    type: FieldTypes.CHOICE,
                    read_only: false,
                  }}
                  name="service_unit"
                  overrideValues={{
                    options: getServiceUnitOptions(),
                  }}
                  className="contact-search-dropdown"
                />
                <FormField
                  disableDirty
                  fieldAttributes={{
                    label: "Hae hakusanalla",
                    type: FieldTypes.SEARCH,
                    read_only: false,
                  }}
                  invisibleLabel
                  name="search"
                />
              </div>
            </Column>
          </Row>
          <Row>
            <Column small={12}>
              <SearchClearLink onClick={() => handleClear(form)}>
                Tyhjennä haku
              </SearchClearLink>
            </Column>
          </Row>
          <input type="submit" style={{ display: "none" }} />
          <FormSpy
            subscription={{ values: true }}
            onChange={({ values }) => handleFormChange(values)}
          />
        </SearchContainer>
      )}
    />
  );
};

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: {}, // Not needed with final-form, but kept for compatibility
        isFetchingServiceUnits: getIsFetchingServiceUnits(state),
        serviceUnits: getServiceUnits(state),
        userActiveServiceUnit: getUserActiveServiceUnit(state),
      };
    },
    {
      fetchServiceUnits,
    },
  ),
)(Search) as React.ComponentType<any>;
