import React, { Fragment, PureComponent } from 'react';
import { Row, Column } from "react-foundation";
import { getAttributes as getLeaseAttributes } from '@/leases/selectors';
import type { Attributes } from "types";
import { flowRight } from 'lodash';
import { connect } from 'react-redux';
import type { OldDwellingsInHousingCompaniesPriceIndex as OldDwellingsInHousingCompaniesPriceIndexProps } from '@/leases/types';
import BoxItemContainer from '@/components/content/BoxItemContainer';
import { withWindowResize } from '@/components/resize/WindowResizeHandler';

type OwnProps = OldDwellingsInHousingCompaniesPriceIndexProps;

type Props = OwnProps & {
    leaseAttributes: Attributes;
};

type State = null;

class OldDwellingsInHousingCompaniesPriceIndex extends PureComponent<Props, State> {
  state = null;
  render() {
    return <Fragment>
      <BoxItemContainer>
        <Row>
          <Column>
            <p>Tyyppi</p>
          </Column>
          <Column>
            <p>Alkupvm</p>
          </Column>
          <Column>
            <p>Indeksipisteluku</p>
            <p>Source</p>
          </Column>
          <Column>
            <p>Tarkistuspäivät</p>
          </Column>
        </Row>
      </BoxItemContainer>
    </Fragment>
  }
}

export default flowRight(withWindowResize, connect(state => {
    return {
      leaseAttributes: getLeaseAttributes(state)
    };
  }))(OldDwellingsInHousingCompaniesPriceIndex);