// @flow
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BasisOfRents from './BasisOfRents';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import GreenBox from '$components/content/GreenBox';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RentItem from './RentItem';
import RightSubtitle from '$components/content/RightSubtitle';
import {getContentRentsFormData} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';
import type {RootState} from '$src/root/types';

type Props = {
  currentLease: Lease,
}

const Rents = ({currentLease}: Props) => {
  const rentsData = getContentRentsFormData(currentLease);
  const rents = get(rentsData, 'rents', []);
  const rentsArchived = get(rentsData, 'rentsArchived', []);

  return (
    <div>
      <h2>Vuokrat</h2>
      <RightSubtitle
        text={currentLease.is_rent_info_complete
          ? <span className="success">Tiedot kunnossa<i /></span>
          : <span className="alert">Tiedot keskeneräiset<i /></span>
        }
      />
      <Divider />

      {!rents || !rents.length && <FormText className='no-margin'>Ei vuokria</FormText>}
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

      <h2>Vuokralaskelma</h2>
      <Divider />
      <GreenBox>
        <RentCalculator />
      </GreenBox>

      <h2>Vuokralaskuri</h2>
      <Divider />
      <BasisOfRents />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    currentLease: getCurrentLease(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
  ),
  withRouter,
)(Rents);
