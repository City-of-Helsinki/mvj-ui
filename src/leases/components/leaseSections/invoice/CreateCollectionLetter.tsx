import React from "react";
import CreateCollectionLetterForm from "./forms/CreateCollectionLetterForm";
import GreenBox from "/src/components/content/GreenBox";
import SubTitle from "/src/components/content/SubTitle";
import { CreateCollectionLetterFieldPaths, CreateCollectionLetterFieldTitles } from "/src/createCollectionLetter/enums";
import { getUiDataCreateCollectionLetterKey } from "uiData/helpers";

const CreateCollectionLetter = () => {
  return <GreenBox className='with-top-margin'>
      <SubTitle style={{
      textTransform: 'uppercase'
    }} enableUiDataEdit uiDataKey={getUiDataCreateCollectionLetterKey(CreateCollectionLetterFieldPaths.CREATE_COLLECTION_LETTER)}>
        {CreateCollectionLetterFieldTitles.CREATE_COLLECTION_LETTER}
      </SubTitle>
      <CreateCollectionLetterForm />
    </GreenBox>;
};

export default CreateCollectionLetter;