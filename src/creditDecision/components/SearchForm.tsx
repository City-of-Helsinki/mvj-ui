import React, { Fragment } from "react";
import flowRight from "lodash/flowRight";
import { Form, Field } from "react-final-form";
import Button from "@/components/button/Button";
import FormField from "@/components/form/final-form/FormField";
import GreenBox from "@/components/content/GreenBox";
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import { ButtonColors } from "@/components/enums";
import { ContactTypes } from "@/contacts/enums";
import { FieldTypes } from "@/enums";
import { CreditDecisionText, SearchLabels } from "@/creditDecision/enums";

type Props = {
  onSearch: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
};

const SearchForm: React.FC<Props> = ({ onSearch, initialValues }) => {
  return (
    <GreenBox>
      <Form
        onSubmit={onSearch}
        initialValues={initialValues}
        subscription={{}}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
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
                <Field name="contact_type">
                  {({ input }) => (
                    <FormField
                      {...input}
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
                  )}
                </Field>
              </SearchInputColumn>
            </SearchRow>
            {values.contact_type && (
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
                      {values.contact_type === ContactTypes.BUSINESS
                        ? SearchLabels.BUSINESS_ID
                        : SearchLabels.NIN}
                    </SearchLabel>
                  </SearchLabelColumn>
                  <SearchInputColumn>
                    <Field name="keyword">
                      {({ input }) => (
                        <FormField
                          {...input}
                          autoBlur
                          disableDirty
                          fieldAttributes={{
                            label:
                              values.contact_type === ContactTypes.PERSON
                                ? SearchLabels.BUSINESS_ID
                                : SearchLabels.NIN,
                            type: FieldTypes.STRING,
                            read_only: false,
                          }}
                          invisibleLabel
                          name="keyword"
                        />
                      )}
                    </Field>
                  </SearchInputColumn>
                </SearchRow>
                <Button
                  className={`${ButtonColors.SUCCESS} no-margin-right`}
                  type="submit"
                  text={SearchLabels.CONTINUE}
                  style={{
                    marginLeft: 140,
                    marginBottom: "1em",
                  }}
                />
              </Fragment>
            )}
          </form>
        )}
      />
    </GreenBox>
  );
};

export default flowRight(SearchForm) as React.ComponentType<any>;
