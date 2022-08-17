// @flow

import React, {PureComponent} from 'react';
import PlotApplicationInfoCheckCollapse from "./PlotApplicationInfoCheckCollapse";

type Props = {

};

class PlotApplicationTargetInfoCheck extends PureComponent<Props> {
  render(): React$Node {
    return (
      <PlotApplicationInfoCheckCollapse className="collapse__secondary" headerTitle="Kohteen käsittelytiedot" />
    );
  }
}

export default PlotApplicationTargetInfoCheck;
