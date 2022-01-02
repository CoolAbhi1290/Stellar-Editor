import '@react-three/fiber';
import { ReactComponent as GroupIcon } from 'assets/icons/group.svg';
import { memo } from 'react';
import * as RootBlueprint from '../../blueprint/types/root';
import * as RootPart from './root';

export const icon = GroupIcon;

const typedParts: RootBlueprint.AnyPartTypeArray = [];
export const data = {
  '.stellar': {
    ...RootPart.data['.stellar'],
    label: 'Group',
  },

  n: 'Group' as 'Group',
  parts: typedParts,
};

export type Type = typeof data;

export const Component = memo(() => <mesh />);
