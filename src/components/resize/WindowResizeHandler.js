// @flow
import React, {PureComponent} from 'react';
import throttle from 'lodash/throttle';

import {isLargeScreen} from '$util/helpers';

export function withWindowResize(WrappedComponent: any) {
  type State = {
    largeScreen: boolean,
  }

  return class WindowResizeHandler extends PureComponent<null, State> {
    state = {
      largeScreen: isLargeScreen(),
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    handleResize = throttle(() => {
      this.setState({largeScreen: isLargeScreen()});
    }, 100);

    render() {
      return <WrappedComponent largeScreen={this.state.largeScreen} {...this.props} />;
    }
  };
}
