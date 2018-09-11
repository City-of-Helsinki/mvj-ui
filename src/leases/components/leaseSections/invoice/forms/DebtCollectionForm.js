// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AddButtonThird from '$components/form/AddButtonThird';
import DebtCollectionNote from './DebtCollectionNote';
import ExternalLink from '$components/links/ExternalLink';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {ContactType} from '$src/contacts/enums';
import {DecisionTypes} from '$src/decision/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getDecisionOptions} from '$src/decision/helpers';
import {getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getCurrentLease} from '$src/leases/selectors';

type NotesProps = {
  fields: any,
}

const renderNotes = ({
  fields,
}: NotesProps) => {
  const handleAdd = () => {
    fields.push({});
  };

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {!!fields.length &&
              <Row>
                <Column small={6}><FormFieldLabel required>Huomautus</FormFieldLabel></Column>
                <Column small={3}><FormFieldLabel>Lisätty</FormFieldLabel></Column>
                <Column small={3}><FormFieldLabel>Lisääjä</FormFieldLabel></Column>
              </Row>
            }
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.DEBT_COLLECTION_NOTE,
                  deleteModalTitle: DeleteModalTitles.DEBT_COLLECTION_NOTE,
                });
              };

              return(
                <DebtCollectionNote
                  key={index}
                  field={field}
                  onRemove={handleRemove}
                />
              );
            })}
            <AddButtonThird
              label='Lisää huomautus'
              onClick={handleAdd}
            />
          </div>
        );
      }}
    </AppConsumer>

  );
};

type Props = {
  decisions: Array<Object>,
  handleSubmit: Function,
  valid: boolean,
}

type State = {
  debtCollectionDecisions: Array<Object>,
  decisions: Array<Object>,
  decisionOptions: Array<Object>,
}

class DebtCollectionForm extends Component<Props, State> {
  state = {
    debtCollectionDecisions: [],
    decisions: [],
    decisionOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newStates = {};

    if(props.decisions && props.decisions !== state.decisions) {
      newStates.decisions = props.decisions;
      newStates.decisionOptions = getDecisionOptions(props.decisions);
      newStates.debtCollectionDecisions = props.decisions.filter((decision) => decision.type === DecisionTypes.LAND_LEASE_DEMOLITION);
    }

    if(!isEmpty(newStates)) {
      return newStates;
    }
    return null;
  }

  render() {
    const {handleSubmit} = this.props;
    const {
      debtCollectionDecisions,
      decisionOptions,
    } = this.state;

    return(
      <form onSubmit={handleSubmit}>
        <Row>
          <Column small={12} large={6}>
            <SubTitle>Perintäkirjeet</SubTitle>

            <SubTitle>Käräjäoikeuden päätökset</SubTitle>

            <SubTitle>Vuokrauksen purkamispäätös</SubTitle>
            {!debtCollectionDecisions.length && <p>Ei purkamispäätöksiä</p>}
            {!!debtCollectionDecisions.length &&
              <ListItems>
                {debtCollectionDecisions.map((decision, index) =>
                  decision.reference_number
                    ? <p key={index} className='no-margin'><ExternalLink
                      className='no-margin'
                      href={getReferenceNumberLink(decision.reference_number)}
                      label={decision.reference_number}
                    /></p>
                    : <p key={index} className='no-margin'>{getLabelOfOption(decisionOptions, decision.id)}</p>
                )}
              </ListItems>
            }

            <SubTitle>Huomautukset</SubTitle>
            <FieldArray
              component={renderNotes}
              name='notes'
            />
          </Column>
          <Column small={12} large={6}></Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.DEBT_COLLECTION;

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        decisions: getDecisionsByLease(state, currentLease.id),
      };
    }
  ),
  reduxForm({
    form: formName,
    // TODO: Use mock data until the debt collection API is ready
    initialValues: {
      notes: [
        {
          id: 12,
          date: '2018-05-09',
          note: 'Lorem lorem lorem lorem ipsum',
          user: {
            id: 1,
            first_name: 'Jori',
            is_staff: false,
            last_name: 'Lindell',
            type: ContactType.PERSON,
          },
        },
      ],
    },
  }),
)(DebtCollectionForm);
