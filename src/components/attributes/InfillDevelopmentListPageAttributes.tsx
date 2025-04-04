import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchInfillDevelopmentAttributes } from "@/infillDevelopment/actions";
import {
  getAttributes as getInfillDevelopmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttributes,
  getMethods as getInfillDevelopmentMethods,
} from "@/infillDevelopment/selectors";
import type { Attributes, Methods } from "types";

function InfillDevelopmentListPageAttributes(WrappedComponent: any) {
  type Props = {
    fetchInfillDevelopmentAttributes: (...args: Array<any>) => any;
    infillDevelopmentAttributes: Attributes;
    infillDevelopmentMethods: Methods;
    isFetchingInfillDevelopmentAttributes: boolean;
  };
  return class InfillDevelopmentListPageAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchInfillDevelopmentAttributes,
        infillDevelopmentAttributes,
        infillDevelopmentMethods,
        isFetchingInfillDevelopmentAttributes,
      } = this.props;

      if (
        !isFetchingInfillDevelopmentAttributes &&
        !infillDevelopmentAttributes &&
        !infillDevelopmentMethods
      ) {
        fetchInfillDevelopmentAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withInfillDevelopmentListPageAttributes = flowRight(
  connect(
    (state) => {
      return {
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
        infillDevelopmentMethods: getInfillDevelopmentMethods(state),
        isFetchingInfillDevelopmentAttributes:
          getIsFetchingInfillDevelopmentAttributes(state),
      };
    },
    {
      fetchInfillDevelopmentAttributes,
    },
  ),
  InfillDevelopmentListPageAttributes,
);
export { withInfillDevelopmentListPageAttributes };
