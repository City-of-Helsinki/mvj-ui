import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getFormValues, formValueSelector, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import Button from "@/components/button/Button";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import GreenBox from "@/components/content/GreenBox";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import { ButtonColors } from "@/components/enums";
import { ContactTypes } from "@/contacts/enums";
import { FieldTypes, FormNames } from "@/enums";
import { CreditDecisionText, SearchLabels } from "@/creditDecision/enums";
type Props = {
  formSelectedType: String;
  formValues: Record<string, any>;
  handleSubmit: (...args: Array<any>) => any;
  onSearch: (...args: Array<any>) => any;
};

const SearchForm = ({
  formSelectedType,
  formValues,
  handleSubmit,
  onSearch,
}: Props) => {
  const handleSearch = () => {
    const newValues = { ...formValues };
    onSearch(newValues);
  };

  return (
    <GreenBox>
      <form onSubmit={handleSubmit(handleSearch)}>
        <SearchRow
          style={{
            marginBottom: 15,
          }}
        >
          <SearchLabelColumn
            style={{
              width: 130,
              marginRight: 10,
            }}
          >
            <SearchLabel>{SearchLabels.CONTACT_TYPE}</SearchLabel>
          </SearchLabelColumn>
          <SearchInputColumn>
            <FormFieldLegacy
              autoBlur
              disableDirty
              fieldAttributes={{
                label: SearchLabels.CONTACT_TYPE,
                type: FieldTypes.CHOICE,
                read_only: false,
              }}
              invisibleLabel
              name="contact_type"
              overrideValues={{
                options: [
                  {
                    value: ContactTypes.BUSINESS,
                    label: CreditDecisionText.BUSINESS_TITLE,
                  },
                  {
                    value: ContactTypes.PERSON,
                    label: CreditDecisionText.PERSON_TITLE,
                  },
                ],
              }}
            />
          </SearchInputColumn>
        </SearchRow>
        {formSelectedType && (
          <Fragment>
            <SearchRow
              style={{
                marginBottom: 15,
              }}
            >
              <SearchLabelColumn
                style={{
                  width: 130,
                  marginRight: 10,
                }}
              >
                <SearchLabel>
                  {formSelectedType === ContactTypes.BUSINESS
                    ? SearchLabels.BUSINESS_ID
                    : SearchLabels.NIN}
                </SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
                <FormFieldLegacy
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label:
                      formSelectedType === ContactTypes.PERSON
                        ? SearchLabels.BUSINESS_ID
                        : SearchLabels.NIN,
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name="keyword"
                />
              </SearchInputColumn>
            </SearchRow>
            <Button
              className={`${ButtonColors.SUCCESS} no-margin-right`}
              onClick={handleSearch}
              text={SearchLabels.CONTINUE}
              style={{
                marginLeft: 140,
                marginBottom: "1em",
              }}
            />
          </Fragment>
        )}
      </form>
    </GreenBox>
  );
};

const formName = FormNames.CREDIT_DECISION_SEARCH;
const selector = formValueSelector(formName);
export default flowRight(
  connect((state) => {
    return {
      formValues: getFormValues(formName)(state),
      formSelectedType: selector(state, "contact_type"),
    };
  }),
  reduxForm({
    form: formName,
  }),
)(SearchForm) as React.ComponentType<any>;
