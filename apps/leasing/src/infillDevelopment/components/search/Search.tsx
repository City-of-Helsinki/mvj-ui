import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router";
import { useAppSelector } from "@/root/hooks";
import { Row, Column } from "@/components/grid/Grid";
import { debounce, isEqual } from "lodash-es";
import { Form, FormSpy } from "react-final-form";
import FormField from "@/components/form/final-form/FormField";
import SearchChangeTypeLink from "@/components/search/SearchChangeTypeLink";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchRow from "@/components/search/SearchRow";
import { FieldTypes } from "@/enums";
import { InfillDevelopmentCompensationLeaseDecisionsFieldPaths } from "@/infillDevelopment/enums";
import { getFieldOptions, getUrlParams } from "@/util/helpers";
import { getAttributes as getInfillDevelopmentAttributes } from "@/infillDevelopment/selectors";
import type { Attributes } from "types";

type Props = {
  initialValues?: Record<string, any>;
  onSearch: (...args: Array<any>) => any;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
  states: Array<Record<string, any>>;
};

const Search: React.FC<Props> = ({
  initialValues,
  onSearch,
  sortKey,
  sortOrder,
  states,
}) => {
  const location = useLocation();
  const infillDevelopmentAttributes: Attributes = useAppSelector(
    getInfillDevelopmentAttributes,
  );

  const prevFormValues = useRef(initialValues || {});

  const isSearchBasicMode = useCallback(() => {
    const query = getUrlParams(location.search);
    delete query.page;
    delete query.sort_key;
    delete query.sort_order;

    return (
      !Object.keys(query).length ||
      (Object.keys(query).length === 1 && (query.search || query.state)) ||
      (Object.keys(query).length === 2 && query.search && query.state)
    );
  }, [location.search]);

  const [isBasicSearch, setIsBasicSearch] = useState(isSearchBasicMode());

  useEffect(() => {
    prevFormValues.current = initialValues || {};
  }, [initialValues]);

  const decisionMakerOptions = useMemo(() => {
    return getFieldOptions(
      infillDevelopmentAttributes,
      InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER,
    );
  }, [infillDevelopmentAttributes]);

  const search = useCallback(
    (values: Record<string, any>) => {
      const newValues = { ...values };

      if (sortKey || sortOrder) {
        newValues.sort_key = sortKey;
        newValues.sort_order = sortOrder;
      }

      if (states.length) {
        newValues.lease_state = states;
      }

      onSearch(newValues, true);
    },
    [onSearch, sortKey, sortOrder, states],
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

  const toggleSearchType = () => {
    setIsBasicSearch((prevState) => !prevState);
  };

  const handleClear = () => {
    const query: Record<string, any> = {};

    if (sortKey || sortOrder) {
      query.sort_key = sortKey;
      query.sort_order = sortOrder;
    }

    onSearch(query, true, true);
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

          {!isBasicSearch && (
            <>
              <Row>
                <Column small={12} large={6}>
                  <SearchRow>
                    <SearchLabelColumn>
                      <SearchLabel>Päätös</SearchLabel>
                    </SearchLabelColumn>
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
                          <FormField
                            disableDirty
                            fieldAttributes={{
                              label: "Pykälä",
                              type: FieldTypes.STRING,
                              read_only: false,
                            }}
                            invisibleLabel
                            unit="§"
                            name="decision_section"
                          />
                        </Column>
                      </Row>
                    </SearchInputColumn>
                  </SearchRow>
                </Column>
                <Column small={12} large={6}>
                  <SearchRow>
                    <SearchLabelColumn>
                      <SearchLabel>Diaarinro</SearchLabel>
                    </SearchLabelColumn>
                    <SearchInputColumn>
                      <FormField
                        autoBlur
                        disableDirty
                        fieldAttributes={{
                          label: "Diaarinro",
                          type: FieldTypes.STRING,
                          read_only: false,
                        }}
                        invisibleLabel
                        name="reference_number"
                      />
                    </SearchInputColumn>
                  </SearchRow>
                </Column>
              </Row>
            </>
          )}

          <Row>
            <Column small={6}>
              <SearchChangeTypeLink onClick={toggleSearchType}>
                {isBasicSearch ? "Tarkennettu haku" : "Yksinkertainen haku"}
              </SearchChangeTypeLink>
            </Column>
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
