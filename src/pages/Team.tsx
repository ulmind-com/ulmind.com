import { motion } from "framer-motion";
import {
  Linkedin,
  Github,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";

export default function Team() {
  const navigate = useNavigate();

  const team = [
    {
      name: "Soumyajit Banerjee",
      role: "Founder & CTO",
      image: "/Soumyajit.jpg",
      bio: "Passionate developer with expertise in full stack web technologies and reliable, scalable, and secure deployment.",
      skills: ["SpringBoot", "React", "DevOps", "Microservices", "Cloud Computing"],
      social: {
        linkedin: "https://www.linkedin.com/in/soumyajit-banerjee-274b1229a/",
        github: "https://github.com/leo-soumyajit",
        twitter: "https://soumyajitbanerjeeportfolio.vercel.app/",
      },
    },

        {
      name: "Arnab Senapati",
      role: "Co-Founder , MD & CEO",
      image: "/arnabsenapati2.jpg",
      bio: " I’m focused on building a company that helps businesses grow through creativity, technology, and strategy.",
      skills: [
        "Business Development",
        "Project Management",
        "Digital Marketing",
        "Team Leadership",
        "Client Relationship Management",
        "Brand Strategy",
      ],
      social: {
        linkedin:
          "https://www.linkedin.com/in/arnab-senapati",
        github: "https://github.com/arnab-senapati",
        twitter: "https://x.com/arnabsenapti",
      },
    },


        {
  "name": "Samiran Samanta",
  "role": "Co-founder & CTO",
  "image": "/samiransamanta.jpg",
  "bio": "As a Senior Full Stack Developer and DevOps Engineer at ULMiND, I build robust technology solutions and streamline development processes to deliver impactful products that empower users.",
  "skills": [
    "Backend Development",
    "APIs Designing",
    "Database Designing",
    "API Performance Tuning",
    "Native App Development",
  ],
  "social": {
    "linkedin": "https://www.linkedin.com/in/samiransamanta/",
    "github": "https://github.com/Samiran2004",
    "twitter": "https://x.com/SmrSmt147270"
  }
},

    {
      name: "Tirtha Ghosh",
      role: "Co-founder & CTO",
      image: "/TirthaGhosh.jpg",
      bio: "Full Stack Developer skilled in building end-to-end web applications using modern frontend and backend technologies.",
      skills: ["MERN Stack", "NodeJS", "Express JS", "React"],
      social: {
        linkedin: "https://www.linkedin.com/in/tirtha-ghosh-098a072ba/",
        github: "https://github.com/tirthaGhosh91213",
        twitter: "https://tirtha-portfolio-pink.vercel.app/",
      },
    },

    {
      name: "Sagnik Mondal",
      role: "Co-founder & Developer",
      image: "/sagnik2.jpg",
      bio: "MERN Stack Developer passionate about building responsive, scalable, and user-friendly web applications.",
      skills: ["MongoDB", "ExpressJS", "React", "NodeJS", "NextJS", "Tailwind CSS"],
      social: {
        linkedin:
          "https://www.linkedin.com/in/sagnik-mondal-118b08311",
        github: "https://github.com/SAgNik-MonDA",
        twitter: "#",
      },
    },

   

    {
  "name": "Swastika Roy",
  "role": "Co-founder & CHRO",
  "image": "/swastika.jpg",
  "bio": "Spring Boot–focused Full Stack Developer specializing in building reliable microservices and high-performance REST APIs with Java and MySQL. I architect clean, maintainable backends, optimize database performance, and automate workflows with Python. I care deeply about code quality, security, and delivering scalable features that serve real users.",
  "skills": ["MySQL", "Java", "Spring Boot", "Microservices", "Python"],
  "social": {
    "linkedin": "https://www.linkedin.com/in/swastika-roy-692aa72b4/",
    "github": "https://github.com/Swastika-Roy",
    "twitter": "#"
  }
},

{
  name: "Roni Routh",
  role: "Python Developer & ML Engineer",
  image: "ronirouth.jpg",
  bio: "Passionate Python Developer specializing in Machine Learning and Data Analysis. Skilled in C++, Python, and key ML libraries like NumPy, Pandas, Scikit-learn, and FastAPI, focusing on building intelligent, data-driven applications with clean, efficient code.",
  skills: [
     "C++ ",
    "Python",
    "NumPy",
    "Pandas",
    "Matplotlib & Seaborn",
    "Scikit-learn",
   "FastApi",
   "SQL"
  ],
  social: {
    "linkedin": "https://www.linkedin.com/in/roni-routh-a15227302/"
  }
},



  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our diverse team of talented professionals brings together years of experience, innovative thinking, and a shared passion for creating exceptional digital solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border border-border/50 hover:shadow-glow hover:border-primary/20 transition-all duration-500 group">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2 justify-center">
                      {member.social.linkedin && (
                        <Button size="sm" variant="secondary" className="w-10 h-10 p-0" asChild>
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {member.social.github && (
                        <Button size="sm" variant="secondary" className="w-10 h-10 p-0" asChild>
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {member.social.twitter && (
                        <Button size="sm" variant="secondary" className="w-10 h-10 p-0" asChild>
                          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Culture & Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We foster an environment where creativity thrives, collaboration flourishes, and every team member can grow.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Innovation",
              description:
                "We encourage creative thinking and embrace new technologies to stay ahead of the curve.",
            },
            {
              title: "Collaboration",
              description:
                "We believe the best solutions come from diverse perspectives working together.",
            },
            {
              title: "Growth",
              description:
                "We invest in our team's professional and personal development journey.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Growing Team</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're always looking for talented individuals who share our passion for innovation and excellence.
          </p>
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3"
            onClick={() => navigate("/career")}
          >
            View Open Positions
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}