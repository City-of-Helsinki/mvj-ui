import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Row, Column } from "@/components/grid/Grid";
import { debounce, isEqual } from "lodash-es";
import { Form, FormSpy } from "react-final-form";
import FormField from "@/components/form/final-form/FormField";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import { FieldTypes } from "@/enums";

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
  const prevFormValues = useRef(initialValues || {});

  useEffect(() => {
    prevFormValues.current = initialValues || {};
  }, [initialValues]);

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
    const query: Record<string, any> = {};

    if (sortKey || sortOrder) {
      query.sort_key = sortKey;
      query.sort_order = sortOrder;
    }
    debouncedSearch.cancel();
    onSearch(query, true);
  }, [onSearch, sortKey, sortOrder, debouncedSearch]);

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
            <Column small={12} medium={6}>
              <FormField
                autoBlur
                disableDirty
                fieldAttributes={{
                  label: "Näytä poistetut",
                  type: FieldTypes.CHECKBOX,
                  read_only: false,
                }}
                invisibleLabel
                name="with_deleted"
                overrideValues={{
                  options: [
                    {
                      value: true,
                      label: "Näytä poistetut",
                    },
                  ],
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column small={12}>
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
