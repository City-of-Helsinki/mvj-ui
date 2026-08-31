import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { Row, Column } from "@/components/grid/Grid";
import { isEmpty, isEqual } from "lodash-es";
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
  onSearch: (...args: Array<any>) => any;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
  initialValues?: Record<string, any>;
};

const Search: React.FC<Props> = ({
  onSearch,
  sortKey,
  sortOrder,
  initialValues,
}) => {
  const dispatch = useAppDispatch();
  const isFetchingServiceUnits = useAppSelector(getIsFetchingServiceUnits);
  const serviceUnits: ServiceUnits = useAppSelector(getServiceUnits);

  const prevFormValues = useRef(initialValues || {});

  useEffect(() => {
    prevFormValues.current = initialValues || {};
  }, [initialValues]);

  useEffect(() => {
    if (!isFetchingServiceUnits && isEmpty(serviceUnits)) {
      dispatch(fetchServiceUnits());
    }
  }, [dispatch, isFetchingServiceUnits, serviceUnits]);

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

  const serviceUnitOptions = useMemo((): Array<Record<string, any>> => {
    const options: Array<Record<string, any>> = [
      {
        id: "",
        value: "",
        label: "",
      },
    ];
    serviceUnits.forEach((serviceUnit) => {
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
      if (!isEqual(prevFormValues.current, values)) {
        search(values);
      }
      prevFormValues.current = values;
    },
    [search],
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
                      options: serviceUnitOptions,
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

export default Search;
