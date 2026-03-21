import { motion } from "framer-motion";
import { Linkedin, Github, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TeamCard } from "@/components/ui/TeamCard";
import { useNavigate } from "react-router-dom";
import { CTASection } from "@/components/Sections/CTASection";

export default function Team() {
  const navigate = useNavigate();

  const team = [
    {
      name: "Soumyajit Banerjee",
      role: "Founder & CTO",
      techRole: "Backend & Devops Engineer",
      image: "/Soumyajit.jpg",
      bio: "Passionate developer with expertise in full stack web technologies and scalable, secure systems.",
      skills: ["SpringBoot", "React", "DevOps", "Microservices", "Cloud"],
      social: {
        linkedin: "https://www.linkedin.com/in/soumyajit-banerjee-274b1229a/",
        github: "https://github.com/leo-soumyajit",
        twitter: "https://soumyajitbanerjeeportfolio.vercel.app/",
      },
    },
    {
      name: "Arnab Senapati",
      role: "Co-Founder & CEO",
      techRole: "Full Stack Developer",
      image: "/arnabsenapati.png",
      bio: "Focused on building a company that helps businesses grow through technology and strategy.",
      skills: [
        "Business Development",
        "Project Management",
        "Digital Marketing",
        "Leadership",
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/arnab-senapati",
        github: "https://github.com/arnab-senapati",
        twitter: "https://x.com/arnabsenapti",
      },
    },
    {
      name: "Samiran Samanta",
      role: "Co-Founder & CTO",
      techRole: "Full Stack App & Devops Engineer",
      image: "/samiransamanta.png",
      bio: "Senior Full Stack Developer & DevOps Engineer building robust, scalable solutions.",
      skills: [
        "Backend",
        "API Design",
        "Databases",
        "Performance Tuning",
        "Native Apps",
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/samiransamanta/",
        github: "https://github.com/Samiran2004",
        twitter: "https://x.com/SmrSmt147270",
      },
    },
    {
      name: "Tirtha Ghosh",
      role: "Co-Founder & CTO",
      techRole: "Full Stack Developer",
      image: "/TirthaGhosh.jpg",
      bio: "Full Stack Developer building end-to-end web applications.",
      skills: ["MERN", "NodeJS", "Express", "React"],
      social: {
        linkedin: "https://www.linkedin.com/in/tirtha-ghosh-098a072ba/",
        github: "https://github.com/tirthaGhosh91213",
        twitter: "https://tirtha-portfolio-pink.vercel.app/",
      },
    },
    {
      name: "Sagnik Mondal",
      role: "Co-Founder & COO",
      techRole: "Full Stack Developer",
      image: "/sagnik2.jpg",
      bio: "MERN developer focused on responsive and scalable apps.",
      skills: ["MongoDB", "Express", "React", "NodeJS", "NextJS"],
      social: {
        linkedin: "https://www.linkedin.com/in/sagnik-mondal-118b08311",
        github: "https://github.com/SAgNik-MonDA",
      },
    },
    {
      name: "Swastika Roy",
      role: "Co-Founder & CHRO",
      techRole: "Backend Developer",
      image: "/swastika.jpg",
      bio: "Spring Boot–focused Full Stack Developer specializing in building reliable microservices and high-performance REST APIs with Java and MySQL. I architect clean, maintainable backends, optimize database performance, and automate workflows with Python. I care deeply about code quality, security, and delivering scalable features that serve real users.",
      skills: ["MySQL", "Java", "Spring Boot", "Microservices", "Python"],
      social: {
        linkedin: "https://www.linkedin.com/in/swastika-roy-692aa72b4/",
        github: "https://github.com/Swastika-Roy",
        twitter: "#"
      }
    },
    {
      name: "Roni Routh",
      role: "Software Development Engineer",
      techRole: "Machine Learning Engineer",
      image: "/ronirouth.jpg",
      bio: "Passionate Python Developer specializing in Machine Learning and Data Analysis. Skilled in C++, Python, and key ML libraries like NumPy, Pandas, Scikit-learn, and FastAPI, focusing on building intelligent, data-driven applications with clean, efficient code.",
      skills: [
        "C++",
        "Python",
        "NumPy",
        "Pandas",
        "Matplotlib & Seaborn",
        "Scikit-learn",
        "FastApi",
        "SQL"
      ],
      social: {
        linkedin: "https://www.linkedin.com/in/roni-routh-a15227302/"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A passionate group of professionals building impactful digital solutions together.
          </p>
        </motion.div>
      </section>

      {/* TEAM GRID */}
      <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}
