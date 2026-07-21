import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { getFormValues, reduxForm } from "redux-form";
import { Row, Column } from "@/components/grid/Grid";
import { debounce } from "lodash-es";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import SearchChangeTypeLink from "@/components/search/SearchChangeTypeLink";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import { FieldTypes, FormNames } from "@/enums";
import { RentBasisDecisionsFieldPaths } from "@/rentbasis/enums";
import { getFieldOptions, getUrlParams } from "@/util/helpers";
import { getAttributes as getRentBasisAttributes } from "@/rentbasis/selectors";
import type { Attributes } from "types";
type Props = {
  handleSubmit: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
};

const Search: React.FC<Props> = ({
  handleSubmit,
  initialize,
  isSearchInitialized,
  sortKey,
  sortOrder,
  onSearch,
}) => {
  const location = useLocation();
  const formValues = useSelector(getFormValues(FormNames.RENT_BASIS_SEARCH));
  const rentBasisAttributes: Attributes = useSelector(getRentBasisAttributes);

  const [decisionMakerOptions, setDecisionMakerOptions] = useState([]);
  const [isBasicSearch, setIsBasicSearch] = useState(false);

  useEffect(() => {
    const isSearchBasicMode = () => {
      const query = getUrlParams(location.search);
      delete query.page;
      delete query.sort_key;
      delete query.sort_order;
      return (
        !Object.keys(query).length ||
        (Object.keys(query).length === 1 && query.search)
      );
    };
    setIsBasicSearch(isSearchBasicMode());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rentBasisAttributes) {
      setDecisionMakerOptions(
        getFieldOptions(
          rentBasisAttributes,
          RentBasisDecisionsFieldPaths.DECISION_MAKER,
        ),
      );
    }
  }, [rentBasisAttributes]);

  const search = useCallback(() => {
    const newValues: any = { ...formValues };

    if (sortKey || sortOrder) {
      newValues.sort_key = sortKey;
      newValues.sort_order = sortOrder;
    }

    onSearch(newValues, true);
  }, [formValues, sortKey, sortOrder, onSearch]);

  useEffect(() => {
    if (!isSearchInitialized) return;

    const debouncedSearch = debounce(search, 1000);
    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [isSearchInitialized, search]);

  const toggleSearchType = () => {
    setIsBasicSearch((prev) => !prev);
  };

  const handleClear = () => {
    const query: any = {};

    if (sortKey || sortOrder) {
      query.sort_key = sortKey;
      query.sort_order = sortOrder;
    }

    initialize({});
    onSearch(query, true);
  };

  return (
    <SearchContainer onSubmit={handleSubmit(search)}>
      <Row>
        <Column small={12}>
          <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                  <FormFieldLegacy
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
          <SearchClearLink onClick={handleClear}>Tyhjennä haku</SearchClearLink>
        </Column>
      </Row>
    </SearchContainer>
  );
};

const formName = FormNames.RENT_BASIS_SEARCH;
export default reduxForm({
  form: formName,
})(Search) as React.ComponentType<any>;
