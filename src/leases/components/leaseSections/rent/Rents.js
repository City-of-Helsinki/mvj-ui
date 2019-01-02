// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import BasisOfRents from './BasisOfRents';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import GreenBox from '$components/content/GreenBox';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RentItem from './RentItem';
import RightSubtitle from '$components/content/RightSubtitle';
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  LeaseRentsFieldPaths,
  LeaseRentsFieldTitles,
} from '$src/leases/enums';
import {getContentRentsFormData} from '$src/leases/helpers';
import {isFieldAllowedToRead} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {RootState} from '$src/root/types';
import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  leaseAttributes: Attributes,
}

const Rents = ({currentLease, leaseAttributes}: Props) => {
  const rentsData = getContentRentsFormData(currentLease);
  const rents = get(rentsData, 'rents', []);
  const rentsArchived = get(rentsData, 'rentsArchived', []);

  return (
    <Fragment>
      <h2>{LeaseRentsFieldTitles.RENTS}</h2>
      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.IS_RENT_INFO_COMPLETE)}>
        <RightSubtitle
          text={currentLease.is_rent_info_complete
            ? <span className="success">Tiedot kunnossa<i /></span>
            : <span className="alert">Tiedot keskeneräiset<i /></span>
          }
        />
      </Authorization>
      <Divider />

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.RENTS)}>
        {!rents || !rents.length && <FormText>Ei vuokria</FormText>}
        {rents && !!rents.length && rents.map((rent) => {
          return (
            <RentItem
              key={rent.id}
              rent={rent}
              rents={rents}
            />
          );
        })}

        {!!rentsArchived.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
        {!!rentsArchived.length && rentsArchived.map((rent) =>
          <RentItem
            key={rent.id}
            rent={rent}
            rents={rentsArchived}
          />
        )}
      </Authorization>

      <h2>Vuokralaskelma</h2>
      <Divider />
      <GreenBox>
        <RentCalculator />
      </GreenBox>

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
        <h2>{LeaseBasisOfRentsFieldTitles.BASIS_OF_RENTS}</h2>
        <Divider />
        <BasisOfRents />
      </Authorization>
    </Fragment>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    currentLease: getCurrentLease(state),
    leaseAttributes: getLeaseAttributes(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
  ),
  withRouter,
)(Rents);
