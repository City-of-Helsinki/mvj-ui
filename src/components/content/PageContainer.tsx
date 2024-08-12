import React, { PureComponent } from "react";
import classNames from "classnames";
import ReactResizeDetector from "react-resize-detector";
type Props = {
  children?: any;
  className?: string;
  hasTabs?: boolean;
};

class PageContainer extends PureComponent<Props> {
  component: any;
  setRef = (el: any) => {
    this.component = el;
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const pageNavigation = document.getElementsByClassName('content__page-navigator-wrapper');

    if (pageNavigation.length) {
      const {
        height
      } = pageNavigation[0].getClientRects()[0];
      this.component.style.marginTop = height + 'px';
    }
  };

  render() {
    const {
      children,
      className,
      hasTabs
    } = this.props;
    return <div ref={this.setRef} className={classNames('content__page-container', className)} style={{
      paddingTop: hasTabs ? 0 : null
    }}>
      <ReactResizeDetector handleHeight onResize={this.handleResize} />
      {children}
    </div>;
  }

}

export default PageContainer;