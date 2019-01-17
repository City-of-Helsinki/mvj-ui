// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import ConstructabilityItemEdit from './ConstructabilityItemEdit';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
// import SendEmail from './SendEmail';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames, LeaseAreasFieldPaths} from '$src/leases/enums';
import {getContentConstructability} from '$src/leases/helpers';
import {getFieldOptions} from '$util/helpers';
import {getAttributes, getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type AreaProps = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  locationOptions: Array<Object>,
  savedAreas: Array<Object>,
  typeOptions: Array<Object>,
}

const renderAreas = ({
  attributes,
  errors,
  fields,
  isSaveClicked,
  locationOptions,
  savedAreas,
  typeOptions,
}: AreaProps): Element<*> => {
  return (
    <Fragment>
      {!fields || !fields.length && <FormText className='no-margin'>Ei vuokra-alueita</FormText>}
      {savedAreas && !!savedAreas.length && fields && !!fields.length && fields.map((area, index) => {

        return (
          <ConstructabilityItemEdit
            key={index}
            attributes={attributes}
            errors={errors}
            field={area}
            isSaveClicked={isSaveClicked}
            locationOptions={locationOptions}
            savedArea={savedAreas[index]}
            typeOptions={typeOptions}
          />
        );
      })}
    </Fragment>
  );
};

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  errors: ?Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  attributes: Attributes,
  currentLease: Lease,
  locationOptions: Array<Object>,
  typeOptions: Array<Object>,
  savedAreas: Array<Object>,
}

class ConstructabilityEdit extends PureComponent<Props, State> {
  state = {
    attributes: {},
    currentLease: {},
    locationOptions: [],
    typeOptions: [],
    savedAreas: [],
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONSTRUCTABILITY]: this.props.valid,
      });
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.locationOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.LOCATION);
      newState.typeOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.TYPE);
    }

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.savedAreas = getContentConstructability(props.currentLease);
    }

    return newState;
  }

  render () {
    const {
      attributes,
      errors,
      handleSubmit,
      isSaveClicked,
    } = this.props;
    const {
      locationOptions,
      savedAreas,
      typeOptions,
    } = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <h2>Rakentamiskelpoisuus</h2>
        <Divider />
        {/* <SendEmail /> */}

        <FieldArray
          attributes={attributes}
          component={renderAreas}
          errors={errors}
          isSaveClicked={isSaveClicked}
          locationOptions={locationOptions}
          name='lease_areas'
          savedAreas={savedAreas}
          typeOptions={typeOptions}
        />
      </form>
    );
  }
}

const formName = FormNames.CONSTRUCTABILITY;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ConstructabilityEdit);
