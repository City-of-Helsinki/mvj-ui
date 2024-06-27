import React, { Fragment } from "react";
import BoxItemContainer from "/src/components/content/BoxItemContainer";
import Comment from "./Comment";
import FormText from "/src/components/form/FormText";
import SubTitle from "/src/components/content/SubTitle";
import { LeaseConstructabilityDescriptionsFieldPaths, LeaseConstructabilityDescriptionsFieldTitles } from "/src/leases/enums";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
type Props = {
  commentClassName?: string;
  comments: Array<Record<string, any>>;
  showNoDataText?: boolean;
  showTitle?: boolean;
};

const Comments = ({
  commentClassName,
  comments,
  showNoDataText = true,
  showTitle = true
}: Props) => <Fragment>
    {showTitle && <SubTitle uiDataKey={getUiDataLeaseKey(LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
        {LeaseConstructabilityDescriptionsFieldTitles.CONSTRUCTABILITY_DESCRIPTIONS}
      </SubTitle>}
    {comments && !!comments.length ? <BoxItemContainer>
        {comments.map((comment, index) => <Comment key={index} comment={comment} className={commentClassName} />)}
      </BoxItemContainer> : showNoDataText && <FormText><em>Ei huomautuksia.</em></FormText>}
  </Fragment>;

export default Comments;