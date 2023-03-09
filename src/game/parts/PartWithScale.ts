import { invalidate } from '@react-three/fiber';
import declareBoundsUpdated from 'core/bounds/declareBoundsUpdated';
import getPart from 'core/part/getPart';
import { PartResizeEventDetail } from 'core/part/resizeAsync';
import { PartScaleEventDetail } from 'core/part/scaleSelectedAsync';
import usePartProperty from 'hooks/usePartProperty';
import { RefObject, useEffect } from 'react';
import useBlueprint from 'stores/blueprint';
import boundsStore from 'stores/bounds';
import { Object3D, Vector3 } from 'three';
import moduloAngle from 'utilities/moduloAngle';
import { Part, PartData, VanillaPart, VanillaPartData } from './Part';
import { PartWithOrientation } from './PartWithOrientation';
import { PartWithTransformations } from './PartWithTransformations';

export interface VanillaPartWithScale extends VanillaPart {
  /**
   * Scale of the part on both `x` and `y` axis
   */
  o: { x: number; y: number };
}

export interface PartWithScale extends Part, VanillaPartWithScale {}

export const VanillaPartWithScaleData: VanillaPartWithScale = {
  ...VanillaPartData,

  o: { x: 1, y: 1 },
};

export const PartWithScaleData: PartWithScale = {
  ...PartData,
  ...VanillaPartWithScaleData,

  label: 'Unlabeled Part With Scale',
};

function rotationLighting(flipLight: boolean, rotation: number) {
  if (flipLight) return moduloAngle(rotation) >= 180 ? -1 : 1;
  return 1;
}
function scaleLighting(flipLight: boolean, scale: number) {
  return flipLight ? Math.abs(scale) : scale;
}

export const usePartWithScale = (
  id: string,
  object: RefObject<Object3D>,
  flipLighting = true,
) => {
  const scale = new Vector3();
  let rotation = getPart<PartWithOrientation>(id).o.z;

  const handlePartScale = (event: CustomEvent<PartScaleEventDetail>) => {
    if (object.current && getPart(id)?.selected) {
      object.current.scale.multiply(
        scale.set(event.detail.x, event.detail.y, 1),
      );
      invalidate();
    }
  };

  const handlePartResize = (event: CustomEvent<PartResizeEventDetail>) => {
    const part = useBlueprint.getState().parts[id] as PartWithScale;

    if (object.current) {
      object.current.scale.set(
        part.o.x *
          scaleLighting(flipLighting, event.detail.normalizedScale[0]) *
          rotationLighting(flipLighting, rotation),
        part.o.y * event.detail.normalizedScale[1],
        object.current.scale.z,
      );
    }
  };

  useEffect(() => {
    window.addEventListener('partscale', handlePartScale as EventListener);
    window.addEventListener(
      `partresize${id}`,
      handlePartResize as EventListener,
    );

    return () => {
      window.removeEventListener('partscale', handlePartScale as EventListener);
      window.removeEventListener(
        `partresize${id}`,
        handlePartResize as EventListener,
      );
    };
  });

  usePartProperty(
    id,
    (part: PartWithTransformations) => part.o,
    (o, prevO) => {
      rotation = o.z;
      object.current?.scale.set(
        scaleLighting(flipLighting, o.x) *
          rotationLighting(flipLighting, rotation),
        o.y,
        (Math.abs(o.x) + Math.abs(o.y)) / 2,
      );
      invalidate();

      if (object.current && boundsStore[id]) {
        const { bounds } = boundsStore[id];
        const scaleX = o.x / prevO.x;
        const scaleY = o.y / prevO.y;
        const width = bounds.width * scaleX;
        const height = bounds.height * scaleY;
        const offsetX = bounds.x - object.current.position.x;
        const offsetY = bounds.y - object.current.position.y;
        const offset = Math.hypot(offsetX, offsetY);
        const offsetRotation = Math.atan2(offsetY, offsetX);
        const offsetRotationSubbed = offsetRotation - bounds.rotation;
        const subbedOffsetX = offset * Math.cos(offsetRotationSubbed);
        const subbedOffsetY = offset * Math.sin(offsetRotationSubbed);
        const scaledOffsetX = subbedOffsetX * scaleX;
        const scaledOffsetY = subbedOffsetY * scaleY;
        const scaledOffset = Math.hypot(scaledOffsetX, scaledOffsetY);
        const scaledRotation = Math.atan2(scaledOffsetY, scaledOffsetX);
        const scaledRotationAdded = scaledRotation + bounds.rotation;
        const finalOffsetX = scaledOffset * Math.cos(scaledRotationAdded);
        const finalOffsetY = scaledOffset * Math.sin(scaledRotationAdded);
        const x = object.current.position.x + finalOffsetX;
        const y = object.current.position.y + finalOffsetY;

        bounds.x = x;
        bounds.y = y;
        bounds.width = width;
        bounds.height = height;

        declareBoundsUpdated(id);
      }
    },
    { equalityFn: (a, b) => a.x === b.x && a.y === b.y },
  );
};

export const registry = null;
