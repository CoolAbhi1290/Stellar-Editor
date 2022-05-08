import useBoundingBoxes from 'hooks/useBoundingBoxes';
import { Vector2 } from 'three';

export const getIntersectingPart = (point: Vector2) => {
  for (const [ID, boundingBox] of useBoundingBoxes.getState()) {
    if (
      boundingBox.min.x <= point.x &&
      boundingBox.max.x >= point.x &&
      boundingBox.min.y <= point.y &&
      boundingBox.max.y >= point.y
    ) {
      return ID;
    }
  }

  return null;
};
