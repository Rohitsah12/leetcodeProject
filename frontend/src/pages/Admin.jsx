import React, { useState } from 'react';
import { Plus, Edit, Trash2, Video } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Navbar from '../components/Landing/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Landing/Footer';

// Aceternity-style Card Hover Effect Components
const HoverEffect = ({ items, className = "" }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 ${className}`}>
      {items.map((item, idx) => (
        <NavLink
          to={item.route}
          key={item.id}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 bg-orange-500/20 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-orange-500/10 p-4 rounded-full">
                <item.icon size={32} className="text-orange-500" />
              </div>
            </div>
            
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            
            {/* Action indicator */}
            <div className="flex items-center justify-center mt-6 text-sm text-neutral-500 dark:text-neutral-400 group-hover:text-orange-500 transition-colors duration-200">
              <span>Access Panel</span>
              <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        </NavLink>
      ))}
    </div>
  );
};

const Card = ({ className = "", children }) => {
  return (
    <div
      className={`rounded-2xl h-full w-full p-6 overflow-hidden bg-black/40 backdrop-blur-sm border border-transparent dark:border-white/[0.2] group-hover:border-orange-500/50 relative z-20 transition-all duration-300 ${className}`}
    >
      <div className="relative z-50">
        {children}
      </div>
    </div>
  );
};

const CardTitle = ({ className = "", children }) => {
  return (
    <h4 className={`text-zinc-100 font-bold tracking-wide text-xl text-center mb-3 ${className}`}>
      {children}
    </h4>
  );
};

const CardDescription = ({ className = "", children }) => {
  return (
    <p className={`text-zinc-400 tracking-wide leading-relaxed text-sm text-center ${className}`}>
      {children}
    </p>
  );
};

function Admin() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform with detailed test cases and solutions',
      icon: Plus,
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems, modify difficulty levels, and update problem statements',
      icon: Edit,
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove outdated or incorrect problems from the platform permanently',
      icon: Trash2,
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Management',
      description: 'Upload tutorial videos and manage video content for problem explanations',
      icon: Video,
      route: '/admin/video'
    }
  ];

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 pb-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-600 bg-clip-text text-transparent mb-4">
            Admin Control Panel
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto px-4">
            Manage your coding platform with powerful administrative tools and intuitive controls
          </p>
        </motion.div>
      </div>
      
      {/* Admin Cards */}
      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={adminOptions} />
      </div>
      
      <Footer />
      
    </div>
  );
}

export default Admin;