// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';

type Props = {
  children: Object,
  defaultOpen: boolean,
  header: string,
}

type State = {
  isOpen: boolean,
}

class Collapse extends Component {
  props: Props;
  state: State;

  static defaultProps = {
    defaulOpen: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

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
    const {children, header} = this.props;

    return (
      <div className={classNames('collapse', {'open': isOpen})}>
        <div className="collapse__header" onClick={this.handleToggle}>
          <span>{header}</span> <i className="fa fa-plus"/>
        </div>
        <div className="collapse__content">
          {children}
        </div>
      </div>
    );
  }
}

export default flowRight(

)(Collapse);
