import React, { Component } from "react";
import classnames from "classnames";
import CloseButton from "../button/CloseButton";
type Props = {
  children?: any;
  className?: string;
  isOpen: boolean;
  onClose: (...args: Array<any>) => any;
  title: string;
};
type State = {
  isClosing: boolean;
  isOpening: boolean;
};

class Modal extends Component<Props, State> {
  component: any;
  state: State = {
    isClosing: false,
    isOpening: false
  };

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.setState({
        isOpening: true
      });
    } else if (prevProps.isOpen && !this.props.isOpen) {
      this.setState({
        isClosing: true
      });
    }
  }

  setComponentRef: (arg0: any) => void = element => {
    this.component = element;
  };
  transitionEnds: () => void = () => {
    this.setState({
      isClosing: false,
      isOpening: false
    });
  };

  render(): React.ReactNode {
    const {
      children,
      className,
      isOpen,
      onClose,
      title
    } = this.props;
    const {
      isClosing,
      isOpening
    } = this.state;
    return <div ref={this.setComponentRef} className={classnames('modal', className, {
      'modal-open': isOpen
    })}>
        <div className='modal__overlay'></div>
        <div className='modal__wrapper'>

          <div className='modal__header' hidden={!isOpen && !isClosing && !isOpening}>
            <div className='modal__header_wrapper'>
              <h1 className='title'>{title}</h1>
              <CloseButton className='position-topright' onClick={onClose} title='Sulje' />
            </div>
          </div>
          <div className='modal__content' hidden={!isOpen && !isClosing && !isOpening}>
            {children}
          </div>
        </div>
      </div>;
  }

}

export default Modal;