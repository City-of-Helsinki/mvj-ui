// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import GreenBox from '$components/content/GreenBox';
import InspectionItem from './InspectionItem';
import {getContentInspections} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
}

type State = {
  inspections: Array<Object>,
}

class Inspections extends PureComponent<Props, State> {
  state = {
    inspections: [],
  }

  componentDidMount() {
    const {currentLease} = this.props;
    if(!isEmpty(currentLease)) {
      this.updateContent();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.currentLease !== this.props.currentLease) {
      this.updateContent();
    }
  }

  updateContent = () => {
    const {currentLease} = this.props;
    this.setState({
      inspections: getContentInspections(currentLease),
    });
  }

  render() {
    const {inspections} = this.state;

    return (
      <div>
        <GreenBox>
          {inspections && !!inspections.length
            ? (
              <BoxItemContainer>
                {inspections.map((inspection) =>
                  <BoxItem
                    className='no-border-on-first-child'
                    key={inspection.id}>
                    <InspectionItem
                      inspection={inspection}
                    />
                  </BoxItem>
                )}
              </BoxItemContainer>
            ) : <p>Ei tarkastuksia tai huomautuksia</p>
          }
        </GreenBox>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
    };
  },
)(Inspections);
