import React, { PureComponent } from "react";
import classNames from "classnames";
import Authorization from "@/components/authorization/Authorization";
type Props = {
  active: number | null | undefined;
  className?: string;
  isEditMode?: boolean;
  onTabClick: (...args: Array<any>) => any;
  tabs: Array<any>;
};

class Tabs extends PureComponent<Props> {
  render() {
    const { active, className, isEditMode, onTabClick, tabs } = this.props;
    return (
      <div className={classNames("tabs", className)}>
        <div className="tabs__wrapper">
          <ul>
            {tabs.map((tab, i) => {
              const handleTabClick = () => {
                onTabClick(i);
              };

              const handleKeyDown = (e: any) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  handleTabClick();
                }
              };

              return (
                <Authorization key={i} allow={tab.allow}>
                  <li
                    className={classNames({
                      "is-active": Number(active) === i,
                    })}
                  >
                    <a
                      aria-selected={Number(active) === i}
                      aria-label={tab.label}
                      onClick={handleTabClick}
                      onKeyDown={handleKeyDown}
                      tabIndex={0}
                    >
                      <span className="tabs__label">{tab.label}</span>
                      {isEditMode && tab.hasError && (
                        <span className="tabs__error-badge" />
                      )}
                      {isEditMode && tab.isDirty && !tab.hasError && (
                        <span className="tabs__dirty-badge" />
                      )}
                    </a>
                  </li>
                </Authorization>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Tabs;
