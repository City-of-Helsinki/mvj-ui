import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import classNames from "classnames";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import ExternalLink from "@/components/links/ExternalLink";
import FormText from "@/components/form/FormText";
import ListItem from "@/components/content/ListItem";
import { LeaseConstructabilityDescriptionsFieldPaths } from "@/leases/enums";
import {
  formatDate,
  getReferenceNumberLink,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getUserFullName } from "@/users/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";

type Props = {
  className?: string;
  comment: Record<string, any>;
};

const Comment: React.FC<Props> = ({ className, comment }: Props) => {
  const leaseAttributes = useSelector(getLeaseAttributes);
  return (
    <BoxItem className={classNames("no-border-on-last-child", className)}>
      <Row>
        <Column small={12}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER,
            )}
          >
            <ListItem>{comment.text || ""}</ListItem>
          </Authorization>
          <FormText>
            <strong>{getUserFullName(comment.user)}</strong>
            {comment.modified_at &&
              `, ${formatDate(comment.modified_at) || ""}`}
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER,
              )}
            >
              {comment.ahjo_reference_number && (
                <span>
                  ,&nbsp;
                  <ExternalLink
                    className="no-margin"
                    href={getReferenceNumberLink(comment.ahjo_reference_number)}
                    text={comment.ahjo_reference_number}
                  />
                </span>
              )}
            </Authorization>
          </FormText>
        </Column>
      </Row>
    </BoxItem>
  );
};

export default Comment;
