import React from "react";
import { Row, Column } from "react-foundation";
import { Form, Field } from "react-final-form";
import flowRight from "lodash/flowRight";
import Button from "@/components/button/Button";
import FormField from "@/components/form/final-form/FormField"; // Adjusted import to match final-form usage
import SearchInputColumn from "@/components/search/SearchInputColumn";
import SearchLabel from "@/components/search/SearchLabel";
import SearchLabelColumn from "@/components/search/SearchLabelColumn";
import SearchRow from "@/components/search/SearchRow";
import { FieldTypes } from "@/enums";
import { ButtonColors } from "@/components/enums";

type Props = {
  onSearch: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
};

const Search: React.FC<Props> = ({ onSearch, initialValues }) => {
  const handleSearch = (values: Record<string, any>) => {
    onSearch({ ...values });
  };

  return (
    <Form
      onSubmit={handleSearch}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Row>
            <Column small={12}>
              <SearchRow
                style={{
                  marginBottom: 15,
                }}
              >
                <SearchLabelColumn
                  style={{
                    width: "unset",
                    marginRight: 10,
                  }}
                >
                  <SearchLabel>Y-tunnus</SearchLabel>
                </SearchLabelColumn>
                <SearchInputColumn>
                  <Field name="business_id">
                    {({ input }) => (
                      <FormField
                        {...input}
                        autoBlur
                        disableDirty
                        fieldAttributes={{
                          label: "Y-tunnus",
                          type: FieldTypes.STRING,
                          read_only: false,
                        }}
                        invisibleLabel
                        name="business_id"
                      />
                    )}
                  </Field>
                </SearchInputColumn>
                <Button
                  className={`${ButtonColors.SUCCESS} no-margin-right`}
                  type="submit"
                  text="Hae"
                />
              </SearchRow>
            </Column>
          </Row>
        </form>
      )}
    />
  );
};

export default flowRight(Search) as React.ComponentType<any>;
