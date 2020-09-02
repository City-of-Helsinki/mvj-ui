// @flow
import React, {Fragment, type Element} from 'react';
import {connect} from 'react-redux';
import {reduxForm, FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import flowRight from 'lodash/flowRight';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import {ButtonColors} from '$components/enums';
import {ConfirmationModalTexts} from '$src/enums';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import {FormNames, ViewModes} from '$src/enums';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ExternalLink from '$components/links/ExternalLink';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import {
  receiveCollapseStates,
  receiveIsSaveClicked,
} from '$src/plotSearch/actions';
import {
  getFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {
  getAttributes,
  getIsSaveClicked,
  getCollapseStateByKey, 
  getErrorsByFormName, 
} from '$src/plotSearch/selectors';
import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import SuggestedEdit from './SuggestedEdit';

type SuggestedProps = {
  attributes: Attributes,
  disabled: boolean,
  fields: any,
  formName: string,
  isSaveClicked: Boolean,
}

const renderSuggested = ({
  disabled,
  fields,
  formName,
  attributes,
  isSaveClicked,
}: SuggestedProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };
  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <Column>
              {fields && !!fields.length &&
                <Row>
                  <Column large={7}>
                    <FormTextTitle>
                      {'Ehdotettu varauksensaaja'}
                    </FormTextTitle>
                  </Column>
                  <Column large={4}>
                    <FormTextTitle>
                      {'Osuus'}
                    </FormTextTitle>
                  </Column>
                </Row>
              }

              {!!fields.length && fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: ConfirmationModalTexts.DELETE_SUGGESTION.BUTTON,
                    confirmationModalLabel: ConfirmationModalTexts.DELETE_SUGGESTION.LABEL,
                    confirmationModalTitle: ConfirmationModalTexts.DELETE_SUGGESTION.TITLE,
                  });
                };
                return <SuggestedEdit
                  key={index}
                  disabled={disabled}
                  field={field}
                  formName={formName}
                  onRemove={handleRemove}
                  attributes={attributes}
                  isSaveClicked={isSaveClicked}
                />;
              })}

              {!disabled &&
                <Row>
                  <Column>
                    <AddButtonThird
                      label='Lisää ehdotus'
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              }
            </Column>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  currentAmountPerArea: number,
  field: any,
  formName: string,
  initialYearRent: number,
  errors: ?Object,
  plotSearchSiteId: number,
  receiveCollapseStates: Function,
  isSaveClicked: boolean,
  attributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
  targetIdentifier: string,
  collapseState: boolean,
}

const PlotSearchSiteEdit = ({
  field,
  isSaveClicked,
  plotSearchSiteId,
  collapseState,
  errors,
  attributes,
  onRemove,
  targetIdentifier,
  receiveCollapseStates,
}: Props) => {

  const handleCollapseToggle = (val: boolean) => {

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: {
          plotSearch_site: {
            [plotSearchSiteId]: val,
          },
        },
      },
    });
  };

  const identifierOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.target_identifier');
  const leaseIdOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.lease_id');
  const stepOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.step');
  const handlingOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.handling');
  const useOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.use');
  const fundingOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.funding');
  const ownershipOptions = getFieldOptions(attributes, 'plotSearch_sites.child.children.ownership');
  const plotSearchSiteErrors = get(errors, field);

  return (
    <Collapse
      className='collapse__secondary greenCollapse'
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle={getLabelOfOption(identifierOptions, targetIdentifier) || '-'}
      onRemove={onRemove}
      hasErrors={isSaveClicked && !isEmpty(plotSearchSiteErrors)}
      onToggle={handleCollapseToggle}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.target_identifier')}
            name={`${field}.target_identifier`}
            overrideValues={{
              fieldType: 'choice',
              label: 'Kohteen tunnus',
              options: identifierOptions,
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.lease_id')}
            name={`${field}.lease_id`}
            overrideValues={{
              fieldType: 'choice',
              label: 'Vuokraustunnus',
              options: leaseIdOptions,
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.hitas')}
            name={`${field}.hitas`}
            overrideValues={{label: 'Hitas'}}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.address')}
            name={`${field}.address`}
            overrideValues={{label: 'Osoite'}}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.step')}
            name={`${field}.step`}
            overrideValues={{
              label: 'Kaavayksikön vaihe',
              options: stepOptions,
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.handling')}
            name={`${field}.handling`}
            overrideValues={{
              label: 'Asemakaavan ja käsittelyvaihe',
              options: handlingOptions,
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle>
            {'Hakemukset'}
          </FormTextTitle>
          <FormText>
            <ExternalLink
              className='no-margin'
              href={`/`}
              text={'Hakemukset (25)'}
            />
          </FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.use')}
            name={`${field}.use`}
            overrideValues={{
              label: 'Käyttötarkoitus',
              options: useOptions,
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.build_right')}
            name={`${field}.build_right`}
            overrideValues={{label: 'Rak. oikeus'}}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.build_ready_in')}
            name={`${field}.build_ready_in`}
            overrideValues={{label: 'Rak. valmius'}}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.funding')}
            name={`${field}.funding`}
            overrideValues={{
              label: 'Rahoitusmuoto',
              options: fundingOptions,
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'plotSearch_sites.child.children.ownership')}
            name={`${field}.ownership`}
            overrideValues={{
              label: 'Hallintamuoto',
              options: ownershipOptions,
            }}
          />
        </Column>
        <FieldArray
          component={renderSuggested}
          attributes={attributes}
          isClicked={isSaveClicked}
          disabled={false}
          formName={FormNames.PLOT_SEARCH_BASIC_INFORMATION}
          name={`${field}.suggested`}
        />
      </Row>
    </Collapse>
  );
};

const formName = FormNames.PLOT_SEARCH_BASIC_INFORMATION;

export default flowRight(
  connect(
    (state, props: Props) => {
      const formName = props.formName;
      const selector = formValueSelector(formName);
      const id = selector(state, `${props.field}.id`);
      return {
        attributes: getAttributes(state),
        isSaveClicked: getIsSaveClicked(state),
        collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.plotSearch_site.${id}`),
        type: selector(state, `${props.field}.type`),
        targetIdentifier: selector(state, `${props.field}.target_identifier`),
        decisionToList: selector(state, `${props.field}.decision_to_list`),
        usersPermissions: getUsersPermissions(state),
        errors: getErrorsByFormName(state, formName),
        plotSearchSiteId: id,
      };
    },
    {
      receiveCollapseStates,
      receiveIsSaveClicked,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(PlotSearchSiteEdit);
