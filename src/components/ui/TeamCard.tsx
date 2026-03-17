import React from 'react';
import { Linkedin, Github, Twitter, Mail } from 'lucide-react';
import './TeamCard.css';

interface TeamCardProps {
  member: {
    name: string;
    role: string;
    techRole?: string;
    image: string;
    bio: string;
    social?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  };
}

export const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  return (
    <div className="team-card-wrapper w-full flex justify-center items-center p-4">
      <div className="team-card">
        <button className="mail" onClick={(e) => { e.preventDefault(); window.location.href = "mailto:hello@ulmind.com"; }}>
          <Mail size={24} />
        </button>
        <div className="profile-pic">
          <img src={member.image} alt={member.name} />
        </div>
        <div className="bottom">
          <div className="content">
            <span className="name" title={member.name}>{member.name}</span>
            {member.techRole && <span className="tech-role">{member.techRole}</span>}
          </div>
          <div className="bottom-bottom">
            <div className="social-links-container">
              {member.social?.linkedin && (
                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin />
                </a>
              )}
              {member.social?.github && (
                <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                  <Github />
                </a>
              )}
              {member.social?.twitter && member.social.twitter !== "#" && (
                <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter />
                </a>
              )}
            </div>
            <button className="button" title={member.role}>{member.role}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
