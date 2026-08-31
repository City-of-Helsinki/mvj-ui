import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { Row, Column } from "@/components/grid/Grid";
import { isEmpty, isEqual } from "lodash-es";
import { Form, FormSpy } from "react-final-form";
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
  initialValues?: Record<string, any>;
};

const Search: React.FC<Props> = ({ onSearch, initialValues }) => {
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
      onSearch(newValues, true);
    },
    [onSearch],
  );

  const serviceUnitOptions = useMemo((): Array<Record<string, any>> => {
    const options = [
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

  if (!serviceUnits.length) {
    return null;
  }

  const handleFormChange = (values: Record<string, any>) => {
    if (!isEqual(prevFormValues.current, values)) {
      search(values);
    }

    prevFormValues.current = values;
  };

  return (
    <Form
      onSubmit={search}
      initialValues={initialValues}
      subscription={{}}
      render={({ handleSubmit }) => (
        <SearchContainer onSubmit={handleSubmit}>
          <Row>
            <Column large={12}>
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
                  options: serviceUnitOptions,
                }}
                className="contact-search-dropdown"
              />
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
