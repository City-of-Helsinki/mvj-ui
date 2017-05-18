// @flow
import React from 'react';
import {Column, Row} from 'react-foundation';

type Props = Object;

const Conditions = (props: Props) => {

  return (
    <Row className={props.className}>
      <Column medium={12}>
        <h1 className="tab__content--title">Ehdot</h1>
      </Column>

      <section className="data-box">
        <div className="data-box__header">
          <h2>Rakennusala min. <span className="identifier">Tontille rakennettava min. X</span></h2>
        </div>
        <div className="data-box__controls">
          <span className="edit">Muokkaa</span>
        </div>
      </section>

      <Row className="section__controls">
        <Column medium={12}>
          <button className="add-new-button">Lisää ehto</button>
        </Column>
      </Row>

    </Row>
  );
};

export default Conditions;
