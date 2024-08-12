// flow
import React from "react";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";

const SelectLoadingIndicator = () => <LoaderWrapper className='select-wrapper'>
    <Loader isLoading className='small' />
  </LoaderWrapper>;

export default SelectLoadingIndicator;