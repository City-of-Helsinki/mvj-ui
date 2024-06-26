import React, { Fragment, PureComponent, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import ConstructabilityItemEdit from "./ConstructabilityItemEdit";
import Divider from "/src/components/content/Divider";
import FormText from "/src/components/form/FormText";
import SendEmail from "./SendEmail";
import Title from "/src/components/content/Title";
import { receiveFormValidFlags } from "leases/actions";
import { FormNames } from "enums";
import { LeaseAreasFieldPaths, LeaseAreasFieldTitles } from "leases/enums";
import { getContentConstructabilityAreas } from "leases/helpers";
import { getUiDataLeaseKey } from "uiData/helpers";
import { getFieldOptions } from "util/helpers";
import { getAttributes, getCurrentLease, getErrorsByFormName, getIsSaveClicked } from "leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "leases/types";
type AreaProps = {
  attributes: Attributes;
  constructabilityStateOptions: Array<Record<string, any>>;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
  locationOptions: Array<Record<string, any>>;
  savedAreas: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
};

const renderAreas = ({
  attributes,
  constructabilityStateOptions,
  errors,
  fields,
  isSaveClicked,
  locationOptions,
  savedAreas,
  typeOptions
}: AreaProps): ReactElement => {
  return <Fragment>
      {!fields || !fields.length && <FormText className='no-margin'>Ei vuokra-alueita</FormText>}
      {savedAreas && !!savedAreas.length && fields && !!fields.length && fields.map((area, index) => {
      return <ConstructabilityItemEdit key={index} attributes={attributes} constructabilityStateOptions={constructabilityStateOptions} errors={errors} field={area} isSaveClicked={isSaveClicked} locationOptions={locationOptions} savedArea={savedAreas[index]} typeOptions={typeOptions} />;
    })}
    </Fragment>;
};

type Props = {
  attributes: Attributes;
  currentLease: Lease;
  errors: Record<string, any> | null | undefined;
  handleSubmit: (...args: Array<any>) => any;
  isSaveClicked: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  valid: boolean;
};
type State = {
  attributes: Attributes;
  constructabilityStateOptions: Array<Record<string, any>>;
  currentLease: Lease;
  locationOptions: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
  savedAreas: Array<Record<string, any>>;
};

class ConstructabilityEdit extends PureComponent<Props, State> {
  state = {
    attributes: null,
    constructabilityStateOptions: [],
    currentLease: {},
    locationOptions: [],
    typeOptions: [],
    savedAreas: []
  };

  componentDidUpdate(prevProps) {
    const {
      receiveFormValidFlags
    } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid
      });
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.constructabilityStateOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE);
      newState.locationOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.LOCATION);
      newState.typeOptions = getFieldOptions(props.attributes, LeaseAreasFieldPaths.TYPE);
    }

    if (props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.savedAreas = getContentConstructabilityAreas(props.currentLease);
    }

    return newState;
  }

  render() {
    const {
      errors,
      handleSubmit,
      isSaveClicked
    } = this.props;
    const {
      constructabilityStateOptions,
      locationOptions,
      savedAreas,
      typeOptions
    } = this.state;
    return <form onSubmit={handleSubmit}>
        <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.CONSTRUCTABILITY)}>
          {LeaseAreasFieldTitles.CONSTRUCTABILITY}
        </Title>
        <Divider />
        <SendEmail />

        <FieldArray component={renderAreas} constructabilityStateOptions={constructabilityStateOptions} errors={errors} isSaveClicked={isSaveClicked} locationOptions={locationOptions} name='lease_areas' savedAreas={savedAreas} typeOptions={typeOptions} />
      </form>;
  }

}

const formName = FormNames.LEASE_CONSTRUCTABILITY;
export default flowRight(connect(state => {
  return {
    attributes: getAttributes(state),
    currentLease: getCurrentLease(state),
    errors: getErrorsByFormName(state, formName),
    isSaveClicked: getIsSaveClicked(state)
  };
}, {
  receiveFormValidFlags
}), reduxForm({
  form: formName,
  destroyOnUnmount: false
}))(ConstructabilityEdit) as React.ComponentType<any>;