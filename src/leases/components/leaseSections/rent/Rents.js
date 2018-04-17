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
import {getDecisions} from '$src/leases/selectors';
import {getDecisionsOptions, getSearchQuery} from '$util/helpers';

import type {Attributes} from '$src/leases/types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  basisOfRents: Array<Object>,
  decisionsOptionData: Array<Object>,
  fetchDecisions: Function,
  isRentInfoComplete: boolean,
  params: Object,
  rents: Object,
}

class Rents extends Component {
  props: Props

  componentWillMount() {
    const {
      fetchDecisions,
      params: {leaseId},
    } = this.props;
    const query = {
      lease: leaseId,
      limit: 1000,
    };
    const search = getSearchQuery(query);
    fetchDecisions(search);
  }

  render() {
    const {
      attributes,
      basisOfRents,
      decisionsOptionData,
      isRentInfoComplete,
      rents,
    } = this.props;
    const decisionOptions = getDecisionsOptions(decisionsOptionData);

    return (
      <div className="rent-section">
        <h2>Vuokrat</h2>
        <RightSubtitle
          text={isRentInfoComplete
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
                  attributes={attributes}
                  decisionOptions={decisionOptions}
                  rent={rent}
                />
              );
            })}
          </div>
        }

        <h2>Vuokranperusteet</h2>
        <Divider />
        <GreenBox>
          <BasisOfRents
            attributes={attributes}
            basisOfRents={basisOfRents}
          />
        </GreenBox>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    decisionsOptionData: getDecisions(state),
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
