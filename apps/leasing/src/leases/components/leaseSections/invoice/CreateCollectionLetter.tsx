import React from "react";
import CreateCollectionLetterForm from "./forms/CreateCollectionLetterForm";
import GreenBox from "@/components/content/GreenBox";
import SubTitle from "@/components/content/SubTitle";
import {
  CreateCollectionLetterFieldPaths,
  CreateCollectionLetterFieldTitles,
} from "@/createCollectionLetter/enums";
import { getUiDataCreateCollectionLetterKey } from "@/uiData/helpers";

const CreateCollectionLetter = () => {
  return (
    <GreenBox className="with-top-margin">
      <SubTitle
        style={{
          textTransform: "uppercase",
        }}
        enableUiDataEdit
        uiDataKey={getUiDataCreateCollectionLetterKey(
          CreateCollectionLetterFieldPaths.CREATE_COLLECTION_LETTER,
        )}
      >
        {CreateCollectionLetterFieldTitles.CREATE_COLLECTION_LETTER}
      </SubTitle>
      <CreateCollectionLetterForm />
    </GreenBox>
  );
};

export default CreateCollectionLetter;
