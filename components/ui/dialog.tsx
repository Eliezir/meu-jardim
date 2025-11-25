import { Icon } from '@/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/components/ui/native-only-animated-view';
import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@rn-primitives/dialog';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { Platform, Pressable, Text, View, type ViewProps } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';
import { cva, type VariantProps } from 'class-variance-authority';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

const dialogOverlayVariants = cva(
  'absolute bottom-0 left-0 right-0 top-0 z-50 flex bg-black/50 p-2',
  {
    variants: {
      variant: {
        default: 'items-center justify-center',
        bottom: 'justify-end',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function DialogOverlay({
  className,
  children,
  variant = 'default',
  ...props
}: Omit<DialogPrimitive.OverlayProps, 'asChild'> &
  React.RefAttributes<DialogPrimitive.OverlayRef> & {
    children?: React.ReactNode;
    variant?: 'default' | 'bottom';
  }) {
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        className={cn(
          dialogOverlayVariants({ variant }),
          Platform.select({
            web: 'fixed cursor-default animate-in fade-in-0 [&>*]:cursor-auto',
          }),
          className
        )}
        {...props}
        asChild={Platform.OS !== 'web'}>
        <NativeOnlyAnimatedView entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
          <NativeOnlyAnimatedView
            entering={FadeIn.delay(50)}
            exiting={FadeOut.duration(150)}
            className={cn('flex-1 flex', variant === 'bottom' && 'flex-col-reverse')}>
            <DialogClose asChild>
              <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </DialogClose>
            <>{children}</>
          </NativeOnlyAnimatedView>
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}
const dialogContentVariants = cva(
  'z-50 flex w-full flex-col gap-4 border border-border bg-background p-6 shadow-lg shadow-black/5',
  {
    variants: {
      variant: {
        default: 'mx-auto max-w-[calc(100%-2rem)] rounded-lg sm:max-w-lg',
        bottom: 'rounded-t-3xl',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function DialogContent({
  className,
  portalHost,
  variant = 'default',
  children,
  ...props
}: DialogPrimitive.ContentProps &
  React.RefAttributes<DialogPrimitive.ContentRef> & {
    portalHost?: string;
    variant?: 'default' | 'bottom';
  }) {
  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay variant={variant}>
        <DialogPrimitive.Content
          className={cn(
            dialogContentVariants({ variant }),
            Platform.select({
              web: 'duration-200 animate-in fade-in-0 zoom-in-95',
            }),
            className
          )}
          {...props}>
          <>{children}</>

          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 rounded opacity-70 active:opacity-100',
              Platform.select({
                web: 'ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=open]:bg-accent',
              })
            )}
            hitSlop={12}>
            <Icon
              as={X}
              className={cn('size-4 shrink-0 text-accent-foreground web:pointer-events-none')}
            />
            <Text className="sr-only">Close</Text>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ViewProps) {
  return (
    <View className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.TitleProps & React.RefAttributes<DialogPrimitive.TitleRef>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-semibold leading-none text-foreground', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.DescriptionProps & React.RefAttributes<DialogPrimitive.DescriptionRef>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
