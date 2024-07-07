import { IHoleSettings } from "../shapes/shapes";

// export {
//   IBalconySettings,
//   IBalconyDoorSettings,
//   IAwningSettings,
//   IPlantSettings,
//   IHoleSettings,
//   IHangingLightsSettings
// } from "../shapes/shapes";


export interface IHouseSide {
  start?: THREE.Vector3;
  end?: THREE.Vector3;
  shift?: THREE.Vector3;
  width?: number;
  angle?: number;
  combinedAngle?: number;
  holes?: IHoleSettings[];
}

export interface IHouseFloor {
  height: number;
  y?: number;
  floor?: boolean;
  materials: any;
  sides: IHouseSide[];
  // ground?: any[];
}

export interface IRoof {
  width: number; // The width of the roof
  depth: number; // The depth of the roof, for non-circular roofs
  height: number; // The height of the roof from its base to its peak
  slope?: number; // The slope of the roof, useful for pitched roofs
  material: any; // The material of the roof
  position?: {
    x: number;
    y: number;
    z: number;
  }; // Optional position, if you want to override automatic placement
}

export interface IHouse {
  floors: IHouseFloor[];
  roof: IRoof;
  wallthickness: number;
}
