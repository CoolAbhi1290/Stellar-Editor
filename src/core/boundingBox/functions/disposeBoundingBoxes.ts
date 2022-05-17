import { Blueprint } from 'game/Blueprint';
import { UUID } from 'types/Parts';

export const disposeBoundingBoxes = (IDs: UUID[], state: Blueprint) => {
  IDs.forEach((ID) => {
    delete state.boundingBoxes[ID];
  });
};
