import React, { useState, useRef, useCallback, useEffect } from "react";
import classNames from "classnames";
import { Row, Column } from "react-foundation";
import AccordionIcon from "@/components/icons/AccordionIcon";
import ArchiveButton from "@/components/form/ArchiveButton";
import CollapseHeaderTitle from "./CollapseHeaderTitle";
import AttachButton from "@/components/form/AttachButton";
import CopyToClipboardButton from "@/components/form/CopyToClipboardButton";
import RemoveButton from "@/components/form/RemoveButton";
import UnarchiveButton from "@/components/form/UnarchiveButton";

type Props = {
  archived?: boolean;
  children: any;
  className?: string;
  defaultOpen: boolean;
  enableUiDataEdit?: boolean;
  hasErrors?: boolean;
  headerSubtitles?: any;
  headerTitle: any;
  headerExtras?: any;
  onArchive?: (...args: Array<any>) => any;
  onAttach?: (...args: Array<any>) => any;
  onCopyToClipboard?: (...args: Array<any>) => any;
  onRemove?: (...args: Array<any>) => any;
  onToggle?: (...args: Array<any>) => any;
  onUnarchive?: (...args: Array<any>) => any;
  showTitleOnOpen?: boolean;
  tooltipStyle?: Record<string, any>;
  uiDataKey?: string | null | undefined;
  isOpen?: boolean;
};

const Collapse: React.FC<Props> = ({
  archived,
  children,
  className,
  enableUiDataEdit,
  hasErrors = false,
  headerSubtitles,
  headerTitle,
  headerExtras,
  onArchive,
  onAttach,
  onCopyToClipboard,
  onRemove,
  onToggle,
  onUnarchive,
  showTitleOnOpen = false,
  tooltipStyle,
  uiDataKey,
  isOpen: controlledIsOpen,
  defaultOpen = false,
}) => {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [isCollapsing, setIsCollapsing] = useState<boolean>(false);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(defaultOpen);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const isControlled = controlledIsOpen !== undefined;

  const [contentHeight, setContentHeight] = useState<number | null | undefined>(
    isOpen ? null : 0,
  );

  const calculateHeight = useCallback(() => {
    if (!contentRef.current) return;
    const { clientHeight } = contentRef.current;
    setContentHeight(isOpen ? clientHeight || null : 0);
  }, [isOpen]);

  const transitionEnds = useCallback(() => {
    setIsCollapsing(false);
    setIsExpanding(false);
  }, []);

  const handleToggleStateChange = useCallback(
    (newIsOpen: boolean) => {
      if (newIsOpen) {
        setIsCollapsing(false);
        setIsExpanding(true);
        if (!isControlled) {
          setInternalIsOpen(true);
        }
      } else {
        setIsCollapsing(true);
        setIsExpanding(false);
        if (!isControlled) {
          setInternalIsOpen(false);
        }
      }
    },
    [isControlled],
  );

  const handleToggle = useCallback(
    (e: React.SyntheticEvent<HTMLAnchorElement>) => {
      const target = e.currentTarget;
      const tooltipEl = tooltipRef.current;

      if (!tooltipEl || !tooltipEl.contains(target)) {
        const newIsOpen = !isOpen;

        if (!isControlled) {
          handleToggleStateChange(newIsOpen);
        }

        if (onToggle) {
          onToggle(newIsOpen);
        }
      }
    },
    [isOpen, isControlled, handleToggleStateChange, onToggle],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleToggle(e);
      }
    },
    [handleToggle],
  );

  useEffect(() => {
    if (isControlled && controlledIsOpen !== undefined) {
      handleToggleStateChange(controlledIsOpen);
    }
  }, [controlledIsOpen, isControlled, handleToggleStateChange]);

  useEffect(() => {
    const component = componentRef.current;
    if (!component) return;

    component.addEventListener("transitionend", transitionEnds);

    const content = contentRef.current;
    if (content) {
      resizeObserverRef.current = new ResizeObserver(() => {
        calculateHeight();
      });
      resizeObserverRef.current.observe(content);
    }

    return () => {
      component.removeEventListener("transitionend", transitionEnds);
      resizeObserverRef.current?.disconnect();
    };
  }, [transitionEnds, calculateHeight]);

  // Recalculate height when open state changes
  useEffect(() => {
    if (isOpen && !contentHeight) {
      calculateHeight();
    }
  }, [isOpen, contentHeight, calculateHeight]);

  return (
    <div
      ref={componentRef}
      className={classNames(
        "collapse",
        className,
        {
          open: isOpen,
        },
        {
          "is-archived": archived,
        },
        {
          "is-collapsing": isCollapsing,
        },
        {
          "is-expanding": isExpanding,
        },
      )}
    >
      <div className="collapse__header">
        <div className="header-info-wrapper">
          <Row>
            {headerTitle && (
              <Column>
                <a
                  tabIndex={0}
                  className="header-info-link"
                  onKeyDown={handleKeyDown}
                  onClick={handleToggle}
                >
                  <AccordionIcon className="arrow-icon" />
                  <CollapseHeaderTitle
                    enableUiDataEdit={enableUiDataEdit}
                    uiDataKey={uiDataKey}
                    tooltipRef={(el) => {
                      tooltipRef.current = el;
                    }}
                    tooltipStyle={tooltipStyle}
                  >
                    {headerTitle}
                  </CollapseHeaderTitle>
                </a>
                {headerExtras}
              </Column>
            )}
            {(showTitleOnOpen || !isOpen) && headerSubtitles}
          </Row>
          <div className="collapse__header_button-wrapper">
            {!isOpen && hasErrors && (
              <span className="collapse__header_error-badge" />
            )}

            {onAttach && <AttachButton onClick={onAttach} />}
            {onCopyToClipboard && (
              <CopyToClipboardButton onClick={onCopyToClipboard} />
            )}
            {onArchive && <ArchiveButton onClick={onArchive} />}
            {onUnarchive && <UnarchiveButton onClick={onUnarchive} />}
            {onRemove && <RemoveButton onClick={onRemove} />}
          </div>
        </div>
      </div>
      <div
        className={classNames("collapse__content")}
        style={{
          maxHeight: contentHeight,
        }}
      >
        <div
          ref={contentRef}
          className="collapse__content-wrapper"
          hidden={!isOpen && !isCollapsing && !isExpanding}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapse;
