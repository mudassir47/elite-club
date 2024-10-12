"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image, Play, X } from "lucide-react"
import { getDatabase, ref, onValue } from "firebase/database"

type MediaItem = {
  id: string
  type: "image" | "video"
  thumbnail: string
  source: string
  title: string
  description: string
}

export function EliteClubGalleryComponent() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [filter, setFilter] = useState<"all" | "images" | "videos">("all")

  useEffect(() => {
    const db = getDatabase()
    const mediaRef = ref(db, 'gallery/images') // Adjust path as necessary

    onValue(mediaRef, (snapshot) => {
      const data = snapshot.val()
      const items: MediaItem[] = []

      for (const key in data) {
        const item = data[key]
        items.push({
          id: key,
          type: item.type,
          thumbnail: item.thumbnail || item.url, // Use your thumbnail logic
          source: item.url, // Assuming 'url' holds the media source
          title: item.title || "Untitled", // Add default title if needed
          description: item.description || "No description available." // Add default description if needed
        })
      }
      setMediaItems(items)
    })
  }, [])

  const filteredItems = mediaItems.filter(item =>
    filter === "all" || (filter === "images" && item.type === "image") || (filter === "videos" && item.type === "video")
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-[#0075FF] mb-8">Elite Club Gallery</h2>
      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
          <TabsTrigger value="images" onClick={() => setFilter("images")}>Images</TabsTrigger>
          <TabsTrigger value="videos" onClick={() => setFilter("videos")}>Videos</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => setSelectedItem(item)}>
              <CardContent className="p-0 relative">
                <img src={item.thumbnail} alt={item.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Button variant="secondary" size="icon">
                    {item.type === "image" ? <Image className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription>{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedItem?.type === "image" ? (
              <img src={selectedItem.source} alt={selectedItem.title} className="w-full h-auto" />
            ) : (
              <video src={selectedItem?.source} controls className="w-full h-auto">
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setSelectedItem(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
