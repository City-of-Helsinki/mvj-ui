import React, { useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import { Form, Field, FormSpy } from "react-final-form";
import FormField from "@/components/form/final-form/FormField";
import SearchContainer from "@/components/search/SearchContainer";
import { FieldTypes } from "@/enums";
import { fetchServiceUnits } from "@/serviceUnits/actions";
import {
  getServiceUnits,
  getIsFetching as getIsFetchingServiceUnits,
} from "@/serviceUnits/selectors";
import type { ServiceUnits } from "@/serviceUnits/types";

type Props = {
  fetchServiceUnits: (...args: Array<any>) => any;
  isFetchingServiceUnits: boolean;
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  serviceUnits: ServiceUnits;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
  initialValues?: Record<string, any>;
};

const Search: React.FC<Props> = ({
  fetchServiceUnits,
  isFetchingServiceUnits,
  isSearchInitialized,
  onSearch,
  serviceUnits,
  sortKey,
  sortOrder,
  initialValues,
}) => {
  const isMounted = useRef(true);
  const prevFormValues = useRef(initialValues || {});

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

  const handleFormChange = useCallback(
    (values: Record<string, any>) => {
      if (isSearchInitialized && !isEqual(prevFormValues.current, values)) {
        search(values);
      }
      prevFormValues.current = values;
    },
    [isSearchInitialized, search],
  );

  if (!serviceUnits.length) {
    return null;
  }

  return (
    <Form
      onSubmit={search}
      initialValues={initialValues}
      subscription={{}}
      render={({ handleSubmit }) => (
        <SearchContainer onSubmit={handleSubmit}>
          <Row>
            <Column large={12}>
              <Field name="service_unit">
                {({ input }) => (
                  <FormField
                    {...input}
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
                )}
              </Field>
            </Column>
          </Row>
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
        isFetchingServiceUnits: getIsFetchingServiceUnits(state),
        serviceUnits: getServiceUnits(state),
      };
    },
    {
      fetchServiceUnits,
    },
  ),
)(Search) as React.ComponentType<any>;
