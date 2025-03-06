import React, { useState, ChangeEvent } from "react";
import { Fieldset, SelectionGroup, RadioButton } from "hds-react";
import { SanctionsCheckType } from "@/creditDecision/enums";
import SanctionsCheckTemplate from "@/creditDecision/components/SanctionsCheckTemplate";

export const SanctionsCheckForm = () => {
  const [selectedItem, setSelectedItem] = useState<SanctionsCheckType>();
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedItem(event.target.value as SanctionsCheckType);
  };

  return (
    <div>
      <Fieldset heading="Pakotelistahaku">
        <SelectionGroup label="Pakotelistahaun tyyppi">
          <RadioButton
            id="sanctions-radio-company"
            name="v-radio"
            value={SanctionsCheckType.COMPANY}
            label="Yritys"
            checked={selectedItem === SanctionsCheckType.COMPANY}
            onChange={onChange}
          />
          <RadioButton
            id="sanctions-radio-consumer"
            name="v-radio"
            value={SanctionsCheckType.PERSON}
            label="Henkilö"
            checked={selectedItem === SanctionsCheckType.PERSON}
            onChange={onChange}
          />
        </SelectionGroup>
      </Fieldset>
      <SanctionsCheckTemplate sanctionsType={selectedItem} />
    </div>
  );
};
