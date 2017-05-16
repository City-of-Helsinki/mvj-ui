// @flow
import React from 'react';
import {Column, Row} from 'react-foundation';

import GroupTitle from '../../../components/form/GroupTitle';

type Props = Object;

const Billing = (props: Props) => {

  return (
    <Row className={props.className}>
      <Column medium={12}>
        <h1 className="tab__content--title">Vuokrauksen laskutus</h1>
      </Column>

      <section className="data-box borderless">
        <div className="data-box__header">
          <div className="data-box__header--item">
            <span className="identifier">Laskutuksen tila</span>
            Käynnissä
          </div>
          <div className="data-box__header--item">
            <span className="identifier">Laskutettavia</span>
            2kpl
          </div>
          <div className="data-box__header--item main">
            <span className="identifier">Laskutus yhteensä</span>
            10 000€
          </div>
        </div>
      </section>

      <GroupTitle text="Laskutuksen jako"/>

      <section className="data-box">
        <div className="data-box__header">
          <h2>Organisaatio X <span className="identifier">Tarkentava tieto</span></h2>
          <div className="data-box__header--item">
            <span className="identifier">Osuus</span>
            40%
          </div>
          <div className="data-box__header--item">
            <span className="identifier">Summa</span>
            4000€
          </div>
        </div>
      </section>

      <section className="data-box">
        <div className="data-box__header">
          <h2>Organisaatio Y <span className="identifier">Tarkentava tieto</span></h2>
          <div className="data-box__header--item">
            <span className="identifier">Osuus</span>
            60%
          </div>
          <div className="data-box__header--item">
            <span className="identifier">Summa</span>
            6000€
          </div>
        </div>
      </section>

      <Row className="section__controls">
        <Column medium={12}>
          <button className="add-new-button">Lisää jako</button>
        </Column>
      </Row>

    </Row>
  );
};

export default Billing;
