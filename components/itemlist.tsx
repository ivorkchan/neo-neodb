'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'

import { FiArrowUpRight } from 'react-icons/fi'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ItemList({ items, imageAspectRatio = 2 / 3 }) {
  const scrollContainer = useRef(null)

  const handleWheel = useCallback((event) => {
    event.preventDefault()
    if (scrollContainer.current)
      scrollContainer.current.scrollLeft += event.deltaY
  }, [])

  useEffect(() => {
    const currentContainer = scrollContainer.current
    if (currentContainer)
      currentContainer.addEventListener('wheel', handleWheel)

    return () => {
      if (currentContainer)
        currentContainer.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  return (
    <div
      ref={scrollContainer}
      className="myscroll grid grid-rows-2 grid-flow-col justify-start gap-6 py-6 overflow-x-scroll"
    >
      {items.map((item, index) => (
        <Drawer key={index}>
          <DrawerTrigger>
            <div className="group w-[60px] md:w-[80px] flex flex-col items-center">
              <AspectRatio ratio={imageAspectRatio}>
                <Image
                  src={item.item.cover_image_url}
                  alt={
                    item.item.display_title
                      ? item.item.display_title
                      : item.item.title
                  }
                  fill
                  className="rounded-md object-cover shadow-md"
                />
              </AspectRatio>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="mb-2">{item.item.title}</DrawerTitle>
              <DrawerDescription>
                <ScrollArea className="max-h-[320px] text-ellipsis">
                  {item.item.brief ? item.item.brief : 'No description.'}
                </ScrollArea>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <a
                href={`https://neodb.social${item.item.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <span className="mr-2">View on NeoDB</span>
                  <FiArrowUpRight />
                </Button>
              </a>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}
