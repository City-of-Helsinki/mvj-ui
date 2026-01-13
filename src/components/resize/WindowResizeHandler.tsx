import React, { PureComponent, useEffect } from "react";
import throttle from "lodash/throttle";
import { isLargeScreen } from "@/util/helpers";
export function withWindowResize(WrappedComponent: any) {
  type Props = Record<string, any>;
  type State = {
    largeScreen: boolean;
  };
  return class WindowResizeHandler extends PureComponent<Props, State> {
    _isMounted: boolean;
    state = {
      largeScreen: isLargeScreen(),
    };

    componentDidMount() {
      this._isMounted = true;
      window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
      this._isMounted = false;
      window.removeEventListener("resize", this.handleResize);
    }

    handleResize = throttle(() => {
      if (this._isMounted) {
        this.setState({
          largeScreen: isLargeScreen(),
        });
      }
    }, 100);

    render() {
      return (
        <WrappedComponent
          largeScreen={this.state.largeScreen}
          {...this.props}
        />
      );
    }
  };
}

export function useWindowResize() {
  const [largeScreen, setLargeScreen] = React.useState(isLargeScreen());

  useEffect(() => {
    const handleResize = throttle(() => {
      setLargeScreen(isLargeScreen());
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return largeScreen;
}
