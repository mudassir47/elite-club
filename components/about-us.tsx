'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Laptop, Users, Zap, Code, Lightbulb, ArrowRight, GraduationCap } from "lucide-react"
import Link from 'next/link'; // Use Next.js Link

export function AboutUsComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-5xl font-bold text-[#0073FE]">The Elite Club</CardTitle>
            <CardDescription className="text-xl text-blue-600 mt-2">
              Anjuman-I-Islam Kalsekar Technical Campus
            </CardDescription>
          </CardHeader>
          <Separator className="my-4 mx-auto w-1/2" />
          <CardContent className="grid gap-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <section>
                  <h2 className="text-3xl font-semibold text-[#0073FE] mb-4">About Us</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Welcome to The Elite Club, a vibrant community dedicated to nurturing talent and fostering innovation
                    in the fields of Electronics and Computer Science. Our club provides students with a platform to
                    explore their interests, develop new skills, and engage with technology in meaningful ways.
                  </p>
                </section>
                <section>
                  <h3 className="text-2xl font-semibold text-[#0073FE] mb-2">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our mission is to empower students through hands-on training and workshops, equipping them with the
                    knowledge and skills necessary to excel in the rapidly evolving tech landscape. We believe in creating
                    a collaborative environment where creativity and critical thinking flourish.
                  </p>
                </section>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#0073FE] mb-4">What We Do</h3>
                <ul className="space-y-4">
                  {[
                    { icon: Laptop, text: "Organizing workshops on emerging technologies" },
                    { icon: Users, text: "Hosting guest lectures from industry experts" },
                    { icon: Zap, text: "Conducting hackathons and coding competitions" },
                    { icon: Code, text: "Providing training sessions on practical skills" },
                    { icon: Lightbulb, text: "Creating projects that make a difference" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 hover:bg-blue-50">
                      <item.icon className="h-8 w-8 text-[#0073FE]" />
                      <span className="text-gray-700 text-lg">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <section>
              <h3 className="text-3xl font-semibold text-[#0073FE] mb-6 text-center">Our Leadership</h3>
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    name: "Bandanawaz Kotiyal",
                    role: "Head of the Department (Electronics and Computer Science)",
                  },
                  {
                    name: "Prof Riyaz Pathan",
                    role: "Faculty at Electronics and Computer Science Department",
                  },
                  {
                    name: "Prof Ismail",
                    role: "Faculty at Electronics and Computer Science Department",
                  },
                ].map((staff, index) => (
                  <Card key={index} className="bg-blue-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <GraduationCap className="h-16 w-16 text-[#0073FE] mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-[#0073FE] text-center mb-2">{staff.name}</h4>
                      <p className="text-sm text-gray-600 text-center">{staff.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            <section className="text-center">
              <h3 className="text-3xl font-semibold text-[#0073FE] mb-4">Join Us</h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Whether you are a tech enthusiast or looking to enhance your skills, The Elite Club welcomes you! Join us
                in our journey of discovery and innovation. Together, let shape the future of technology.
              </p>
              <Link href="/teamRegister">
                <Button className="bg-[#0073FE] hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  Join The Elite Club
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
