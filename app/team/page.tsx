'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Facebook, Twitter, Linkedin, Github } from "lucide-react"

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
      <Icon className="h-4 w-4" />
    </a>
  )
}

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-[#0075FF] mb-12">
        Our Elite Team
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
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
  )
}
