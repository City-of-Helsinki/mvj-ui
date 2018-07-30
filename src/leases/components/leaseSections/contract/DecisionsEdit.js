// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import FormSection from '$components/form/FormSection';
import DecisionItemEdit from './DecisionItemEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContentDecisions} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type DecisionsProps = {
  decisionsData: Array<Object>,
  fields: any,
}

const renderDecisions = ({
  decisionsData,
  fields,
}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const handleRemove = (index: number) => {
    fields.remove(index);
  };

  return (
    <div>
      {fields && !!fields.length && fields.map((decision, index) =>
        <DecisionItemEdit
          key={index}
          decisionsData={decisionsData}
          index={index}
          field={decision}
          onRemove={handleRemove}
        />
      )}
      <Row>
        <Column>
          <AddButton
            label='Lisää päätös'
            onClick={handleAdd}
            title='Lisää päätös'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  currentLease: Lease,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  currentLease: ?Lease,
  decisionsData: Array<Object>,
}

class DecisionsEdit extends Component<Props, State> {
  state = {
    currentLease: null,
    decisionsData: [],
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.currentLease) {
      const decisions = getContentDecisions(props.currentLease);
      return {
        currentLease: props.currentLease,
        decisionsData: decisions,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  render() {
    const {decisionsData} = this.state;

    return (
      <form>
        <FormSection>
          <FieldArray
            component={renderDecisions}
            decisionsData={decisionsData}
            name="decisions"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.DECISIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
      };
    },
    {
      receiveFormValidFlags,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(DecisionsEdit);
