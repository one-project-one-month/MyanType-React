import Navbar from "../components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Globe, Server, Zap, Users, Target } from "lucide-react";

const About = () => {
  const techStack = {
    frontend: [
      { name: "React", description: "Modern UI library for building interactive interfaces" },
      { name: "Shadcn/UI", description: "Beautiful and accessible component library" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework for rapid styling" }
    ],
    backend: [
      { name: "Node.js", description: "JavaScript runtime for server-side development" },
      { name: "MySQL", description: "Reliable relational database for data storage" },
      { name: "Express.js", description: "Fast and minimalist web framework" }
    ],
    deployment: [
      { name: "Vercel", description: "Frontend hosting with global CDN" },
      { name: "Render", description: "Backend API hosting with auto-deployment" }
    ]
  };

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual Support",
      description: "Practice typing in both English and Myanmar languages with native text support"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Real-time Statistics",
      description: "Track your WPM, accuracy, and progress with live feedback"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast & Responsive",
      description: "Built with modern technologies for smooth and responsive experience"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User-Friendly",
      description: "Clean interface designed for distraction-free typing practice"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0F15] text-[#F4F4F5]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#F4F4F5] mb-4">
              About MyanType
            </h1>
            <p className="text-lg text-[#777C90] max-w-2xl mx-auto">
              A modern typing test application designed to help users improve their typing skills 
              in both English and Myanmar languages with real-time feedback and statistics.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-[#141723] bg-[#141723] text-[#F4F4F5] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#141723] text-white border border-[#777C90]">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#777C90]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tech Stack */}
          <Card className="border border-[#141723] bg-[#141723] text-[#F4F4F5] shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Frontend */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#F4F4F5]">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Frontend
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {techStack.frontend.map((tech, index) => (
                    <div key={index} className="p-4 rounded-lg bg-[#0E0F15] border border-[#777C90]">
                      <Badge variant="secondary">{tech.name}</Badge>
                      <p className="text-sm text-[#777C90] mt-2">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#F4F4F5]">
                  <Server className="w-5 h-5 text-purple-400" />
                  Backend API
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {techStack.backend.map((tech, index) => (
                    <div key={index} className="p-4 rounded-lg bg-[#0E0F15] border border-[#777C90]">
                      <Badge variant="secondary">{tech.name}</Badge>
                      <p className="text-sm text-[#777C90] mt-2">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#F4F4F5]">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  Deployment
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {techStack.deployment.map((tech, index) => (
                    <div key={index} className="p-4 rounded-lg bg-[#0E0F15] border border-[#777C90]">
                      <Badge variant="secondary">{tech.name}</Badge>
                      <p className="text-sm text-[#777C90] mt-2">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Link */}
          <Card className="border-0 shadow-lg bg-[#141723] text-[#F4F4F5]">
            <CardContent className="text-center py-8">
              <GitBranch className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Open Source</h3>
              <p className="mb-6 text-[#777C90]">
                This project is open source and available on GitHub. Feel free to contribute, 
                report issues, or fork the repository.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-[#141723] hover:bg-gray-100"
                onClick={() => window.open('https://github.com/one-project-one-month/MyanType-React.git', '_blank')}
              >
                <GitBranch className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
