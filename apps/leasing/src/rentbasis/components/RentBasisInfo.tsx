import React from "react";
import { useSelector } from "react-redux";
import Authorization from "@/components/authorization/Authorization";
import FormTextTitle from "@/components/form/FormTextTitle";
import { RentBasisFieldPaths, RentBasisFieldTitles } from "@/rentbasis/enums";
import { isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes as getRentBasisAttributes } from "@/rentbasis/selectors";
import type { Attributes } from "types";
type Props = {
  identifier: string | number | null | undefined;
};

const RentBasisInfo = ({ identifier }: Props) => {
  const rentBasisAttributes: Attributes = useSelector(getRentBasisAttributes);
  if (!identifier) return null;
  return (
    <Authorization
      allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.ID)}
    >
      <div className="rent-basis-page_info">
        <FormTextTitle>{RentBasisFieldTitles.IDENTIFIER}</FormTextTitle>
        <h1 className="rent-basis-page__info_identifier">{identifier}</h1>
      </div>
    </Authorization>
  );
};

export default RentBasisInfo;
