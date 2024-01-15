import React from 'react'
import dynamic from 'next/dynamic'

import { FaBilibili, FaBookOpen, FaFilm, FaRadio } from 'react-icons/fa6'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

import categoriesConfig from '@/categoriesConfig.json'

const ItemList = dynamic(() => import('../components/itemlist'), {
  ssr: false,
  loading: () => <div className="text-white/80 font-mono">LOADING</div>,
})

const categoryIcons = {
  book: <FaBookOpen className="w-6 h-6 px-1" />,
  tv: <FaBilibili className="w-6 h-6 px-1" />,
  movie: <FaFilm className="w-6 h-6 px-1" />,
  music: <FaRadio className="w-6 h-6 px-1" />,
}

export default async function Home() {
  const categoriesData = {}
  for (const category in categoriesConfig) {
    const types = Object.keys(categoriesConfig[category])
    categoriesData[category] = await getItems(category, types)
  }

  return (
    <main className="min-h-screen flex flex-col gap-16 lg:gap-24 mx-auto py-32 lg:py-48 px-4 lg:px-6 lg:max-w-4xl">
      {Object.entries(categoriesData).map(([category, items]) => {
        const defaultTab = Object.keys(categoriesConfig[category])[0]
        const IconComponent = categoryIcons[category]

        return (
          <div key={category}>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="self-end flex justify-between w-full bg-transparent font-mono text-white/40">
                <div className="text-white/40 px-3 lg:px-4 py-2 font-medium hidden lg:flex lg:gap-2">
                  {IconComponent}
                  {category.charAt(0) + category.slice(1)}
                </div>
                <div>
                  {Object.entries(categoriesConfig[category]).map(
                    ([type, title]) => (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="text-sm lg:text-base"
                      >
                        {title.toString()}
                      </TabsTrigger>
                    ),
                  )}
                </div>
              </TabsList>
              {Object.entries(categoriesConfig[category]).map(([type]) => (
                <TabsContent key={type} value={type}>
                  <Card className="group bg-transparent hover:bg-white/20 hover:backdrop-blur-sm border border-white/20 transition duration-300">
                    <CardContent className="pt-4 lg:pb-[9px]">
                      {category === 'music'
                        ? (
                          <ItemList
                            items={
                            items[type + category.charAt(0) + category.slice(1)]
                          }
                            imageAspectRatio={1 / 1}
                          />
                          )
                        : (
                          <ItemList
                            items={
                            items[type + category.charAt(0) + category.slice(1)]
                          }
                          />
                          )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )
      })}
    </main>
  )
}

async function getItems(category, types) {
  const baseApiUrl = 'https://neodb.social/api/me/shelf/'

  const items = {}

  for (const type of types) {
    const typeKey = type + category.charAt(0) + category.slice(1)
    items[typeKey] = await fetchAndMergeData([
      `${baseApiUrl}${type}?category=${category}&page=1`,
      `${baseApiUrl}${type}?category=${category}&page=2`,
    ])
  }

  return items
}

async function fetchAndMergeData(urls) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      // eslint-disable-next-line node/prefer-global/process
      Authorization: `Bearer ${process.env.NEODB_TOKEN}`,
    },
  }

  try {
    const responses = await Promise.all(urls.map(url => fetch(url, options)))
    const dataArrays = await Promise.all(responses.map(res => res.json()))
    return dataArrays
      .flat()
      .map(item => item.data)
      .flat()
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const revalidate = 3600
