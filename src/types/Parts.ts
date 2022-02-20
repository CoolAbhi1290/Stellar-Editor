import { FuelTank } from 'parts/FuelTank';
import { Group } from 'parts/Group';
import { FC } from 'react';
import { PartAddress } from './Blueprint';
import DeepPartial from './DeepPartial';

export type UUID = string;

export type AnyPart = Group | FuelTank;
export type AnyVanillaPart = AnyPart & { meta: never };

export type AnyPartName = AnyVanillaPartName | 'Group';
export type AnyVanillaPartName = 'Fuel Tank';

export type AnyPartialPartType = DeepPartial<AnyPart>;
export type AnyPartialVanillaPartType = DeepPartial<AnyVanillaPart>;

export interface PartComponentProps {
  part: AnyPart;
}
export interface PropertyComponentProps {
  addresses: PartAddress[];
}
export interface ReactivePartComponentProps {
  address: PartAddress;
}

export type PartModule = {
  // meta
  isExportable: boolean;

  // UI
  Icon: FC<any>;
  PropertyComponent?: FC<PropertyComponentProps>;

  // render
  LayoutComponent: FC<ReactivePartComponentProps>;

  // miscellaneous
  data: AnyPart;
};
