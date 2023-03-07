import * as PropertiesPrimitive from 'components/Properties';
import * as Sidebar from 'components/Sidebar';
import getPart from 'core/part/getPart';
import { DockingPortProperties } from 'game/parts/DockingPort';
import { FuelTankProperties } from 'game/parts/FuelTank';
import { HeatShieldProperties } from 'game/parts/HeatShield';
import { Part } from 'game/parts/Part';
import {
  PartWithEngine,
  PartWithEngineProperties,
} from 'game/parts/PartWithEngine';
import {
  PartWithParachute,
  PartWithParachuteProperties,
} from 'game/parts/PartWithParachute';
import {
  PartWithTransformations,
  PartWithTransformationsProperties,
} from 'game/parts/PartWithTransformations';
import { ReferenceImageProperties } from 'game/parts/ReferenceImage';
import useTranslator from 'hooks/useTranslator';
import { FC } from 'react';
import useBlueprint from 'stores/blueprint';
import { PartPropertyComponentProps } from 'types/Parts';

interface GroupedProperties {
  test: (part: Part) => boolean;
  Component: FC<PartPropertyComponentProps>;
}

function testProperties<Type extends Part>(
  lister: (state: Type) => (unknown | undefined)[],
) {
  return (state: Part) =>
    !lister(state as Type).some((item) => item === undefined);
}
function testName(name: string) {
  return (state: Part) => state.n === name;
}

const groupedProperties: Record<string, GroupedProperties> = {
  transformations: {
    test: testProperties<PartWithTransformations>(({ p, o }) => [p, o]),
    Component: PartWithTransformationsProperties,
  },
  engine: {
    test: testProperties<PartWithEngine>(({ B }) => [B]),
    Component: PartWithEngineProperties,
  },
  parachute: {
    test: testProperties<PartWithParachute>(({ N }) => [
      N,
      N.deploy_state,
      N.animation_state,
    ]),
    Component: PartWithParachuteProperties,
  },
  fuelTank: {
    test: testName('Fuel Tank'),
    Component: FuelTankProperties,
  },
  referenceImage: {
    test: testName('Reference Image'),
    Component: ReferenceImageProperties,
  },
  heatShield: {
    test: testName('Heat Shield'),
    Component: HeatShieldProperties,
  },
  dockingPort: {
    test: testName('Docking Port'),
    Component: DockingPortProperties,
  },
};

export default function Properties() {
  const { t } = useTranslator();
  const hasNoSelections = useBlueprint(
    (state) => state.selections.length === 0,
  );
  const selections = useBlueprint((state) => state.selections);
  const typeSortedParts: Record<string, string[]> = {};
  const children: JSX.Element[] = [];

  Object.keys(groupedProperties).forEach((groupedPropertyId) => {
    const { test } = groupedProperties[groupedPropertyId];

    selections.forEach((selection) => {
      const part = getPart(selection);

      if (test(part)) {
        if (typeSortedParts[groupedPropertyId]) {
          typeSortedParts[groupedPropertyId].push(selection);
        } else {
          typeSortedParts[groupedPropertyId] = [selection];
        }
      }
    });
  });

  Object.keys(typeSortedParts).forEach((index) => {
    const ids = typeSortedParts[index];
    const { Component } = groupedProperties[index];

    children.push(
      <Component ids={ids} key={`type-sorted-properties-explorer-${index}`} />,
    );
  });

  if (hasNoSelections) {
    return (
      <Sidebar.MessageContainer>
        <Sidebar.Message>{t`tabs.layout.right_sidebar.properties.no_selection`}</Sidebar.Message>
        <Sidebar.Message subMessage>
          {t`tabs.layout.right_sidebar.properties.no_selection.instructions`}
        </Sidebar.Message>
      </Sidebar.MessageContainer>
    );
  }
  if (children.length > 0) {
    return <PropertiesPrimitive.Root>{children}</PropertiesPrimitive.Root>;
  }
  return (
    <Sidebar.MessageContainer>
      <Sidebar.Message>{t`tabs.layout.right_sidebar.properties.no_properties`}</Sidebar.Message>
      <Sidebar.Message subMessage>
        {t`tabs.layout.right_sidebar.properties.no_properties.instructions`}
      </Sidebar.Message>
    </Sidebar.MessageContainer>
  );
}
