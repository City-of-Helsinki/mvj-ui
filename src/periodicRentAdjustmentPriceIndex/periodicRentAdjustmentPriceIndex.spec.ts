import { describe, expect, it } from "vitest";
import {
  receivePeriodicRentAdjustmentPriceIndex,
  fetchPeriodicRentAdjustmentPriceIndex,
  notFound,
} from "./actions";
import periodicRentAdjustmentPriceIndexReducer from "./reducer";
import type {
  PeriodicRentAdjustmentPriceIndex,
  PeriodicRentAdjustmentPriceIndexState,
} from "./types";
const defaultState: PeriodicRentAdjustmentPriceIndexState = {
  isFetching: false,
  latest: null,
};

describe("periodicRentAdjustmentPriceIndex", () => {
  describe("Reducer", () => {
    describe("periodicRentAdjustmentPriceIndexReducer", () => {
      it("should update periodicRentAdjustmentPriceIndex", () => {
        const dummy: PeriodicRentAdjustmentPriceIndex = {
          point_figures: [
            {
              value: 97.4,
              year: 2023,
              region: "pks",
              comment: "",
            },
            {
              value: 105.7,
              year: 2022,
              region: "pks",
              comment: "",
            },
            {
              value: 105.6,
              year: 2021,
              region: "pks",
              comment: "",
            },
            {
              value: 100.0,
              year: 2020,
              region: "pks",
              comment: "",
            },
          ],
          code: "ketj_P_QA_T",
          name: "Indeksi (2020=100)",
          comment:
            "Indeksi on suhdeluku, joka kuvaa jonkin muuttujan (esimerkiksi hinnan, määrän tai arvon) suhteellista muutosta perusjakson (esimerkiksi vuoden) suhteen. Kunkin ajankohdan indeksipisteluku ilmoittaa, kuinka monta prosenttia kyseisen ajankohdan tarkasteltava muuttuja on perusjakson arvosta tai määrästä. Perusjakson indeksipistelukujen keskiarvo on 100. Tilastossa julkaistavat hintaindeksit ovat laatuvakioituja ja niiden kehitys voi poiketa neliöhintojen kehityksestä.\r\n",
          source: "Tilastokeskus, osakeasuntojen hinnat",
          source_table_updated: "2024-05-03T08:00:00+03:00",
          source_table_label:
            "Vanhojen osakeasuntojen hintaindeksi (2020=100) ja kauppojen lukumäärät, vuositasolla muuttujina Vuosi, Alue ja Tiedot",
          url: "https://pxdata.stat.fi:443/PxWeb/api/v1/fi/StatFin/ashi/statfin_ashi_pxt_13mq.px",
        };

        const newState = { ...defaultState, latest: dummy };
        const state = periodicRentAdjustmentPriceIndexReducer(
          {},
          receivePeriodicRentAdjustmentPriceIndex(dummy),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching vats", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = periodicRentAdjustmentPriceIndexReducer(
          {},
          fetchPeriodicRentAdjustmentPriceIndex(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...defaultState };
        let state = periodicRentAdjustmentPriceIndexReducer(
          {},
          fetchPeriodicRentAdjustmentPriceIndex(),
        );
        state = periodicRentAdjustmentPriceIndexReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
