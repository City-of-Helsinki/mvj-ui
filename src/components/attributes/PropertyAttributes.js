// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchPropertyAttributes} from '$src/property/actions';
import {
  getAttributes as getPropertyAttributes,
  getIsFetchingAttributes as getIsFetchingPropertyAttributes,
} from '$src/property/selectors';

import type {Attributes} from '$src/types';

function PropertyAttributes(WrappedComponent: any) {
  type Props = {
    fetchPropertyAttributes: Function,
    isFetchingPropertyAttributes: boolean,
    propertyAttributes: Attributes,
  }

  return class PropertyAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchPropertyAttributes,
        isFetchingPropertyAttributes,
        propertyAttributes,
      } = this.props;

      if(!isFetchingPropertyAttributes && !propertyAttributes) {
        fetchPropertyAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withPropertyAttributes = flowRight(
  connect(
    (state) => {
      return{
        propertyAttributes: getPropertyAttributes(state),
        isFetchingPropertyAttributes: getIsFetchingPropertyAttributes(state),
      };
    },
    {
      fetchPropertyAttributes,
    },
  ),
  PropertyAttributes,
);

export {withPropertyAttributes};
