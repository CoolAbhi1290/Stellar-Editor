import { LAYER } from 'components/Canvas/constants/layer';
import HeadsUpDisplay from 'components/HeadsUpDisplay';
import useBlueprint from 'hooks/useBlueprint';
import { PartBound } from './components/PartBound';
import { SelectionOutline } from './components/SelectionOutline';

export const PartBounds = () => {
  const selections = useBlueprint((state) => state.selections);
  const partBounds = selections.map((id) => (
    <PartBound key={`part-bound-${id}`} id={id} />
  ));

  return (
    <HeadsUpDisplay priority={LAYER.TOOL}>
      {partBounds}
      <SelectionOutline />
    </HeadsUpDisplay>
  );
};

export * from './components/PartBound';
