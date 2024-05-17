import React from "react";
import { connect } from "react-redux";
import { getFormValues, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Button from "src/components/button/Button";
import FormField from "src/components/form/FormField";
import SearchInputColumn from "src/components/search/SearchInputColumn";
import SearchLabel from "src/components/search/SearchLabel";
import SearchLabelColumn from "src/components/search/SearchLabelColumn";
import SearchRow from "src/components/search/SearchRow";
import { FieldTypes, FormNames } from "src/enums";
import { ButtonColors } from "src/components/enums";
type Props = {
  formValues?: Record<string, any>;
  handleSubmit?: (...args: Array<any>) => any;
  onSearch: (...args: Array<any>) => any;
};

const Search = ({
  formValues,
  handleSubmit,
  onSearch
}: Props): React.JSX.Element => {
  const handleSearch = () => {
    const newValues = { ...formValues
    };
    onSearch(newValues);
  };

  return <form onSubmit={handleSubmit(handleSearch)}>
      <Row>
        <Column small={12}>
          <SearchRow style={{
          marginBottom: 15
        }}>
            <SearchLabelColumn style={{
            width: 'unset',
            marginRight: 10
          }}>
              <SearchLabel>Y-tunnus</SearchLabel>
            </SearchLabelColumn>
            <SearchInputColumn>
              <FormField autoBlur disableDirty fieldAttributes={{
              label: 'Y-tunnus',
              type: FieldTypes.STRING,
              read_only: false
            }} invisibleLabel name='business_id' />
            </SearchInputColumn>

            <Button className={`${ButtonColors.SUCCESS} no-margin-right`} onClick={handleSearch} text='Hae' />
          </SearchRow>
        </Column>
      </Row>
    </form>;
};

const formName = FormNames.TRADE_REGISTER_SEARCH;
export default flowRight(connect(state => {
  return {
    formValues: getFormValues(formName)(state)
  };
}), reduxForm({
  form: formName
}))(Search);