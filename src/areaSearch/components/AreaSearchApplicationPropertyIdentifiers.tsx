import React, { Fragment, useState } from "react";
import Button from "components/button/Button";
import { ButtonColors } from "components/enums";
type Props = {
  ids: Array<string> | null | undefined;
};

const AreaSearchApplicationPropertyIdentifiers = ({ ids }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);

    if (!ids) {
      return '-';
    }

    const visibleList = expanded ? ids : ids.slice(0, 5);
    return <>
      {visibleList.map((item, index) => <Fragment key={index}>
        {item}
        <br />
      </Fragment>)}
      {expanded && <Button className={ButtonColors.LINK} onClick={() => setExpanded(false)} text="Näytä vähemmän" />}
      {visibleList.length < ids.length && <Button className={ButtonColors.LINK} onClick={() => setExpanded(true)} text={`Näytä kaikki (${ids.length})`} />}
    </>;
}

export default AreaSearchApplicationPropertyIdentifiers;