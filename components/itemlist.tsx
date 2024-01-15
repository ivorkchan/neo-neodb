'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

import { FiArrowUpRight } from 'react-icons/fi'

import useClientSideMediaQuery from '@/hooks/use-media-query'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

export default function ItemList({ items, imageAspectRatio = 2 / 3 }) {
  const isDesktop = useClientSideMediaQuery('(min-width: 768px)')
  const scrollContainer = useRef(null)

  useEffect(() => {
    if (isDesktop) {
      const handleWheel = (event) => {
        if (scrollContainer.current && event.deltaY !== 0) {
          event.preventDefault()
          scrollContainer.current.scrollLeft += event.deltaY
        }
      }

      const currentContainer = scrollContainer.current
      if (currentContainer) {
        currentContainer.addEventListener('wheel', handleWheel, {
          passive: false,
        })
      }

      return () => {
        if (currentContainer)
          currentContainer.removeEventListener('wheel', handleWheel)
      }
    }
  }, [isDesktop])

  const renderItems = () => {
    return items.map((item, index) =>
      isDesktop
        ? (
          <Dialog key={index}>
            <DialogTrigger>
              <div className="w-[80px]">
                <AspectRatio ratio={imageAspectRatio}>
                  <Image
                    src={item.item.cover_image_url}
                    alt={
                    item.item.display_title
                      ? item.item.display_title
                      : item.item.title
                  }
                    fill
                    className="rounded-md object-cover grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 group-hover:shadow-md transition duration-300"
                    loading="lazy"
                  />
                </AspectRatio>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{item.item.title}</DialogTitle>
                <DialogDescription className="truncate-multiline">
                  {item.item.brief ? item.item.brief : 'No description.'}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
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
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )
        : (
          <Drawer key={index}>
            <DrawerTrigger>
              <div className="w-[60px]">
                <AspectRatio ratio={imageAspectRatio}>
                  <Image
                    src={item.item.cover_image_url}
                    alt={
                    item.item.display_title
                      ? item.item.display_title
                      : item.item.title
                  }
                    fill
                    className="rounded-md object-cover"
                    loading="lazy"
                  />
                </AspectRatio>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{item.item.title}</DrawerTitle>
                <DrawerDescription className="truncate-multiline">
                  {item.item.brief ? item.item.brief : 'No description.'}
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
          ),
    )
  }

  return (
    <div
      ref={scrollContainer}
      className="myscroll grid grid-rows-2 grid-flow-col justify-start gap-4 lg:gap-6 lg:pb-[9px] overflow-x-scroll"
    >
      {renderItems()}
    </div>
  )
}
