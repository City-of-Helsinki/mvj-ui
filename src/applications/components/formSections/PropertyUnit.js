// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import GroupTitle from '../../../components/form/GroupTitle';
import Table from '../../../components/table/Table';

const links = [
  'Kiinteistörekisteriote',
  'Muodostumisketju eteenpäin',
  'Lainhuutotodistus',
  'Muodostumisketju taaksepäin',
  'Kiinteistörekisterin karttaote',
  'Voimassa olevat muodostuneet',
  'Rasitustodistus',
  'Muodostajarekisteriyksiköt ajankohtana',
  'Omistajien yhteystiedot',
  'Muodostajaselvitys',
];

type Props = Object;

const ProppertyUnit = (props: Props) => {

  return (

    <Row className={props.className}>
      <Column medium={12}>
        <h1 className="tab__content--title">Kiinteistöt</h1>
      </Column>

      <section className="data-box">
        <div className="data-box__header">
          <h2>091-002-0096-0032-M601 <span className="identifier">Tarkentava tieto</span></h2>
          <div className="data-box__header--item">
            <span className="identifier">Rekisteröity</span>
            3.3.2017
          </div>
          <div className="data-box__header--item">
            <span className="identifier">Pinta-ala</span>
            8413m<sup>2</sup>
          </div>
        </div>

        <div className="data-box__content">
          <div className="data-box__content--section">
            <h3>Tonttijako</h3>

            <Table
              headers={[
                'Tunnus',
                'Laji',
                'Hyväksytty',
                'Vaihe',
              ]}
              dataKeys={[
                'tunnus',
                'laji',
                'approved',
                'state',
              ]}
              data={[
                {id: 1, tunnus: '11077', laji: 'Perustava tonttijako', approved: '3.3.2017', state: 'Voimassa'},
              ]}
            />
          </div>

          <div className="data-box__content--section">
            <h3>Asemakaava</h3>

            <Table
              headers={[
                'Tunnus',
                'Laji',
                'Hyväksytty',
                'Vaihe',
              ]}
              dataKeys={[
                'tunnus',
                'laji',
                'approved',
                'state',
              ]}
              data={[
                {id: 1, tunnus: '11077', laji: 'Perustava tonttijako', approved: '3.3.2017', state: 'Voimassa'},
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
          <button className="add-new-button">Lisää kiinteistö</button>
        </Column>
      </Row>

      <GroupTitle text="KTJ-dokumentit"/>

      <Column medium={12}>
        <ul className="bordered__list">
          {links.map((link, i) => (
            <li key={i}>{link}
              <div className="links">
                <a href="#" target="_blank">fi</a>
                <a href="#" target="_blank">se</a>
              </div>
            </li>
          ))}
        </ul>
      </Column>

    </Row>

  );
};

export default ProppertyUnit;
