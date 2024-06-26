import React, { Component, Fragment } from "react";
import Button from "/src/components/button/Button";
import { ButtonColors } from "/src/components/enums";
type Props = {
  ids: Array<string> | null | undefined;
};
type State = {
  expanded: boolean;
};

class AreaSearchApplicationPropertyIdentifiers extends Component<Props, State> {
  state: State = {
    expanded: false
  };

  render(): React.ReactNode {
    const {
      ids
    } = this.props;
    const {
      expanded
    } = this.state;

    if (!ids) {
      return '-';
    }

    const visibleList = expanded ? ids : ids.slice(0, 5);
    return <>
      {visibleList.map((item, index) => <Fragment key={index}>
        {item}
        <br />
      </Fragment>)}
      {expanded && <Button className={ButtonColors.LINK} onClick={() => this.setState(() => ({
        expanded: false
      }))} text="Näytä vähemmän" />}
      {visibleList.length < ids.length && <Button className={ButtonColors.LINK} onClick={() => this.setState(() => ({
        expanded: true
      }))} text={`Näytä kaikki (${ids.length})`} />}
    </>;
  }

}

export default AreaSearchApplicationPropertyIdentifiers;