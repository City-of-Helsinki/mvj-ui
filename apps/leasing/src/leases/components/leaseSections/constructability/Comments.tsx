import React from "react";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import Comment from "./Comment";
import FormText from "@/components/form/FormText";
import SubTitle from "@/components/content/SubTitle";
import {
  LeaseConstructabilityDescriptionsFieldPaths,
  LeaseConstructabilityDescriptionsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";

type Props = {
  commentClassName?: string;
  comments: Array<Record<string, any>>;
  showNoDataText?: boolean;
  showTitle?: boolean;
};

const Comments: React.FC<Props> = ({
  commentClassName,
  comments,
  showNoDataText = true,
  showTitle = true,
}: Props) => (
  <>
    {showTitle && (
      <SubTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS,
        )}
      >
        {
          LeaseConstructabilityDescriptionsFieldTitles.CONSTRUCTABILITY_DESCRIPTIONS
        }
      </SubTitle>
    )}
    {comments && !!comments.length ? (
      <BoxItemContainer>
        {comments.map((comment, index) => (
          <Comment key={index} comment={comment} className={commentClassName} />
        ))}
      </BoxItemContainer>
    ) : (
      showNoDataText && (
        <FormText>
          <em>Ei huomautuksia.</em>
        </FormText>
      )
    )}
  </>
);

export default Comments;
