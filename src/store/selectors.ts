import { createSelector } from "reselect";
import { RootState } from ".";

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
