import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { styled, theme } from 'stitches.config';

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  width: theme.sizes.dropdownWidth,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.sizes[8],
  gap: theme.sizes[8],
  borderRadius: theme.radii[4],
  border: theme.borderStyles.borderNonInteractive,
  backgroundColor: theme.colors.component,
});

const Arrow = styled(DropdownMenuPrimitive.Arrow, {
  fill: theme.colors.borderNonInteractive,
});

export function Content({
  children,
  ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <StyledContent {...props}>
        <Arrow />
        {children}
      </StyledContent>
    </DropdownMenuPrimitive.Portal>
  );
}
