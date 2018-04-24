// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import BasisOfRents from './BasisOfRents';
import Divider from '$components/content/Divider';
import GreenBox from '$components/content/GreenBox';
import RentItem from './RentItem';
import RightSubtitle from '$components/content/RightSubtitle';
import {fetchDecisions} from '$src/leases/actions';
import {getContentRents} from '$src/leases/helpers';
import {getSearchQuery} from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';
import type {RootState} from '$src/root/types';

type Props = {
  currentLease: Lease,
  fetchDecisions: Function,
  params: Object,
}

class Rents extends Component {
  props: Props

  componentWillMount() {
    const {fetchDecisions, params: {leaseId}} = this.props;
    const query = {
      lease: leaseId,
      limit: 1000,
    };
    fetchDecisions(getSearchQuery(query));
  }

  render() {
    const {currentLease} = this.props;
    const rents = getContentRents(currentLease);

    return (
      <div className="rent-section">
        <h2>Vuokrat</h2>
        <RightSubtitle
          text={currentLease.is_rent_info_complete
            ? <span className="success">Vuokratiedot kunnossa<i /></span>
            : <span className="alert">Vaatii toimenpiteitä<i /></span>
          }
        />
        <Divider />

        {!rents || !rents.length && <p className='no-margin'>Ei vuokria</p>}
        {rents && !!rents.length &&
          <div>
            {rents.map((rent) => {
              return (
                <RentItem
                  key={rent.id}
                  rent={rent}
                />
              );
            })}
          </div>
        }

        <h2>Vuokranperusteet</h2>
        <Divider />
        <GreenBox>
          <BasisOfRents />
        </GreenBox>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    currentLease: getCurrentLease(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      fetchDecisions,
    }
  ),
  withRouter,
)(Rents);
