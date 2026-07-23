import React from "react";
import type { FormApi } from "final-form";
import GreenBox from "@/components/content/GreenBox";
import RentBasisForm from "@/rentbasis/components/forms/RentBasisForm";

type Props = {
  formApi: FormApi;
};

const RentBasisEdit = ({ formApi }: Props) => (
  <GreenBox className="no-margin">
    <RentBasisForm formApi={formApi} />
  </GreenBox>
);

export default RentBasisEdit;
