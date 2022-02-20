import { AnyPart, AnyVanillaPart, UUID } from 'types/Parts';

export interface VanillaBlueprint {
  center: number;
  offset: { x: number; y: number };
  parts: AnyVanillaPart[];
  stages: { partIndexes: number[] }[]; // TODO: isolate this type
}

export interface Blueprint extends Omit<VanillaBlueprint, 'parts'> {
  meta: {
    format_version: number;
  };

  parts: PartsMap;
}

export type PartAddress = UUID[];

export type PartsMap = Map<UUID, AnyPart>;
