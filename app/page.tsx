import React from 'react'
import dynamic from 'next/dynamic'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

import categoriesConfig from '@/categoriesConfig.json'

const ItemList = dynamic(() => import('../components/itemlist'), {
  ssr: false,
  loading: () => <div className="font-bold text-2xl">LOADING</div>,
})

export default async function Home() {
  const categoriesData = {}
  for (const category in categoriesConfig) {
    const types = Object.keys(categoriesConfig[category])
    categoriesData[category] = await getItems(category, types)
  }

  return (
    <main className="min-h-screen flex flex-col gap-24 mx-auto py-36 px-6 lg:max-w-4xl">
      {Object.entries(categoriesData).map(([category, items]) => {
        const defaultTab = Object.keys(categoriesConfig[category])[0]

        return (
          <div key={category}>
            <div className="mb-4 font-extrabold text-2xl uppercase">
              {category.charAt(0) + category.slice(1)}
            </div>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList>
                {Object.entries(categoriesConfig[category]).map(
                  ([type, title]) => (
                    <TabsTrigger key={type} value={type}>
                      {title.toString()}
                    </TabsTrigger>
                  ),
                )}
              </TabsList>
              {Object.entries(categoriesConfig[category]).map(([type]) => (
                <TabsContent key={type} value={type}>
                  <Card>
                    <CardContent className="pt-6">
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
    const responses = await Promise.all(
      urls.map(url => fetch(url, options)),
    )
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
