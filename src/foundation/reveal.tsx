// TODO: Replace reveal with HDS Dialog: https://hds.hel.fi/components/dialog/code/
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import {
  createClassName,
  generalClassNames,
  getComponentDisplayName,
} from "./utils";

type RevealState = {
  isOpen?: boolean;
  data?: Record<string, any>;
};
type RevealContextValue = {
  registerReveal: (name: string, state: RevealState) => void;
  openReveal: (name: string, data?: any) => void;
  closeReveal: (name: string, data?: any) => void;
  getRevealState: (name: string) => RevealState;
};

const RevealCtx = createContext<RevealContextValue | null>(null);

const RevealProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [reveals, setReveals] = useState<Record<string, RevealState>>({});

  const updateRevealState = useCallback((name: string, state: RevealState) => {
    setReveals((prev) => ({ ...prev, [name]: state }));
  }, []);

  const registerReveal = useCallback(
    (name: string, state: RevealState) => {
      updateRevealState(name, { ...state, data: state.data ?? {} });
    },
    [updateRevealState],
  );

  const openReveal = useCallback(
    (name: string, data?: any) => {
      updateRevealState(name, { data, isOpen: true });
    },
    [updateRevealState],
  );

  const closeReveal = useCallback(
    (name: string, data?: any) => {
      updateRevealState(name, { data, isOpen: false });
    },
    [updateRevealState],
  );

  const getRevealState = useCallback(
    (name: string) => {
      return reveals[name] || { isOpen: false, data: {} };
    },
    [reveals],
  );

  const value = {
    registerReveal,
    openReveal,
    closeReveal,
    getRevealState,
  };

  return <RevealCtx.Provider value={value}>{children}</RevealCtx.Provider>;
};

export const Reveal: React.FC<any> = (props) => {
  const className = createClassName(
    props.noDefaultClassName ? null : "reveal",
    props.size,
    generalClassNames(props),
  );

  const passProps = { ...props };
  delete passProps.size;
  delete passProps.noDefaultClassName;
  delete passProps.showFor;
  delete passProps.showOnlyFor;
  delete passProps.hideFor;
  delete passProps.hideOnlyFor;
  delete passProps.isHidden;
  delete passProps.isInvisible;
  delete passProps.showForLandscape;
  delete passProps.showForPortrait;
  delete passProps.showForSr;
  delete passProps.showOnFocus;
  delete passProps.isClearfix;
  delete passProps.float;

  return <div {...passProps} className={className} />;
};

/**
 * reveal HOC
 */
export const reveal =
  ({ name }: { name: string }) =>
  (WrappedComponent: React.ComponentType<any>) => {
    const RevealOverlay: React.FC<any> = (props) => {
      const ctx = useContext(RevealCtx);
      const prevIsOpenRef = useRef<boolean>(!!props.isOpen);

      useEffect(() => {
        ctx?.registerReveal(name, { isOpen: !!props.isOpen });
      }, []);

      useEffect(() => {
        if (props.isOpen && !prevIsOpenRef.current) {
          ctx?.openReveal(name);
        }
        prevIsOpenRef.current = !!props.isOpen;
      }, [props.isOpen, ctx]);

      const revealState = ctx?.getRevealState(name) || {
        isOpen: false,
        data: {},
      };
      const style = {
        display: revealState.isOpen ? "block" : "none",
        zIndex: "1500",
      };

      return (
        <div className={props.className || "reveal-overlay"} style={style}>
          <Reveal size={props.size} style={style}>
            <WrappedComponent
              {...props}
              revealData={revealState.data}
              closeReveal={() => ctx?.closeReveal(name)}
            />
          </Reveal>
        </div>
      );
    };

    RevealOverlay.displayName = `RevealOverlay(${getComponentDisplayName(WrappedComponent)})`;
    (RevealOverlay as any).WrappedComponent = WrappedComponent;
    return hoistNonReactStatics(RevealOverlay, WrappedComponent);
  };

/**
 * revealOpen HOC
 */
export const revealOpen =
  ({ name }: { name: string }) =>
  (WrappedComponent: React.ComponentType<any>) => {
    const RevealOpen: React.FC<any> = (props) => {
      const ctx = useContext(RevealCtx);
      const open = (data?: any) => ctx?.openReveal(name, data);
      return <WrappedComponent {...props} openReveal={open} />;
    };

    RevealOpen.displayName = `RevealOpen(${getComponentDisplayName(WrappedComponent)})`;
    (RevealOpen as any).WrappedComponent = WrappedComponent;
    return hoistNonReactStatics(RevealOpen, WrappedComponent);
  };

/**
 * revealContext HOC
 */
export const revealContext =
  () => (WrappedComponent: React.ComponentType<any>) => {
    const InnerWrapped = (innerProps: any) => {
      const ctx = useContext(RevealCtx);
      return (
        <WrappedComponent {...innerProps} closeReveal={ctx?.closeReveal} />
      );
    };

    const WithRevealContext: React.ComponentType<any> = (props) => {
      return (
        <RevealProvider>
          <InnerWrapped {...props} />
        </RevealProvider>
      );
    };

    WithRevealContext.displayName = `RevealContext(${getComponentDisplayName(WrappedComponent)})`;
    (WithRevealContext as any).WrappedComponent = WrappedComponent;
    return hoistNonReactStatics(WithRevealContext, WrappedComponent);
  };
