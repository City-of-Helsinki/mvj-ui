// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';

type Props = {
  children: Object,
  className?: string,
  defaultOpen: boolean,
  header: string,
}

type State = {
  isOpen: boolean,
  isVisible: boolean,
}

class Collapse extends Component {
  props: Props;

  state: State = {
    isOpen: false,
    isVisible: false,
  };

  component: any

  static defaultProps = {
    defaulOpen: false,
  };

  componentWillMount() {
    const {defaultOpen} = this.props;
    this.setState({
      isOpen: defaultOpen,
      isVisible: defaultOpen,
    });
  }

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  transitionEnds = () => {
    const {isOpen} = this.state;
    this.setState({isVisible: isOpen});
  }

  handleToggle = () => {
    return this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const {isOpen, isVisible} = this.state;
    const {children, className, header} = this.props;

    return (
      <div
        ref={(ref) => this.component = ref}
        className={classNames('collapse', className, {'open': isOpen})}
      >
        <div className="collapse__header" onClick={this.handleToggle}>
          <div className='icon-wrapper'>
            <i className="arrow-icon"/>
          </div>
          <div className='header-info-wrapper'>{header}</div>
        </div>
        <div className={classNames('collapse__content', {'visible': isVisible})}>
          <div className="collapse__content-wrapper">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default flowRight(

)(Collapse);
