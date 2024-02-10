import React from 'react'
import dynamic from 'next/dynamic'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

import categoriesConfig from '@/categoriesConfig.json'

const ItemList = dynamic(() => import('../components/itemlist'), {
  ssr: false,
  loading: () => <div className="text-black/80 dark:text-white/80">LOADING</div>,
})

export default async function Home() {
  const categoriesData = {}
  for (const category in categoriesConfig) {
    const types = Object.keys(categoriesConfig[category])
    categoriesData[category] = await getItems(category, types)
  }

  return (
    <main className="min-h-screen flex flex-col gap-16 lg:gap-24 mx-auto py-32 lg:py-48 px-8 lg:px-6 lg:max-w-xl">
      {Object.entries(categoriesData).map(([category, items]) => {
        const defaultTab = Object.keys(categoriesConfig[category])[0]

        return (
          <div key={category}>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="bg-transparent text-black/40">
                <div>
                  {Object.entries(categoriesConfig[category]).map(
                    ([type, title]) => (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="font-bold text-base"
                      >
                        {title.toString()}
                      </TabsTrigger>
                    ),
                  )}
                </div>
              </TabsList>
              {Object.entries(categoriesConfig[category]).map(([type]) => (
                <TabsContent key={type} value={type}>
                  <Card className="border-none shadow-xl rounded-2xl lg:rounded-3xl">
                    <CardContent className="!p-6 lg:!p-8 lg:!pr-[26px]">
                      <ItemList
                        items={
                          items[type + category.charAt(0) + category.slice(1)]
                        }
                      />
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
