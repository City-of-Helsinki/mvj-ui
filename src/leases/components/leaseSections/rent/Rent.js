// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BasicInfo from './BasicInfo';
import Collapse from '$components/collapse/Collapse';
import ContractRents from './ContractRents';
import BasisOfRents from './BasisOfRents';
import Divider from '$components/content/Divider';
import IndexAdjustedRents from './IndexAdjustedRents';
import PayableRents from './PayableRents';
import RentAdjustments from './RentAdjustments';
import RightSubtitle from '$components/content/RightSubtitle';
import {RentTypes} from '$src/leases/enums';
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
  params: Object,
  rents: Object,
}

class Rent extends Component {
  props: Props

  componentWillMount() {
    const {
      fetchDecisions,
      params: {leaseId},
    } = this.props;
    const query = {
      lease: leaseId,
      imit: 1000,
    };
    const search = getSearchQuery(query);
    fetchDecisions(search);
  }

  render() {
    const {attributes, basisOfRents, decisionsOptionData, rents} = this.props;
    const decisionOptions = getDecisionsOptions(decisionsOptionData);
    const rentType = get(rents, 'type');

    return (
      <div className="rent-section">
        <Row>
          <Column>
            <h2>Vuokra</h2>
            <RightSubtitle
              text={rents.is_active
                ? <span className="success">Vuokratiedot kunnossa<i /></span>
                : <span className="alert">Vaatii toimenpiteitä<i /></span>
              }
            />
            </Column>
        </Row>
        <Divider />

        <Collapse
          className='no-content-top-padding'
          defaultOpen={true}
          header={
            <Row>
              <Column><h3 className='collapse__header-title'>Vuokran perustiedot</h3></Column>
            </Row>
          }>
          <BasicInfo
            attributes={attributes}
            rents={rents}
          />
        </Collapse>

        {(rentType === RentTypes.INDEX ||
          rentType === '2' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Sopimusvuokra</h3></Column>
              </Row>
            }>
            <ContractRents
              attributes={attributes}
              contractRents={get(rents, 'contract_rents', [])}
              rentType={rentType}
            />
          </Collapse>
        }

        {(rentType === RentTypes.INDEX ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Indeksitarkistettu vuokra</h3></Column>
              </Row>
            }>
            <IndexAdjustedRents
              attributes={attributes}
              indexAdjustedRents={get(rents, 'index_adjusted_rents', [])}
            />
          </Collapse>
        }

        {(rentType === RentTypes.INDEX ||
          rentType === '2' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Alennukset ja korotukset</h3></Column>
              </Row>
            }>
            <RentAdjustments
              attributes={attributes}
              decisionOptions={decisionOptions}
              rentAdjustments={get(rents, 'rent_adjustments', [])}
            />
          </Collapse>
        }

        {(rentType === RentTypes.INDEX ||
          rentType === '2' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Perittävä vuokra</h3></Column>
              </Row>
            }>
            <PayableRents
              payableRents={get(rents, 'payable_rents', [])}
            />
          </Collapse>
        }

        {(rentType === RentTypes.INDEX ||
          rentType === '1' ||
          rentType === '2' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Vuokranperusteet</h3></Column>
              </Row>
            }>
            <BasisOfRents
              attributes={attributes}
              basisOfRents={basisOfRents}
            />
          </Collapse>
        }
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
)(Rent);
