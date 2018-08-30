// @flow
import React from 'react';
import {connect} from 'react-redux';

import Divider from '$components/content/Divider';
import LeaseAreaWithArchiceInfo from './LeaseAreaWithArchiceInfo';
import RightSubtitle from '$components/content/RightSubtitle';
import {getDecisionOptions} from '$src/decision/helpers';
import {getAreasSum, getContentLeaseAreas} from '$src/leases/helpers';
import {formatNumber}  from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {getDecisionsByLease} from '$src/decision/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  decisions: Array<Object>,
}

const LeaseAreas = ({currentLease, decisions}: Props) => {
  const areas = getContentLeaseAreas(currentLease);
  const activeAreas = areas.filter((area) => !area.archived_at);
  const archivedAreas = areas.filter((area) => area.archived_at);
  const areasSum = getAreasSum(activeAreas);
  const decisionOptions = getDecisionOptions(decisions);

  return (
    <div>
      <h2>Vuokra-alue</h2>
      <RightSubtitle
        text={<span>{formatNumber(areasSum) || '-'} m<sup>2</sup></span>}
      />
      <Divider />

      {!activeAreas || !activeAreas.length && <p className='no-margin'>Ei vuokra-alueita</p>}
      {activeAreas && !!activeAreas.length && activeAreas.map((area, index) =>
        <LeaseAreaWithArchiceInfo
          key={index}
          area={area}
          decisionOptions={decisionOptions}
          isActive={true}
        />
      )}

      {archivedAreas && !!archivedAreas.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
      {archivedAreas && !!archivedAreas.length && archivedAreas.map((area, index) =>
        <LeaseAreaWithArchiceInfo
          key={index}
          area={area}
          decisionOptions={decisionOptions}
          isActive={false}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);

    return {
      currentLease: currentLease,
      decisions: getDecisionsByLease(state, currentLease.id),
    };
  }
)(LeaseAreas);
