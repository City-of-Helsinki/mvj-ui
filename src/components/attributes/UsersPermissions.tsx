import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { fetchUsersPermissions } from "src/usersPermissions/actions";
import { getUsersPermissions, getIsFetching as getIsFetchingUsersPermissions } from "src/usersPermissions/selectors";
import type { UsersPermissions } from "src/usersPermissions/types";

function UsersPermissionsWrapper(WrappedComponent: any) {
  type Props = {
    fetchUsersPermissions: (...args: Array<any>) => any;
    isFetchingUsersPermissions: boolean;
    usersPermissions: UsersPermissions;
  };
  return class CommonAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchUsersPermissions,
        isFetchingUsersPermissions,
        usersPermissions
      } = this.props;

      if (!isFetchingUsersPermissions && isEmpty(usersPermissions)) {
        fetchUsersPermissions();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

// @ts-expect-error
const withUsersPermissions = flowRight(connect(state => {
  return {
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  fetchUsersPermissions
}), UsersPermissionsWrapper);
export { withUsersPermissions };