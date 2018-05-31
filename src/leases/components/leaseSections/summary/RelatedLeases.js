// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import RelatedLeasesItem from './RelatedLeasesItem';
import {getContentRelatedLeasesFrom, getContentRelatedLeasesTo} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

type State = {
  relatedLeasesFrom: Array<Object>,
  relatedLeasesTo: Array<Object>,
  stateOptions: Array<Object>,
}

class RelatedLeases extends Component<Props, State> {
  state = {
    relatedLeasesFrom: [],
    relatedLeasesTo: [],
    stateOptions: [],
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentLease !== prevProps.currentLease) {
      this.updateRelatedLeases();
    }
  }

  componentWillMount() {
    const {attributes, currentLease} = this.props;

    if(!isEmpty(attributes)) {
      this.updateOptions();
    }

    if(!isEmpty(currentLease)) {
      this.updateRelatedLeases();
    }
  }

  updateOptions = () => {
    const {attributes} = this.props;
    this.setState({
      stateOptions: getAttributeFieldOptions(attributes, 'state'),
    });
  }

  updateRelatedLeases = () => {
    const {currentLease} = this.props;
    this.setState({
      relatedLeasesFrom: getContentRelatedLeasesFrom(currentLease),
      relatedLeasesTo: getContentRelatedLeasesTo(currentLease),
    });
  }

  render() {
    const {currentLease} = this.props;
    const {
      relatedLeasesFrom,
      relatedLeasesTo,
      stateOptions,
    } = this.state;
    return (
      <div className="related-leases__component">
        <h3>Historia</h3>
        <div className="related-leases__items">
          <div className="related-leases__items_border-left" />
          {!!relatedLeasesTo && !!relatedLeasesTo.length && relatedLeasesTo.map((lease, index) => {
            return (
              <RelatedLeasesItem
                key={index}
                active={false}
                id={lease.id}
                lease={lease.lease}
                stateOptions={stateOptions}
              />
            );
          })}
          {!!currentLease &&
            <RelatedLeasesItem
              active={true}
              lease={currentLease}
              stateOptions={stateOptions}
            />
          }
          {!!relatedLeasesFrom && !!relatedLeasesFrom.length && relatedLeasesFrom.map((lease, index) => {
            return (
              <RelatedLeasesItem
                key={index}
                active={false}
                id={lease.id}
                lease={lease.lease}
                stateOptions={stateOptions}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };

  }
)(RelatedLeases);
