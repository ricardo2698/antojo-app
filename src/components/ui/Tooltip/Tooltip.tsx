'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export function Tooltip({ content, children, side = 'top', delayDuration = 300 }: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          style={{
            background: '#1B1512',
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 8,
            padding: '5px 10px',
            boxShadow: '0 4px 16px -4px rgba(27,21,18,.35)',
            userSelect: 'none',
            animationDuration: '150ms',
          }}
        >
          {content}
          <RadixTooltip.Arrow style={{ fill: '#1B1512' }} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
