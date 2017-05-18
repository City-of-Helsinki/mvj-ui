// @flow
import React from 'react';
import {Column, Row} from 'react-foundation';

// import GroupTitle from '../../../components/form/GroupTitle';
import Table from '../../../components/table/Table';

type Props = Object;

const Lease = (props: Props) => {

  return (
    <Row className={props.className}>

      <Column medium={12}>
        <h1 className="tab__content--title">Vuokra</h1>
      </Column>

      <section className="data-box">
        <div className="data-box__header">
          <h2>Vuokra <span className="identifier">Tarkentava tieto</span></h2>
          <div className="data-box__header--item">
            <span className="identifier">Käyttötarkoitus</span>
            Asunto
          </div>
          <div className="data-box__header--item">
            <span className="identifier">Sopimusvuokra</span>
            8920,50€/v
          </div>
        </div>

        <div className="data-box__content">
          <div className="data-box__content--section">
            <h3>Alennukset ja korotukset</h3>

            <Table
              headers={[
                'Tunnus',
                'Kommentti',
                'Määrä',
                'Voimassa',
              ]}
              dataKeys={[
                'tunnus',
                'kommentti',
                'maara',
                'state',
              ]}
              data={[
                {id: 1, tunnus: 'Alennus', kommentti: 'ARAVA-alennus', maara: '30%', state: '31.1.2017 - 31.12.2018'},
              ]}
            />
          </div>

          <div className="data-box__controls">
            <span className="edit">Muokkaa</span>
          </div>
        </div>
      </section>

      <Row className="section__controls">
        <Column medium={12}>
          <button className="add-new-button">Lisää vuokra</button>
        </Column>
      </Row>
    </Row>
  );
};

export default Lease;
