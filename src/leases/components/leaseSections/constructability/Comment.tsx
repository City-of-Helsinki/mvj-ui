import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import classNames from "classnames";
import Authorization from "src/components/authorization/Authorization";
import BoxItem from "src/components/content/BoxItem";
import ExternalLink from "src/components/links/ExternalLink";
import FormText from "src/components/form/FormText";
import ListItem from "src/components/content/ListItem";
import { LeaseConstructabilityDescriptionsFieldPaths } from "src/leases/enums";
import { formatDate, getReferenceNumberLink, isFieldAllowedToRead } from "src/util/helpers";
import { getUserFullName } from "src/users/helpers";
import { getAttributes as getLeaseAttributes } from "src/leases/selectors";
import type { Attributes } from "src/types";
type Props = {
  className?: string;
  comment: Record<string, any>;
  leaseAttributes: Attributes;
};

const Comment = ({
  className,
  comment,
  leaseAttributes
}: Props) => <BoxItem className={classNames('no-border-on-last-child', className)}>
    <Row>
      <Column small={12}>
        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
          <ListItem>{comment.text || ''}</ListItem>
        </Authorization>
        <FormText>
          <strong>{getUserFullName(comment.user)}</strong>
          {comment.modified_at && `, ${formatDate(comment.modified_at) || ''}`}
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
            {comment.ahjo_reference_number && <span>,&nbsp;
                <ExternalLink className='no-margin' href={getReferenceNumberLink(comment.ahjo_reference_number)} text={comment.ahjo_reference_number} />
              </span>}
          </Authorization>
        </FormText>
      </Column>
    </Row>
  </BoxItem>;

export default connect(state => {
  return {
    leaseAttributes: getLeaseAttributes(state)
  };
})(Comment);