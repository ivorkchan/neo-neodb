'use client'

import React, { useEffect, useRef } from 'react'

import { ArrowTopRightIcon } from '@radix-ui/react-icons'

import useClientSideMediaQuery from '@/hooks/use-media-query'

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

export default function ItemList({ items }) {
  const isDesktop = useClientSideMediaQuery('(min-width: 768px)')
  const scrollContainer = useRef(null)

  useEffect(() => {
    if (isDesktop) {
      const handleWheel = (event) => {
        if (scrollContainer.current && event.deltaY !== 0) {
          event.preventDefault()
          scrollContainer.current.scrollTop += event.deltaY
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
              <div className="text-left truncate">
                {item.item.display_title}
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
                    <ArrowTopRightIcon />
                  </Button>
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )
        : (
          <Drawer key={index}>
            <DrawerTrigger>
              <div className="text-left text-sm truncate">
                {item.item.display_title}
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{item.item.title}</DrawerTitle>
                <DrawerDescription className="truncate-multiline text-left">
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
                    <ArrowTopRightIcon />
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
      className="myscroll h-[200px] lg:h-[264px] flex flex-col justify-start gap-4 lg:gap-6 overflow-y-scroll"
    >
      {renderItems()}
    </div>
  )
}
