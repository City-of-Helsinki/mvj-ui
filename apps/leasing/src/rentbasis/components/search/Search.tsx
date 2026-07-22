import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useForm, useFormState } from "react-final-form";
import { isEqual } from "lodash-es";
import { Row, Column } from "@/components/grid/Grid";
import FormField from "@/components/form/final-form/FormField";
import SearchChangeTypeLink from "@/components/search/SearchChangeTypeLink";
import SearchClearLink from "@/components/search/SearchClearLink";
import SearchContainer from "@/components/search/SearchContainer";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import { FieldTypes } from "@/enums";
import { RentBasisDecisionsFieldPaths } from "@/rentbasis/enums";
import { getFieldOptions, getUrlParams } from "@/util/helpers";
import { getAttributes as getRentBasisAttributes } from "@/rentbasis/selectors";
import type { Attributes } from "types";

type Props = {
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
};

interface SearchFieldsProps {
  isSearchInitialized: boolean;
  onSearch: (...args: Array<any>) => any;
  sortKey: string | null | undefined;
  sortOrder: string | null | undefined;
  decisionMakerOptions: Array<any>;
}

const SearchFields = ({
  isSearchInitialized,
  onSearch,
  sortKey,
  sortOrder,
  decisionMakerOptions,
}: SearchFieldsProps) => {
  const form = useForm();
  const location = useLocation();

  const { values, dirty } = useFormState();
  const prevValues = useRef(values);

  const [isBasicSearch, setIsBasicSearch] = useState(() => {
    const query = getUrlParams(location.search);
    delete query.page;
    delete query.sort_key;
    delete query.sort_order;
    return (
      !Object.keys(query).length ||
      (Object.keys(query).length === 1 && query.search)
    );
  });

  useEffect(() => {
    if (isSearchInitialized && dirty && !isEqual(prevValues.current, values)) {
      onSearch(
        {
          ...values,
          ...(sortKey && { sort_key: sortKey }),
          ...(sortOrder && { sort_order: sortOrder }),
        },
        true,
      );
    }
    prevValues.current = values;
  }, [values, dirty, isSearchInitialized, onSearch, sortKey, sortOrder]);

  const toggleSearchType = () => {
    setIsBasicSearch((prev) => !prev);
  };

  const handleClear = () => {
    const query: any = {};

    if (sortKey || sortOrder) {
      query.sort_key = sortKey;
      query.sort_order = sortOrder;
    }

    form.initialize({});
    onSearch(query, true);
  };

  return (
    <>
      <Row>
        <Column small={12}>
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
          <SearchClearLink onClick={handleClear}>Tyhjennä haku</SearchClearLink>
        </Column>
      </Row>
    </>
  );
};

const Search: React.FC<Props> = ({
  isSearchInitialized,
  sortKey,
  sortOrder,
  onSearch,
}) => {
  const form = useForm();

  const rentBasisAttributes: Attributes = useSelector(getRentBasisAttributes);

  const decisionMakerOptions = useMemo(
    () =>
      rentBasisAttributes
        ? getFieldOptions(
            rentBasisAttributes,
            RentBasisDecisionsFieldPaths.DECISION_MAKER,
          )
        : [],
    [rentBasisAttributes],
  );

  return (
    <SearchContainer onSubmit={form.submit}>
      <SearchFields
        isSearchInitialized={isSearchInitialized}
        onSearch={onSearch}
        sortKey={sortKey}
        sortOrder={sortOrder}
        decisionMakerOptions={decisionMakerOptions}
      />
    </SearchContainer>
  );
};

export default Search;
