// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchAreaNoteAttributes} from '$src/areaNote/actions';
import {
  getAttributes as getAreaNoteAttributes,
  getIsFetchingAttributes as getIsFetchingAreaNoteAttributes,
  getMethods as getAreaNoteMethods,
} from '$src/areaNote/selectors';

import type {Attributes, Methods} from '$src/types';

function AreaNoteAttributes(WrappedComponent: any) {
  type Props = {
    areaNoteAttributes: Attributes,
    areaNoteMethods: Methods,
    fetchAreaNoteAttributes: Function,
    isFetchingAreaNoteAttributes: boolean,
  }

  return class CommonAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        areaNoteAttributes,
        areaNoteMethods,
        fetchAreaNoteAttributes,
        isFetchingAreaNoteAttributes,
      } = this.props;

      if(!isFetchingAreaNoteAttributes && !areaNoteAttributes && !areaNoteMethods) {
        fetchAreaNoteAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withAreaNoteAttributes = flowRight(
  connect(
    (state) => {
      return{
        areaNoteAttributes: getAreaNoteAttributes(state),
        areaNoteMethods: getAreaNoteMethods(state),
        isFetchingAreaNoteAttributes: getIsFetchingAreaNoteAttributes(state),
      };
    },
    {
      fetchAreaNoteAttributes,
    }
  ),
  AreaNoteAttributes,
);

export {withAreaNoteAttributes};
