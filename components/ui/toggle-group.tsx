import { Icon } from '@/components/ui/icon';
import { TextClassContext } from '@/components/ui/text';
import { toggleVariants } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import * as ToggleGroupPrimitive from '@rn-primitives/toggle-group';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform } from 'react-native';

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants> | null>(null);

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupPrimitive.RootProps &
  VariantProps<typeof toggleVariants> &
  React.RefAttributes<ToggleGroupPrimitive.RootRef>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        'flex flex-row items-center rounded-md shadow-none',
        Platform.select({ web: 'w-fit' }),
        variant === 'outline' && 'shadow-sm shadow-black/5',
        className
      )}
      {...props}>
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function useToggleGroupContext() {
  const context = React.useContext(ToggleGroupContext);
  if (context === null) {
    throw new Error(
      'ToggleGroup compound components cannot be rendered outside the ToggleGroup component'
    );
  }
  return context;
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  isFirst,
  isLast,
  ...props
}: ToggleGroupPrimitive.ItemProps &
  VariantProps<typeof toggleVariants> &
  React.RefAttributes<ToggleGroupPrimitive.ItemRef> & {
    isFirst?: boolean;
    isLast?: boolean;
  }) {
  const context = useToggleGroupContext();
  const { value } = ToggleGroupPrimitive.useRootContext();
  const currentVariant = context.variant || variant;
  const isSelected = ToggleGroupPrimitive.utils.getIsSelected(value, props.value);
  const isDepthVariant = currentVariant === 'depth';

  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm font-medium',
        isDepthVariant
          ? isSelected
            ? 'text-white'
            : 'text-ink'
          : 'text-foreground',
          !isDepthVariant &&
          (isSelected
            ? 'text-accent-foreground'
            : Platform.select({ web: 'group-hover:text-muted-foreground' }))
      )}>
      <ToggleGroupPrimitive.Item
        className={cn(
          toggleVariants({
            variant: currentVariant,
            size: context.size || size,
          }),
          props.disabled && 'opacity-50',
          !isDepthVariant && isSelected && 'bg-accent',
          isDepthVariant &&
            (isSelected
              ? 'bg-green-50 border-garden-green translate-y-0.5'
              : 'bg-white border-border'),
          'min-w-0 shrink-0 rounded-none shadow-none',
          isFirst && 'rounded-l-md',
          isLast && 'rounded-r-md',
          currentVariant === 'outline' && 'border-l-0',
          currentVariant === 'outline' && isFirst && 'border-l',
          Platform.select({
            web: 'flex-1 focus:z-10 focus-visible:z-10',
          }),
          className
        )}
        {...props}>
        {children}
      </ToggleGroupPrimitive.Item>
    </TextClassContext.Provider>
  );
}

function ToggleGroupIcon({ className, ...props }: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext);
  return <Icon className={cn('size-4 shrink-0', textClass, className)} {...props} />;
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem };
