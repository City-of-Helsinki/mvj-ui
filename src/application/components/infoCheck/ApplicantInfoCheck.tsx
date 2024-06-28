import React, { Component } from "react";
import { Column, Row } from "react-foundation";
import { getLabelOfOption } from "/src/util/helpers";
import { getUserFullName } from "/src/users/helpers";
type Props = {
  infoChecks: Record<string, any>;
  infoCheckStateOptions: any;
};

class ApplicantInfoCheck extends Component<Props> {
  render(): React.ReactNode {
    const {
      infoChecks,
      infoCheckStateOptions
    } = this.props;
    return <Row className="ApplicantInfoCheck">
        {infoChecks.map(item => {
        const statusText = getLabelOfOption(infoCheckStateOptions, item.data.state);
        return <Column small={6} key={item.kind.type}>
            <Row>
              <Column small={8}>
                <span>{item.kind.label}</span>
              </Column>
              <Column small={4}>
                {statusText}
                {item.data.preparer && <>, {getUserFullName(item.data.preparer)}</>}
              </Column>
            </Row>
          </Column>;
      })}
      </Row>;
  }

}

export default ApplicantInfoCheck;