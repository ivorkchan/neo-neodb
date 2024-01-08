'use client'

import React, { useRef } from 'react'
import Image from 'next/image'

import { FiArrowUpRight } from 'react-icons/fi'

import useClientSideMediaQuery from '@/hooks/use-media-query'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

export default function ItemList({ items, imageAspectRatio = 2 / 3 }) {
  const isDesktop = useClientSideMediaQuery('(min-width: 768px)')
  const scrollContainer = useRef(null)

  const renderItems = () => {
    return items.map((item, index) =>
      isDesktop
        ? (
          <Dialog key={index}>
            <DialogTrigger>
              <div className="group w-[80px] flex flex-col items-center">
                <AspectRatio ratio={imageAspectRatio}>
                  <Image src={item.item.cover_image_url} alt={item.item.display_title ? item.item.display_title : item.item.title} fill className="rounded-md object-cover shadow-md" />
                </AspectRatio>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-2">{item.item.title}</DialogTitle>
                <DialogDescription className="truncate-multiline">{item.item.brief ? item.item.brief : 'No description.'}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <a href={`https://neodb.social${item.item.url}`} target="_blank" rel="noopener noreferrer">
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
              <div className="group w-[60px] flex flex-col items-center">
                <AspectRatio ratio={imageAspectRatio}>
                  <Image src={item.item.cover_image_url} alt={item.item.display_title ? item.item.display_title : item.item.title} fill className="rounded-md object-cover shadow-md" />
                </AspectRatio>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="mb-2">{item.item.title}</DrawerTitle>
                <DrawerDescription className="truncate-multiline">{item.item.brief ? item.item.brief : 'No description.'}</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <a href={`https://neodb.social${item.item.url}`} target="_blank" rel="noopener noreferrer">
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
    <div ref={scrollContainer} className="myscroll grid grid-rows-2 grid-flow-col justify-start gap-6 py-6 overflow-x-scroll">
      {renderItems()}
    </div>
  )
}
