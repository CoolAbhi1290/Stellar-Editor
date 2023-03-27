import { ColumnSpacingIcon, RowSpacingIcon } from '@radix-ui/react-icons';
import Button from 'components/Button';
import mirrorSelectedHorizontal from 'core/part/mirrorSelectedHorizontal';
import mirrorSelectedVertical from 'core/part/mirrorSelectedVertical';
import { styled, theme } from 'stitches.config';

const Container = styled('div', {
  position: 'absolute',
  right: theme.space.paddingRegular,
  bottom: theme.space.paddingRegular,
  display: 'flex',
  gap: theme.space.gapUnrelatedRegular,
});
const Action = styled(Button, {
  borderRadius: theme.radii.regular,
  display: 'flex',
  padding: theme.space.paddingRegular,

  defaultVariants: { border: true },
});

export default function QuickControls() {
  return (
    <Container>
      <Action onClick={() => mirrorSelectedHorizontal()}>
        <ColumnSpacingIcon />
      </Action>
      <Action onClick={() => mirrorSelectedVertical()}>
        <RowSpacingIcon />
      </Action>
    </Container>
  );
}
