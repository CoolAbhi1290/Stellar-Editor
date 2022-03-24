import * as Partition from 'components/Partitions';
import * as PropertiesExplorer from 'components/PropertiesExplorer';
import * as SideBar from 'components/SideBar';
import useUnitInputController from 'hooks/useUnitInputController';
import produce from 'immer';
import { getPart, mutateBlueprint } from 'interfaces/blueprint';
import { getPartClass } from 'interfaces/part';
import { useRef } from 'react';
import blueprintStore from 'stores/blueprint';
import settingsStore, { SettingsStore } from 'stores/settings';
import { AnyPartName, PartIDs } from 'types/Parts';
import comparePartOrders from 'utilities/comparePartOrders';
import TransformationProperties from './components/TransformationProperties';
import styles from './index.module.scss';

const RightSideBar = () => {
  const initialBlueprintStore = blueprintStore.getState();
  const partition = settingsStore(
    (state) => state.layout.rightSideBar.partition,
  );
  const selections = blueprintStore(
    (state) => state.selections,
    comparePartOrders,
  );
  const selectionsLength = blueprintStore((state) => state.selections.length);
  const isPartitionProperties = partition === 'properties';
  const isPartitionInspect = partition === 'inspect';
  const centerInputRef = useRef<HTMLInputElement>(null);
  const offsetXInputRef = useRef<HTMLInputElement>(null);
  const offsetYInputRef = useRef<HTMLInputElement>(null);

  useUnitInputController(centerInputRef, initialBlueprintStore.center, {
    onChange: (value) => {
      mutateBlueprint((draft) => {
        draft.center = value;
      });
    },
    focusOnParentClick: true,
    suffix: 'm',
  });
  useUnitInputController(offsetXInputRef, initialBlueprintStore.offset.x, {
    onChange: (value) => {
      mutateBlueprint((draft) => {
        draft.offset.x = value;
      });
    },
    focusOnParentClick: true,
    suffix: 'm',
  });
  useUnitInputController(offsetYInputRef, initialBlueprintStore.offset.y, {
    onChange: (value) => {
      mutateBlueprint((draft) => {
        draft.offset.y = value;
      });
    },
    focusOnParentClick: true,
    suffix: 'm',
  });

  const handlePropertiesClick = () =>
    settingsStore.setState(
      produce((draft: SettingsStore) => {
        draft.layout.rightSideBar.partition = 'properties';
      }),
    );
  const handleInspectClick = () =>
    settingsStore.setState(
      produce((draft: SettingsStore) => {
        draft.layout.rightSideBar.partition = 'inspect';
      }),
    );

  const selectionsByPartNames: Map<AnyPartName, PartIDs> = new Map();
  selections.forEach((selection) => {
    const part = getPart(selection);

    if (part) {
      if (selectionsByPartNames.has(part.n)) {
        selectionsByPartNames.get(part.n)?.push(selection);
      } else {
        selectionsByPartNames.set(part.n, [selection]);
      }
    }
  });
  let partsWithTransformations: PartIDs = [];
  let selectedPartNames: AnyPartName[] = Array.from(
    selectionsByPartNames.keys(),
  ).sort();
  let propertyItems: JSX.Element[] = [];
  selectedPartNames.forEach((partName) => {
    const IDs = selectionsByPartNames.get(partName)!;
    const partClass = getPartClass(partName);

    if (partClass.hasTransformations) partsWithTransformations.push(...IDs);

    if (partClass.PropertyComponent)
      propertyItems.push(
        <partClass.PropertyComponent key={`type-${partName}`} IDs={IDs} />,
      );
  });

  if (partsWithTransformations.length > 0) {
    propertyItems.unshift(
      <TransformationProperties
        key="type-transformations"
        IDs={partsWithTransformations}
      />,
    );
  }

  return (
    <SideBar.Container className={styles['right-side-bar']} width="minor">
      <Partition.Container>
        <Partition.Option
          selected={isPartitionProperties}
          onClick={handlePropertiesClick}
        >
          Properties
        </Partition.Option>
        <Partition.Separator />
        <Partition.Option
          selected={isPartitionInspect}
          onClick={handleInspectClick}
        >
          Inspect
        </Partition.Option>
      </Partition.Container>
      <SideBar.Scrollable
        style={{
          display: isPartitionProperties ? undefined : 'none',
        }}
      >
        <PropertiesExplorer.Container>
          {selectionsLength > 0 ? (
            propertyItems
          ) : (
            <PropertiesExplorer.Group>
              <PropertiesExplorer.Title>Canvas</PropertiesExplorer.Title>
              <PropertiesExplorer.Row>
                <PropertiesExplorer.NamedInput ref={centerInputRef} label="C" />
                <PropertiesExplorer.NamedInput
                  ref={offsetXInputRef}
                  label="X"
                />
                <PropertiesExplorer.NamedInput
                  ref={offsetYInputRef}
                  label="Y"
                />
              </PropertiesExplorer.Row>
            </PropertiesExplorer.Group>
          )}
        </PropertiesExplorer.Container>
      </SideBar.Scrollable>
      <SideBar.Scrollable
        style={{
          display: isPartitionInspect ? undefined : 'none',
        }}
      >
        <span
          style={{
            color: 'white',
            display: 'block',
            padding: 'auto',
            paddingTop: '16px',
            textAlign: 'center',
          }}
        >
          Inspect coming soon!
        </span>
      </SideBar.Scrollable>
    </SideBar.Container>
  );
};
export default RightSideBar;
