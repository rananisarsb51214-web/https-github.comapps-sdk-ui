import React, { useState, MouseEvent } from 'react';
import { SocialLink } from '../types';

interface ContactLinksProps {
  extraLinks: SocialLink[];
}

interface TiltCardProps {
  link: SocialLink;
  isFeatured?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({ link, isFeatured = false }) => {
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15; // Increased rotation for more effect
    const rotateY = ((x - centerX) / centerX) * 15;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.1s ease-out' }}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${link.color} text-white shadow-xl hover:shadow-2xl hover:z-10 ${isFeatured ? 'sm:col-span-2 sm:row-span-1 ring-4 ring-white/30 dark:ring-white/10' : ''}`}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-white opacity-10 transition-transform group-hover:scale-150 duration-500"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 rounded-full bg-black opacity-10 transition-transform group-hover:scale-125 duration-500"></div>
      
      {isFeatured && (
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
          Featured
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className={`p-4 bg-white/20 rounded-full mb-4 backdrop-blur-sm shadow-inner ${isFeatured ? 'scale-110' : ''}`}>
          <i className={`${link.icon} text-3xl md:text-4xl`}></i>
        </div>
        <h3 className={`text-xl font-bold tracking-wide text-center ${isFeatured ? 'text-2xl' : ''}`}>{link.label}</h3>
        <p className="mt-2 text-xs font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-black/20 px-3 py-1 rounded-full">
          Click to Visit <i className="fas fa-arrow-right ml-1"></i>
        </p>
      </div>
    </a>
  );
};

const ContactLinks: React.FC<ContactLinksProps> = ({ extraLinks }) => {
  const portfolioLink: SocialLink = {
    id: 'portfolio',
    platform: 'other',
    url: 'https://sites.google.com/d/1bePsY8n0K3tx5CUBxDlWpAPpkAehqtPN/p/1WlyY3H4ZtDUUcQUG05SSEcgMWHar8J9t/edit',
    label: 'My Portfolio',
    icon: 'fas fa-laptop-code',
    color: 'bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600'
  };

  const fixedLinks: SocialLink[] = [
    {
      id: 'whatsapp',
      platform: 'whatsapp',
      url: 'https://wa.me/message/3A7MFOQTRE2ZL1',
      label: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      color: 'bg-gradient-to-br from-green-400 to-green-600'
    },
    {
      id: 'email',
      platform: 'email',
      url: 'mailto:rananisar943@gmail.com',
      label: 'Email / Gmail',
      icon: 'fas fa-envelope',
      color: 'bg-gradient-to-br from-red-400 to-red-600'
    },
    {
      id: 'discord',
      platform: 'discord',
      url: 'https://discord.gg/gtyKuj7Rg',
      label: 'Discord',
      icon: 'fab fa-discord',
      color: 'bg-gradient-to-br from-indigo-400 to-indigo-600'
    },
    {
      id: 'github',
      platform: 'github',
      url: 'https://github.com/rana51214/',
      label: 'GitHub',
      icon: 'fab fa-github',
      color: 'bg-gradient-to-br from-gray-700 to-gray-900'
    }
  ];

  const allLinks = [...fixedLinks, ...extraLinks];

  return (
    <div className="w-full py-12 sm:py-16 bg-white dark:bg-card transition-colors duration-300 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
          <i className="fas fa-code absolute top-10 left-10 text-6xl"></i>
          <i className="fas fa-paint-brush absolute bottom-20 right-20 text-6xl"></i>
          <i className="fas fa-share-alt absolute top-1/2 left-1/4 text-4xl"></i>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Connect & Collaborate
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-300">
            Explore my latest work or get in touch directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Portfolio takes prominence */}
          <div className="sm:col-span-2 lg:col-span-2">
             <TiltCard link={portfolioLink} isFeatured={true} />
          </div>

          {allLinks.map((link) => (
            <TiltCard key={link.id} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactLinks;