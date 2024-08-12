import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchAreaNoteAttributes } from "@/areaNote/actions";
import { getAttributes as getAreaNoteAttributes, getIsFetchingAttributes as getIsFetchingAreaNoteAttributes, getMethods as getAreaNoteMethods } from "@/areaNote/selectors";
import type { Attributes, Methods } from "types";

function AreaNoteAttributes(WrappedComponent: any) {
  type Props = {
    areaNoteAttributes: Attributes;
    areaNoteMethods: Methods;
    fetchAreaNoteAttributes: (...args: Array<any>) => any;
    isFetchingAreaNoteAttributes: boolean;
  };
  return class CommonAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        areaNoteAttributes,
        areaNoteMethods,
        fetchAreaNoteAttributes,
        isFetchingAreaNoteAttributes
      } = this.props;

      if (!isFetchingAreaNoteAttributes && !areaNoteAttributes && !areaNoteMethods) {
        fetchAreaNoteAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

const withAreaNoteAttributes = flowRight(connect(state => {
  return {
    areaNoteAttributes: getAreaNoteAttributes(state),
    areaNoteMethods: getAreaNoteMethods(state),
    isFetchingAreaNoteAttributes: getIsFetchingAreaNoteAttributes(state)
  };
}, {
  fetchAreaNoteAttributes
}), AreaNoteAttributes);
export { withAreaNoteAttributes };