// @flow
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';

type Props = {
  children?: any,
  className?: string,
}

class PageContainer extends PureComponent<Props> {
  component: any

  setRef = (el: any) => {
    this.component = el;
  }

  onResize = () => {
    const controlButtonBar = document.getElementsByClassName('control-button-bar');
    if(controlButtonBar.length) {
      const clientHeight = controlButtonBar[0].clientHeight;
      if(clientHeight) {
        this.component.style.marginTop =  clientHeight + 'px';
      }
    }
  }

  render() {
    const {children, className} = this.props;

    return <div
      ref={this.setRef}
      className={classNames('page-container', className)}
    >
      <ReactResizeDetector
        handleHeight
        onResize={this.onResize}
      />
      {children}
    </div>;
  }
}

export default PageContainer;
