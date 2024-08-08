import React from 'react'
import dynamic from 'next/dynamic'

import Filter from '@/components/filter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

import categoriesConfig from '@/categoriesConfig.json'

const ItemList = dynamic(() => import('../components/itemlist'), {
  ssr: false,
  loading: () => (
    <div className="text-black/80 dark:text-white/80">LOADING</div>
  ),
})

export default async function Home() {
  const categoriesData = {}
  for (const category in categoriesConfig) {
    const types = Object.keys(categoriesConfig[category])
    categoriesData[category] = await getItems(category, types)
  }

  return (
    <main className="min-h-screen px-4 mx-0 lg:mx-32 py-16 lg:w-[540px]">
      <Filter>
        <Tabs defaultValue="book">
          <TabsList className="bg-transparent text-black/40 h-8">
            {Object.keys(categoriesData).map(category => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-base"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categoriesData).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <Tabs defaultValue={Object.keys(categoriesConfig[category])[0]}>
                <TabsList className="bg-transparent text-black/40 h-8">
                  {Object.entries(categoriesConfig[category]).map(
                    ([type, title]) => (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="text-base"
                      >
                        {title.toString()}
                      </TabsTrigger>
                    ),
                  )}
                </TabsList>
                {Object.entries(categoriesConfig[category]).map(([type]) => (
                  <TabsContent key={type} value={type}>
                    <Card className="border-[#141414] rounded-none shadow-none my-16">
                      <CardContent className="p-4">
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
            </TabsContent>
          ))}
        </Tabs>
      </Filter>
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
      `${baseApiUrl}${type}?category=${category}&page=3`,
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
