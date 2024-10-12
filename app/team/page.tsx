'use client'

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Facebook, Twitter, Linkedin, Github } from "lucide-react";
import { realtimeDB } from '@/lib/firebaseConfig';

type TeamMember = {
  name: string;
  designation: string;
  image: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  approved: boolean; // Added approved field
}

const SocialIcon = ({ platform, url }: { platform: keyof TeamMember['socialMedia'], url: string }) => {
  const icons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    github: Github
  };
  
  const Icon = icons[platform];
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0075FF] transition-colors">
      <Icon className="h-4 w-4" />
    </a>
  );
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const teamRef = ref(realtimeDB, 'teams');

    // Fetch team members from Firebase
    onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const members: TeamMember[] = Object.keys(data).map(key => ({
          name: data[key].name,
          designation: data[key].designation,
          image: data[key].photoURL || '',
          socialMedia: {
            facebook: data[key].facebook,
            twitter: data[key].twitter,
            linkedin: data[key].linkedin,
            github: data[key].github,
          },
          approved: data[key].approved || false, // Ensure to retrieve the approved field
        })).filter(member => member.approved); // Filter to include only approved members

        setTeamMembers(members);
      }
    });

  }, []);

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
                  url ? (
                    <SocialIcon key={platform} platform={platform as keyof TeamMember['socialMedia']} url={url} />
                  ) : null
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
