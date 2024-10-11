'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Github, ChevronLeft, ChevronRight, Briefcase, Pause, Play } from "lucide-react"
import { useRef, useState, useEffect, useCallback } from "react"

type TeamMember = {
  name: string
  designation: string
  image: string
  socialMedia: {
    facebook?: string
    twitter?: string
    linkedin?: string
    github?: string
  }
}

const teamMembers: TeamMember[] = [
  {
    name: "John Doe",
    designation: "Frontend Developer",
    image: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      facebook: "https://facebook.com/johndoe",
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe"
    }
  },
  {
    name: "Jane Smith",
    designation: "UI/UX Designer",
    image: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      facebook: "https://facebook.com/janesmith",
      twitter: "https://twitter.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith"
    }
  },
  {
    name: "Mike Johnson",
    designation: "Backend Developer",
    image: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      linkedin: "https://linkedin.com/in/mikejohnson",
      github: "https://github.com/mikejohnson"
    }
  },
  {
    name: "Mike Johnson",
    designation: "Backend Developer",
    image: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      linkedin: "https://linkedin.com/in/mikejohnson",
      github: "https://github.com/mikejohnson"
    }
  },
  {
    name: "Mike Johnson",
    designation: "Backend Developer",
    image: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      linkedin: "https://linkedin.com/in/mikejohnson",
      github: "https://github.com/mikejohnson"
    }
  },
  {
    name: "Mike Johnson",
    designation: "Backend Developer",
    image: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      linkedin: "https://linkedin.com/in/mikejohnson",
      github: "https://github.com/mikejohnson"
    }
  },
  {
    name: "Emily Brown",
    designation: "Project Manager",
    image: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      linkedin: "https://linkedin.com/in/emilybrown",
      twitter: "https://twitter.com/emilybrown"
    }
  },
  {
    name: "Alex Lee",
    designation: "Data Scientist",
    image: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      github: "https://github.com/alexlee",
      linkedin: "https://linkedin.com/in/alexlee"
    }
  }
  
]

const SocialIcon = ({ platform, url }: { platform: keyof TeamMember['socialMedia'], url: string }) => {
  const icons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    github: Github
  }
  const Icon = icons[platform]
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0075FF] transition-colors">
      <Icon size={18} />
    </a>
  )
}

export function EliteTeamCardComponent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (isAutoScrolling && scrollContainerRef.current) {
      intervalId = setInterval(() => {
        const { current } = scrollContainerRef
        if (current) {
          if (current.scrollLeft + current.clientWidth >= current.scrollWidth) {
            // Reset to the start smoothly
            current.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            current.scrollBy({ left: 1, behavior: 'smooth' })
          }
        }
      }, 30)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isAutoScrolling])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = current.clientWidth
      if (direction === 'left') {
        if (current.scrollLeft === 0) {
          current.scrollTo({ left: current.scrollWidth, behavior: 'smooth' }) // Wrap to the end
        } else {
          current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        }
      } else {
        if (current.scrollLeft + current.clientWidth >= current.scrollWidth) {
          current.scrollTo({ left: 0, behavior: 'smooth' }) // Wrap to the start
        } else {
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
      }
    }
  }

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling)
  }

  return (
    <div className="container mx-auto px-4 py-16 relative">
      <h2 className="text-3xl font-bold text-center text-[#0075FF] mb-12 flex items-center justify-center">
        <Briefcase className="mr-2" size={32} />
        Our Elite Team
      </h2>
      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {teamMembers.map((member, index) => (
            <Card key={index} className="flex-shrink-0 w-72 bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4 ring-4 ring-[#0075FF] ring-opacity-50">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-[#0075FF] text-white text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-[#0075FF] mb-1">{member.name}</h3>
                <p className="text-gray-600 mb-4 flex items-center">
                  <Briefcase className="mr-1" size={14} />
                  {member.designation}
                </p>
                <div className="flex space-x-3">
                  {Object.entries(member.socialMedia).map(([platform, url]) => (
                    <SocialIcon key={platform} platform={platform as keyof TeamMember['socialMedia']} url={url} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAutoScroll}
          className="flex items-center space-x-2"
        >
          {isAutoScrolling ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Auto Scroll</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}