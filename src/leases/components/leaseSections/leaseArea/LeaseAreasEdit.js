// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import Divider from '$components/content/Divider';
import FormSection from '$components/form/FormSection';
import LeaseAreaEdit from './LeaseAreaEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags} from '$src/leases/actions';
import {AreaLocation, FormNames} from '$src/leases/enums';
import {getAreasSum, getContentLeaseAreas} from '$src/leases/helpers';
import {formatNumber} from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type AreaItemProps = {
  areasData: Array<Object>,
  fields: any,
}

const renderLeaseAreas = ({
  areasData,
  fields,
}: AreaItemProps): Element<*> => {
  const handleAdd = () => {
    fields.push({
      addresses: [{}],
      location: AreaLocation.SURFACE,
    });
  };

  const handleRemove = (index: number) => {
    fields.remove(index);
  };

  return (
    <div>
      {fields && !!fields.length && fields.map((area, index) =>
        <LeaseAreaEdit
          key={index}
          areasData={areasData}
          field={area}
          index={index}
          onRemove={handleRemove}
        />
      )}
      <Row>
        <Column>
          <AddButton
            label='Lisää kohde'
            onClick={handleAdd}
            title='Lisää kohde'
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
  areasSum: ?number,
  areasData: Array<Object>,
  currentLease: ?Lease,
}

class LeaseAreasEdit extends PureComponent<Props, State> {
  state = {
    areasSum: null,
    areasData: [],
    currentLease: null,
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.currentLease) {
      const areas = getContentLeaseAreas(props.currentLease);
      return {
        areasSum: getAreasSum(areas),
        areasData: areas,
        currentLease: props.currentLease,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LEASE_AREAS]: this.props.valid,
      });
    }
  }

  render () {
    const {areasSum, areasData} = this.state;

    return (
      <form>
        <h2>Vuokra-alue</h2>
        <RightSubtitle
          text={<span>{formatNumber(areasSum) || '-'} m<sup>2</sup></span>}
        />
        <Divider />

        <FormSection>
          <FieldArray
            areasData={areasData}
            component={renderLeaseAreas}
            name="lease_areas"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.LEASE_AREAS;

export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
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
)(LeaseAreasEdit);
