// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchInfillDevelopmentAttachmentAttributes} from '$src/infillDevelopmentAttachment/actions';
import {
  getAttributes as getInfillDevelopmentAttachmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttachmentAttributes,
  getMethods as getInfillDevelopmentAttachmentMethods,
} from '$src/infillDevelopmentAttachment/selectors';

import type {Attributes, Methods} from '$src/types';

function InfillDevelopmentPageAttributes(WrappedComponent: any) {
  type Props = {
    infillDevelopmentAttachmentAttributes: Attributes,
    infillDevelopmentAttachmentMethods: Methods,
    fetchInfillDevelopmentAttachmentAttributes: Function,
    isFetchingInfillDevelopmentAttachmentAttributes: boolean,
  }

  type State = {
    isFetchingInfillDevelopmentPageAttributes: boolean,
  }

  return class InfillDevelopmentPageAttributes extends PureComponent<Props, State> {
    state = {
      isFetchingInfillDevelopmentPageAttributes: false,
    }

    componentDidMount() {
      const {
        fetchInfillDevelopmentAttachmentAttributes,
        infillDevelopmentAttachmentMethods,
        isFetchingInfillDevelopmentAttachmentAttributes,
      } = this.props;

      if(isEmpty(infillDevelopmentAttachmentMethods) && !isFetchingInfillDevelopmentAttachmentAttributes) {
        fetchInfillDevelopmentAttachmentAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingInfillDevelopmentAttachmentAttributes !== prevProps.isFetchingInfillDevelopmentAttachmentAttributes) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {isFetchingInfillDevelopmentAttachmentAttributes} = this.props;
      const isFetching = isFetchingInfillDevelopmentAttachmentAttributes;

      this.setState({isFetchingInfillDevelopmentPageAttributes: isFetching});
    }

    render() {
      return <WrappedComponent isFetchingInfillDevelopmentPageAttributes={this.state.isFetchingInfillDevelopmentPageAttributes} {...this.props} />;
    }
  };
}

const withInfillDevelopmentPageAttributes = flowRight(
  connect(
    (state) => {
      return{
        infillDevelopmentAttahmentAttributes: getInfillDevelopmentAttachmentAttributes(state),
        infillDevelopmentAttahmentMethods: getInfillDevelopmentAttachmentMethods(state),
        isFetchingInfillDevelopmentAttachmentAttributes: getIsFetchingInfillDevelopmentAttachmentAttributes(state),
      };
    },
    {
      fetchInfillDevelopmentAttachmentAttributes,
    }
  ),
  InfillDevelopmentPageAttributes,
);

export {withInfillDevelopmentPageAttributes};
