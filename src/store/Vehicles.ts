import { Vehicle } from "../models/vehicle";
import { typedAction } from "./actions";

export interface VehiclesState {
  vehicles: Vehicle[];
}

const initialState: VehiclesState = {
  vehicles: [],
};

export const setVehicles = (vehicles: Vehicle[]) => {
  return typedAction("vehicles/SET", vehicles);
};

export const setVehicle = (vehicle: Vehicle) => {
  return typedAction("vehicles/SET_VEHICLE", vehicle);
};

type VehiclesAction = ReturnType<typeof setVehicles | typeof setVehicle>;

export function vehiclesReducer(
  state = initialState,
  action: VehiclesAction
): VehiclesState {
  switch (action.type) {
    case "vehicles/SET":
      return {
        ...state,
        vehicles: action.payload,
      };
    case "vehicles/SET_VEHICLE":
      return {
        ...state,
        vehicles: [
          ...state.vehicles.filter((v) => v.docRef !== action.payload.docRef),
          action.payload,
        ],
      };
    default:
      return state;
  }
}
