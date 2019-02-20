// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AuthorizationError from '$components/authorization/AuthorizationError';
import IndexTable from './IndexTable';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import {fetchIndexList} from '$src/index/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {Methods, PermissionMissingTexts} from '$src/enums';
import {getContentYearlyIndexes} from '$src/index/helpers';
import {isMethodAllowed} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIndexList, getIsFetching} from '$src/index/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Methods as MethodsType} from '$src/types';
import type {IndexList} from '$src/index/types';

type Props = {
  fetchIndexList: Function,
  indexList: IndexList,
  indexMethods: MethodsType, // Via withCommonAttributes HOC
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // Via withCommonAttributes HOC
  receiveTopNavigationSettings: Function,
}

type State = {
  indexList: [],
  yearlyIndexes: Array<Object>,
}

class IndexListPage extends PureComponent<Props, State> {
  state = {
    indexList: [],
    yearlyIndexes: [],
  }

  componentDidMount() {
    const {
      fetchIndexList,
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INDEX),
      pageTitle: 'Elinkustannusindeksi',
      showSearch: false,
    });

    fetchIndexList({limit: 10000});
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.indexList !== state.indexList) {
      newState.indexList = props.indexList;
      newState.yearlyIndexes = getContentYearlyIndexes(props.indexList);
    }

    return !isEmpty(newState) ? newState : null;
  }

  render() {
    const {
      indexList,
      indexMethods,
      isFetching,
      isFetchingCommonAttributes,
    } = this.props;
    const {yearlyIndexes} = this.state;

    if(isFetching || isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!indexMethods) return null;

    if(!isMethodAllowed(indexMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.INDEX} /></PageContainer>;

    getContentYearlyIndexes(indexList);
    return(
      <PageContainer>
        <IndexTable
          yearlyIndexes={yearlyIndexes}
        />
      </PageContainer>
    );
  }
}

export default flowRight(
  withCommonAttributes,
  connect(
    (state) => {
      return {
        indexList: getIndexList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchIndexList,
      receiveTopNavigationSettings,
    }
  ),
)(IndexListPage);
