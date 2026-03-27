import React from "react";
import { Breadcrumb, Button, ButtonVariant } from "hds-react";

interface LandUseNotFoundPageProps {
  agreementId: string;
  onBackToList: () => void;
}

const LandUseNotFoundPage: React.FC<LandUseNotFoundPageProps> = ({
  agreementId,
  onBackToList,
}) => {
  return (
    <div className="landuse-detail">
      <Breadcrumb
        aria-label="Breadcrumb"
        list={[
          { title: "Maanvuokrausjärjestelmä", path: "/" },
          { title: "Maankäyttösopimukset", path: "/maankayttosopimukset" },
          { title: "Sivua ei löytynyt", path: "" },
        ]}
      />

      <div className="landuse-detail__content">
        <h1 className="landuse-detail__title">404 - Sivua ei löytynyt</h1>
        <p>Maankäyttösopimusta tunnuksella {agreementId} ei löytynyt.</p>
        <Button variant={ButtonVariant.Primary} onClick={onBackToList}>
          Siirry listaan
        </Button>
      </div>
    </div>
  );
};

export default LandUseNotFoundPage;
