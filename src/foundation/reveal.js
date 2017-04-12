import React, {Component, PropTypes} from 'react';
import hoistsStatics from 'hoist-non-react-statics';
import {
  GeneralPropTypes,
  createClassName,
  generalClassNames,
  removeProps,
  objectKeys,
  getComponentDisplayName,
} from './utils';
import {revealContextShape} from './shapes';

/**
 * Reveal component.
 * http://foundation.zurb.com/sites/docs/reveal.html
 */
export const Reveal = (props) => {
  const className = createClassName(
    props.noDefaultClassName ? null : 'reveal',
    props.size,
    generalClassNames(props)
  );

  const passProps = removeProps(props, objectKeys(Reveal.propTypes));

  return <div {...passProps} className={className}/>;
};

Reveal.propTypes = {
  size: PropTypes.string,
  ...GeneralPropTypes,
};

/**
 * Reveal decorator.
 * http://foundation.zurb.com/sites/docs/reveal.html
 */
export const reveal = ({name}) => (WrappedComponent) => {
  class RevealOverlay extends Component {
    static propTypes = {
      className: PropTypes.string,
      isOpen: PropTypes.bool.isRequired,
      size: PropTypes.string,
    };

    static defaultProps = {
      isOpen: false,
    };

    static contextTypes = {
      revealContext: revealContextShape.isRequired,
    };

    constructor(props) {
      super(props);

      this.registerWithContext = this.registerWithContext.bind(this);
    }

    componentWillMount() {
      this.registerWithContext();
    }

    componentWillReceiveProps(nextProps) {
      const {revealContext: {openReveal}} = this.context;

      if (nextProps.isOpen && !this.props.isOpen) {
        openReveal(name);
      }
    }

    registerWithContext() {
      const {isOpen} = this.props;
      const {revealContext: {registerReveal}} = this.context;

      registerReveal(name, {isOpen});
    }

    render() {
      // TODO: Support no-overlay, that would require us to calculate the reveal position.
      // TODO: Support all possible JavaScript functionality.

      const {className, size} = this.props;
      const {revealContext: {getRevealState, closeReveal}} = this.context;
      const revealState = getRevealState(name);
      const style = {display: revealState.isOpen ? 'block' : 'none'};

      return (
        <div className={className || 'reveal-overlay'} style={style}>
          <Reveal size={size} style={style}>
            <WrappedComponent {...this.props} revealData={revealState.data} closeReveal={() => closeReveal(name)}/>
          </Reveal>
        </div>
      );
    }
  }

  RevealOverlay.displayName = `RevealOverlay(${getComponentDisplayName(WrappedComponent)})`;
  RevealOverlay.WrappedComponent = WrappedComponent;

  return hoistsStatics(RevealOverlay, WrappedComponent);
};

/**
 * Reveal open decorator.
 */
export const revealOpen = ({name}) => (WrappedComponent) => {
  const RevealOpen = (props, context) => {
    const {openReveal} = context.revealContext;

    return <WrappedComponent {...props} openReveal={(data) => openReveal(name, data)}/>;
  };

  RevealOpen.contextTypes = {
    revealContext: revealContextShape.isRequired,
  };

  RevealOpen.displayName = `RevealOpen(${getComponentDisplayName(WrappedComponent)})`;
  RevealOpen.WrappedComponent = WrappedComponent;

  return hoistsStatics(RevealOpen, WrappedComponent);
};

/**
 * Reveal context decorator.
 */
export const revealContext = () => (WrappedComponent) => {
  class RevealContext extends Component {
    static childContextTypes = {
      revealContext: revealContextShape,
    };

    constructor(props) {
      super(props);

      this.registerReveal = this.registerReveal.bind(this);
      this.openReveal = this.openReveal.bind(this);
      this.closeReveal = this.closeReveal.bind(this);
      this.getRevealState = this.getRevealState.bind(this);
      this.updateRevealState = this.updateRevealState.bind(this);

      this.state = {reveals: {}};
    }

    getChildContext() {
      return {
        revealContext: {
          registerReveal: this.registerReveal,
          openReveal: this.openReveal,
          closeReveal: this.closeReveal,
          getRevealState: this.getRevealState,
        },
      };
    }

    registerReveal(name, state) {
      this.updateRevealState(name, {...state, data: {}});
    }

    openReveal(name, data) {
      this.updateRevealState(name, {data, isOpen: true});
    }

    closeReveal(name, data) {
      this.updateRevealState(name, {data, isOpen: false});
    }

    updateRevealState(name, state) {
      this.setState({reveals: {...this.state.reveals, [name]: state}});
    }

    getRevealState(name) {
      return this.state.reveals[name] || {};
    }

    render() {
      return <WrappedComponent {...this.props} closeReveal={this.closeReveal}/>;
    }
  }

  RevealContext.displayName = `RevealContext(${getComponentDisplayName(WrappedComponent)})`;
  RevealContext.WrappedComponent = WrappedComponent;

  return hoistsStatics(RevealContext, WrappedComponent);
};
