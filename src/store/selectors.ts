import { createSelector } from "reselect";
import { RootState } from ".";

/*
 * Vehicle selectors
 */

const getVehicles = (state: RootState) => state.vehicles.vehicles;

export const getUpdateVehicles = createSelector([getVehicles], (vehicles) =>
  vehicles.map((v) => {
    const { docRef, manufacturer, ...vehicle } = v;

    return {
      ...vehicle,
      name: manufacturer ? `${manufacturer} ${v.name}` : v.name,
      item: docRef,
    };
  })
);

export const getVehiclesAsSearchInputOptions = createSelector(
  [getUpdateVehicles],
  (vehicles) =>
    vehicles.map((v) => ({
      label: v.name,
      value: v,
      id: v.item!.id,
    }))
);

/**
 * Mission selectors
 */

const getMissions = (state: RootState) => state.missions.missions;

export const getUpdateMissions = createSelector([getMissions], (missions) =>
  missions.map((m) => {
    const { docRef, ...mission } = m;

    return {
      ...mission,
      moneyAmount: 2,
      rpAmount: 2,
      activity: docRef,
    };
  })
);

export const getMissionsAsSearchInputOptions = createSelector(
  [getUpdateMissions],
  (missions) =>
    missions.map((m) => ({
      label: m.name,
      value: m,
      id: m.activity!.id,
    }))
);
