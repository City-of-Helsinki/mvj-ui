import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AuthorizationError from "src/components/authorization/AuthorizationError";
import IndexTable from "./IndexTable";
import Loader from "src/components/loader/Loader";
import PageContainer from "src/components/content/PageContainer";
import { fetchIndexList } from "src/index/actions";
import { receiveTopNavigationSettings } from "src/components/topNavigation/actions";
import { PermissionMissingTexts } from "src/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { getContentYearlyIndexes } from "src/index/helpers";
import { hasPermissions, setPageTitle } from "src/util/helpers";
import { getRouteById, Routes } from "src/root/routes";
import { getIndexList, getIsFetching } from "src/index/selectors";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "src/usersPermissions/selectors";
import type { IndexList } from "src/index/types";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";
type Props = {
  fetchIndexList: (...args: Array<any>) => any;
  indexList: IndexList;
  isFetching: boolean;
  isFetchingUsersPermissions: boolean;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};
type State = {
  indexList: any[];
  yearlyIndexes: Array<Record<string, any>>;
};

class IndexListPage extends PureComponent<Props, State> {
  state = {
    indexList: [],
    yearlyIndexes: []
  };

  componentDidMount() {
    const {
      fetchIndexList,
      receiveTopNavigationSettings
    } = this.props;
    setPageTitle('Elinkustannusindeksit');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INDEX),
      pageTitle: 'Elinkustannusindeksit',
      showSearch: false
    });
    fetchIndexList({
      limit: 10000
    });
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.indexList !== state.indexList) {
      newState.indexList = props.indexList;
      newState.yearlyIndexes = getContentYearlyIndexes(props.indexList);
    }

    return !isEmpty(newState) ? newState : null;
  }

  render() {
    const {
      indexList,
      isFetching,
      isFetchingUsersPermissions,
      usersPermissions
    } = this.props;
    const {
      yearlyIndexes
    } = this.state;
    if (isFetching || isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (isEmpty(UsersPermissions)) return null;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INDEX)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.INDEX} /></PageContainer>;
    getContentYearlyIndexes(indexList);
    return <PageContainer>
        <IndexTable yearlyIndexes={yearlyIndexes} />
      </PageContainer>;
  }

}

export default flowRight(connect(state => {
  return {
    indexList: getIndexList(state),
    isFetching: getIsFetching(state),
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  fetchIndexList,
  receiveTopNavigationSettings
}))(IndexListPage);