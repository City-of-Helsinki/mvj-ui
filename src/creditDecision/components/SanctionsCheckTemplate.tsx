import React, { useState } from "react";

import { Fieldset, TextInput } from "hds-react";
import SanctionsCheckRequest from "@/creditDecision/components/SanctionsCheckRequest";
import { SanctionsCheckType } from "@/creditDecision/enums";

type Props = {
  sanctionsType: SanctionsCheckType;
};

const SanctionsCheckTemplate = ({ sanctionsType }: Props) => {
  const [businessId, setBusinessId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formErrors, setFormErrors] = React.useState({});

  const validateCompany = ({ businessId }) => {
    const errors = {};
    if (!businessId) {
      errors["businessId"] = "Y-tunnus on pakollinen";
    } else if (businessId.length < 9) {
      errors["businessId"] = "Y-tunnuksen pituus on vähintään 9 merkkiä";
    }

    setFormErrors(errors);
  };

  const validatePerson = ({ lastName }) => {
    const errors = {};
    if (!lastName) {
      errors["lastName"] = "Sukunimi on pakollinen kenttä.";
    }

    setFormErrors(errors);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  React.useEffect(() => {
    if (sanctionsType === SanctionsCheckType.COMPANY) {
      validateCompany({ businessId });
    }
    if (sanctionsType === SanctionsCheckType.PERSON) {
      validatePerson({ lastName });
    }
  }, [lastName, businessId]);

  if (sanctionsType === SanctionsCheckType.COMPANY) {
    return (
      <form onSubmit={onSubmit}>
        <Fieldset
          id="company-sanctions"
          heading="Yritys"
          style={{ maxWidth: "640px" }}
          border
        >
          <TextInput
            id="textinput-sanctions-company"
            label="Y-tunnus"
            placeholder="1234567-8"
            value={businessId}
            onChange={(e) => {
              setBusinessId(e.target.value);
            }}
            invalid={!!formErrors["businessId"]}
            errorText={formErrors["businessId"]}
            required
            enterKeyHint={"next"}
          />
          <SanctionsCheckRequest
            sanctionsType={sanctionsType}
            businessId={businessId}
            formErrors={formErrors}
          />
        </Fieldset>
      </form>
    );
  } else if (sanctionsType === SanctionsCheckType.PERSON) {
    return (
      <form onSubmit={onSubmit}>
        <Fieldset
          id="person-sanctions"
          heading="Henkilö"
          style={{ maxWidth: "640px" }}
          border
        >
          <TextInput
            id="textinput-sanctions-firstname"
            label="Etunimi"
            placeholder="Etunimi"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            invalid={!!formErrors["firstName"]}
            errorText={formErrors["firstName"]}
            enterKeyHint={"next"}
          />
          <TextInput
            id="textinput-sanctions-lastname"
            label="Sukunimi"
            placeholder="Sukunimi"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            invalid={!!formErrors["lastName"]}
            errorText={formErrors["lastName"]}
            required
            enterKeyHint={"next"}
          />
          <SanctionsCheckRequest
            sanctionsType={sanctionsType}
            firstName={firstName}
            lastName={lastName}
            formErrors={formErrors}
          />
        </Fieldset>
      </form>
    );
  }
  return <></>;
};

export default SanctionsCheckTemplate;
