import {
  EyeClosedIcon,
  EyeOpenIcon,
  LockClosedIcon,
  LockOpen1Icon,
  TrashIcon,
  TriangleDownIcon,
  TriangleRightIcon,
} from '@radix-ui/react-icons';
import deleteParts from 'core/part/deleteParts';
import getPartRegistry from 'core/part/getPartRegistry';
import mutateParts from 'core/part/mutateParts';
import selectConcurrent from 'core/part/selectConcurrent';
import toggleLocked from 'core/part/toggleLocked';
import toggleSelection from 'core/part/toggleSelection';
import toggleVisible from 'core/part/toggleVisible';
import { Group } from 'game/parts/Group';
import { Part } from 'game/parts/Part';
import { useInputEscape } from 'hooks/useInputEscape';
import usePart from 'hooks/usePart';
import usePartProperty from 'hooks/usePartProperty';
import {
  KeyboardEvent, memo, MouseEvent, PointerEvent, useRef,
} from 'react';
import { styled, theme } from 'stitches.config';
import { PartRegistryItem } from 'stores/partRegistry';
import { Root } from './Root';

export interface ListingProps {
  id: string;
  indent: number;
}

const StyledDetails = styled('details', {});
const StyledSummary = styled('summary', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  listStyle: 'none',
  cursor: 'pointer',

  variants: {
    selected: {
      true: {
        backgroundColor: theme.colors.componentBackgroundActive,
      },

      false: {
        backgroundColor: theme.colors.componentBackground,

        '&:hover': {
          backgroundColor: theme.colors.componentBackgroundHover,
        },
        '&:active': {
          backgroundColor: theme.colors.componentBackgroundActive,
        },
      },
    },
  },

  '&::-webkit-details-marker': {
    display: 'none',
  },
});
const Label = styled('input', {
  color: theme.colors.textHighContrast,
  fontSize: theme.sizes[12],
  flex: 1,
  cursor: 'pointer',
  minWidth: 0,

  '&:focus': {
    cursor: 'text',
  },
});
const IconHolder = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space.padding,
  color: theme.colors.textHighContrast,
  cursor: 'pointer',
});
const Action = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space.padding,
  cursor: 'pointer',
  color: theme.colors.textHighContrast,

  variants: {
    onlyShowOnHover: {
      true: {
        [`${StyledSummary}:not(:hover) &`]: {
          display: 'none',
        },
      },
      false: {
        color: theme.colors.textLowContrast,

        [`${StyledSummary}:hover &`]: {
          color: theme.colors.textHighContrast,
        },
      },
    },
  },

  defaultVariants: { onlyShowOnHover: true },
});

export const Item = memo(
  ({ id, indent }: ListingProps) => {
    const label = useRef<HTMLInputElement>(null);
    const state = usePart(id);
    const isGroup = state.n === 'Group';
    const expanded = isGroup ? (state as Group).expanded : false;
    const { Icon } = getPartRegistry(state.n) as PartRegistryItem<Part>;
    let lastLabel = state.label;

    usePartProperty(
      id,
      (sliceableState) => sliceableState.label,
      (newLabel) => {
        if (label.current) label.current.value = newLabel;
      },
    );

    const handleSummaryClick = (event: MouseEvent) => {
      if (event.ctrlKey) {
        if (event.shiftKey) {
          // TODO: ctrl + shift
        } else {
          toggleSelection(id);
        }
      } else if (event.shiftKey) {
        // TODO: shift
      } else {
        selectConcurrent(id);
      }
    };
    const handleSummaryDoubleClick = () => {
      label.current?.focus();
      label.current?.select();
    };
    const handleIconClick = (event: MouseEvent) => {
      if (isGroup && !event.ctrlKey && !event.shiftKey) {
        event.stopPropagation();
        mutateParts<Group>(id, (draft) => {
          draft.expanded = !draft.expanded;
        });
      }
    };
    const handleEyeClick = (event: MouseEvent) => {
      event.stopPropagation();
      toggleVisible(id);
    };
    const handleLockClick = (event: MouseEvent) => {
      event.stopPropagation();
      toggleLocked(id);
    };
    const handleTrashClick = (event: MouseEvent) => {
      event.stopPropagation();
      deleteParts(id);
    };
    const handleLabelKeyDown = useInputEscape();
    const handleLabelKeyUp = (event: KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();
    };
    const handleLabelBlur = () => {
      if (label.current) {
        const newLabel = label.current.value.trim();

        if (newLabel.length > 0) {
          if (newLabel !== lastLabel) {
            label.current.value = newLabel;
            lastLabel = newLabel;

            mutateParts(id, (draft) => {
              draft.label = newLabel;
            });
          } else {
            label.current.value = lastLabel;
          }
        } else {
          label.current.value = state.label;
          lastLabel = state.label;

          mutateParts(id, (draft) => {
            draft.label = state.label;
          });
        }
      }
    };
    const handleLabelPointerDown = (event: PointerEvent) => event.preventDefault();

    return (
      <StyledDetails>
        <StyledSummary
          css={{ paddingLeft: `calc(${theme.space.padding} * ${indent})` }}
          selected={state.selected}
          onClick={handleSummaryClick}
          onDoubleClick={handleSummaryDoubleClick}
        >
          <IconHolder onClick={handleIconClick}>
            {!isGroup && <Icon />}
            {isGroup
              && (expanded ? <TriangleDownIcon /> : <TriangleRightIcon />)}
          </IconHolder>

          <Label
            ref={label}
            onKeyUp={handleLabelKeyUp}
            onKeyDown={handleLabelKeyDown}
            onBlur={handleLabelBlur}
            onPointerDown={handleLabelPointerDown}
            defaultValue={state.label}
          />

          <Action onClick={handleEyeClick} onlyShowOnHover={state.visible}>
            {state.visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </Action>
          <Action onClick={handleLockClick} onlyShowOnHover={!state.locked}>
            {state.locked ? <LockClosedIcon /> : <LockOpen1Icon />}
          </Action>
          <Action onClick={handleTrashClick}>
            <TrashIcon />
          </Action>
        </StyledSummary>

        {isGroup && <Root indent={indent + 1} parentId={id} />}
      </StyledDetails>
    );
  },
  ({ id: prevId }, { id: nextId }) => prevId === nextId,
);
