// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormField from '../../components/form/FormField';
import GroupTitle from '../../components/form/GroupTitle';

// type Props = {};

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
        <h2 className="tab__content--title">Kohde</h2>
      </Column>

      <Column medium={6}>
        <Field
          type="text"
          required={false}
          label="Tonttitunnus"
          name="tonttitunnus"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="text"
          required={false}
          label="Asemakaava"
          name="asemakaava"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="text"
          required={false}
          label="Alue"
          name="alue"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="text"
          required={false}
          label="Asemakaava"
          name="asemakaava"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="text"
          required={false}
          label="Kaavoitettu m2"
          name="kaavoitettu"
          component={FormField}
        />
      </Column>

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

      <GroupTitle text="Ehdot"/>
      <Column medium={12}>
        <ul className="bordered__list full-width">
          <li>Tontille rakennettava 10m2</li>
        </ul>
        <a onClick={null}>Lisää ehto</a>
      </Column>

      <GroupTitle text="Kohteen kiinteistöt"/>
      <Column medium={12}>
        <ul className="bordered__list full-width">
          <li>Tontille rakennettava 10m2</li>
        </ul>
        <a onClick={null}>Lisää ehto</a>
      </Column>

    </Row>

  );
};

export default ProppertyUnit;
