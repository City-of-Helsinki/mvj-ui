// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';

type Props = {
  children: Object,
  className?: string,
  defaultOpen: boolean,
  header?: any,
  headerTitle: any,
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

  getChildrenOfHeader = (header: any) => {
    if(!header) {
      return null;
    }
    return header.props.children;
  }

  render() {
    const {isOpen, isVisible} = this.state;
    const {children, className, header, headerTitle} = this.props;

    return (
      <div
        ref={(ref) => this.component = ref}
        className={classNames('collapse', className, {'open': isOpen})}
      >
        <div className="collapse__header">
          <div className='icon-wrapper' onClick={this.handleToggle}>
            <i className="arrow-icon"/>
          </div>
          <div className='header-info-wrapper'>
            <Row>
              {headerTitle &&
                <Column>
                  <a
                    className='header-info-link'
                    onClick={this.handleToggle}>
                    {headerTitle}
                  </a>
                </Column>
              }
              {this.getChildrenOfHeader(header)}
            </Row>
          </div>
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
