import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Row, Column } from "@/components/grid/Grid";
import { debounce, isEqual } from "lodash-es";
import { Form, FormSpy } from "react-final-form";
import FormField from "@/components/form/final-form/FormField";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import { FieldTypes } from "@/enums";

type Props = {
  initialValues?: Record<string, any>;
  onSearch: (...args: Array<any>) => any;
};

const Search: React.FC<Props> = ({ initialValues, onSearch }) => {
  const prevFormValues = useRef(initialValues || {});

  useEffect(() => {
    prevFormValues.current = initialValues || {};
  }, [initialValues]);

  const search = useCallback(
    (values: Record<string, any>) => {
      onSearch({ ...values });
    },
    [onSearch],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((values: Record<string, any>) => {
        search(values);
      }, 1000),
    [search],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleFormChange = useCallback(
    (values: Record<string, any>) => {
      if (!isEqual(prevFormValues.current, values)) {
        debouncedSearch(values);
      }

      prevFormValues.current = values;
    },
    [debouncedSearch],
  );

  const handleClear = useCallback(() => {
    onSearch({});
  }, [onSearch]);

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
          <Row>
            <Column small={6}></Column>
            <Column small={6}>
              <SearchClearLink onClick={handleClear}>
                Tyhjennä haku
              </SearchClearLink>
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
