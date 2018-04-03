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
}

class Collapse extends Component {
  props: Props;

  state: State = {
    isOpen: false,
  };

  static defaultProps = {
    defaulOpen: false,
  };

  componentWillMount() {
    const {defaultOpen} = this.props;
    this.setState({
      isOpen: defaultOpen,
    });
  }

  handleToggle = () => {
    return this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const {isOpen} = this.state;
    const {children, className, header} = this.props;

    return (
      <div className={classNames('collapse', className, {'open': isOpen})}>
        <div className="collapse__header" onClick={this.handleToggle}>
          <div className='icon-wrapper'>
            <i className="arrow-icon"/>
          </div>
          <div className='header-info-wrapper'>{header}</div>
        </div>
        <div className="collapse__content">
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
