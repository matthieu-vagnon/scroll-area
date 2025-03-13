'use client'

import { cn } from '@/lib/utils'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    title?: string
    scrollIndicator?: boolean
    padding?: number
  }
>(({ title, scrollIndicator, padding, className, children, ...props }) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  const [scrollBottom, setScrollBottom] = React.useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    setScrollTop(scrollRef?.current?.scrollTop ?? 0)
    setScrollBottom(
      (scrollRef?.current?.scrollHeight ?? 0) -
        (scrollRef?.current?.scrollTop ?? 0) -
        (scrollRef?.current?.clientHeight ?? 0)
    )
  }, [scrollRef])

  useEffect(() => {
    const currentScroll = scrollRef.current

    handleScroll()

    currentScroll?.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      currentScroll?.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    handleScroll()
  }, [scrollRef.current?.scrollHeight, handleScroll])

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {title && (
        <p
          className={cn(
            'text-2xl font-bold mb-4 transition-all duration-200 text-center',
            padding && `pl-${padding} pr-${padding}`,
            scrollTop <= 0 && !scrollIndicator ? 'w-full' : 'w-0'
          )}
        >
          {title}
        </p>
      )}
      <ScrollAreaPrimitive.Root
        className={cn(
          'flex h-full flex-row md:flex-col overflow-hidden relative border-t border-b border-gray-200 transition-all duration-150',
          scrollTop <= 0 && !scrollIndicator && 'border-t-transparent',
          scrollBottom <= 0 && !scrollIndicator && 'border-b-transparent'
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={scrollRef}
          className={cn('h-full w-full rounded-[inherit] [&>div]:!block', padding && `pl-${padding} pr-${padding}`)}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar padding={padding} />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </div>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    padding?: number
  }
>(({ className, orientation = 'vertical', padding, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors z-50',
      orientation === 'vertical' && 'h-full w-1.5 border-l border-l-transparent translate-x-1/2',
      orientation === 'vertical' && padding && `mr-${padding / 2}`,
      orientation === 'horizontal' && 'h-1.5 flex-col border-t border-t-transparent translate-y-1/2',
      orientation === 'horizontal' && padding && `mb-${padding / 2}`,
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className='relative flex-1 rounded-full bg-border' />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
