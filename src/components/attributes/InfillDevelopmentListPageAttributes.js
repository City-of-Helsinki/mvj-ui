// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchInfillDevelopmentAttributes} from '$src/infillDevelopment/actions';
import {
  getAttributes as getInfillDevelopmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttributes,
  getMethods as getInfillDevelopmentMethods,
} from '$src/infillDevelopment/selectors';

import type {Attributes, Methods} from '$src/types';

function InfillDevelopmentListPageAttributes(WrappedComponent: any) {
  type Props = {
    fetchInfillDevelopmentAttributes: Function,
    infillDevelopmentAttributes: Attributes,
    infillDevelopmentMethods: Methods,
    isFetchingInfillDevelopmentAttributes: boolean,
  }

  return class InfillDevelopmentListPageAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchInfillDevelopmentAttributes,
        infillDevelopmentAttributes,
        infillDevelopmentMethods,
        isFetchingInfillDevelopmentAttributes,
      } = this.props;

      if(!isFetchingInfillDevelopmentAttributes && !infillDevelopmentAttributes && !infillDevelopmentMethods) {
        fetchInfillDevelopmentAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withInfillDevelopmentListPageAttributes = flowRight(
  connect(
    (state) => {
      return{
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
        infillDevelopmentMethods: getInfillDevelopmentMethods(state),
        isFetchingInfillDevelopmentAttributes: getIsFetchingInfillDevelopmentAttributes(state),
      };
    },
    {
      fetchInfillDevelopmentAttributes,
    }
  ),
  InfillDevelopmentListPageAttributes,
);

export {withInfillDevelopmentListPageAttributes};
