// @flow
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';

import InfoIcon from '$components/icons/InfoIcon';

type Props = {
  text: string,
}

type State = {
  isOpen: boolean,
}

class Tooltip extends PureComponent<Props, State> {
  state = {
    isOpen: false,
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (event: any) => {
    const {isOpen} = this.state;
    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (isOpen && el && target !== el && !el.contains(target)) {
      this.toggleTooltip();
    }
  };

  toggleTooltip = () => {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    const {text} = this.props;
    const {isOpen} = this.state;

    return(
      <div className='tooltip__component'>
        <div className='tooltip__container'>
          <button onClick={this.toggleTooltip}>
            <InfoIcon />
          </button>
          {isOpen &&
            <div className='tooltip__text-container'>
              <p>{text}</p>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Tooltip;
