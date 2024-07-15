'use client'

import React, { useRef } from 'react'

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

  const renderItems = () => {
    return items.map((item, index) =>
      isDesktop
        ? (
            <Dialog key={index}>
              <DialogTrigger>
                <div className="text-left truncate text-sm leading-6 hover:underline">
                  {item.item.display_title}
                </div>
              </DialogTrigger>
              <DialogContent className="!rounded-none p-8">
                <DialogHeader>
                  <DialogTitle>{item.item.title}</DialogTitle>
                  <DialogDescription className="truncate-multiline indent-[28px]">
                    {item.item.brief ? item.item.brief : 'No description.'}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <a
                    href={`https://neodb.social${item.item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="rounded-none shadow-none">
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
                <div className="text-left truncate text-sm leading-6">
                  {item.item.display_title}
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-left mt-4">
                    {item.item.title}
                  </DrawerTitle>
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
                    <Button variant="outline" className="rounded-none shadow-none">
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
    <div ref={scrollContainer} className="flex flex-col">
      {renderItems()}
    </div>
  )
}
