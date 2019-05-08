// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchUiDataList} from '$src/uiData/actions';
import {getIsFetching, getUiDataList} from '$src/uiData/selectors';

import type {UiDataList} from '$src/uiData/types';

function UiDataListHOC(WrappedComponent: any) {
  type Props = {
    fetchUiDataList: Function,
    isFetchingUiDataList: boolean,
    uiDataList: UiDataList,
  }

  return class CommonAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchUiDataList,
        isFetchingUiDataList,
        uiDataList,
      } = this.props;

      if(!isFetchingUiDataList && isEmpty(uiDataList)) {
        fetchUiDataList({limit: 100000});
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withUiDataList = flowRight(
  connect(
    (state) => {
      return{
        isFetchingUiDataList: getIsFetching(state),
        uiDataList: getUiDataList(state),
      };
    },
    {
      fetchUiDataList,
    }
  ),
  UiDataListHOC,
);

export {withUiDataList};
