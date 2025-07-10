import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Navbar from '../components/Landing/Navbar';
import { 
  ArrowRight, 
  Code, 
  Trophy, 
  Users, 
  BookOpen, 
  Zap, 
  Target, 
  Star,
  CheckCircle,
  Play,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ChevronRight,
  Sparkles,
  Brain,
  Rocket,
  Shield,
  Globe,
  Clock
} from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const { isUserAuthenticated } = useSelector((state) => state.auth);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    // Hero animations
    const tl = gsap.timeline();
    
    tl.from('.hero-title', {
      duration: 1.2,
      y: 100,
      opacity: 0,
      ease: 'power4.out',
      stagger: 0.2
    })
    .from('.hero-subtitle', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-cta', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    }, '-=0.3')
    .from('.floating-icons', {
      duration: 1.5,
      scale: 0,
      rotation: 180,
      opacity: 0,
      ease: 'elastic.out(1, 0.5)',
      stagger: 0.1
    }, '-=0.8');

    // Features animation
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      y: 100,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Stats animation
    gsap.from('.stat-item', {
      scrollTrigger: {
        trigger: statsRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      duration: 1,
      scale: 0.5,
      opacity: 0,
      stagger: 0.15,
      ease: 'back.out(1.7)'
    });

    // Testimonials animation
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: testimonialsRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      x: -100,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Floating animation for icons
    gsap.to('.floating-icon', {
      duration: 3,
      y: -20,
      rotation: 5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
      stagger: 0.5
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: Code,
      title: "Interactive Coding",
      description: "Practice with real-time code execution and instant feedback on multiple programming languages.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Trophy,
      title: "Competitive Programming",
      description: "Join contests, climb leaderboards, and compete with developers worldwide.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Hints",
      description: "Get intelligent hints and explanations powered by advanced AI to guide your learning.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with fellow developers, share solutions, and learn from each other.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "Structured learning paths covering algorithms, data structures, and system design.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Code together with peers in real-time collaborative coding environments.",
      color: "from-red-500 to-pink-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "1000+", label: "Problems", icon: Code },
    { number: "500+", label: "Companies", icon: Globe },
    { number: "95%", label: "Success Rate", icon: Trophy }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "IndieCode helped me land my dream job at Google. The problem sets are challenging and the AI hints are incredibly helpful.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Alex Rodriguez",
      role: "Full Stack Developer",
      content: "The best coding platform I've used. The community is amazing and the learning experience is top-notch.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Priya Sharma",
      role: "CS Student at MIT",
      content: "IndieCode made competitive programming fun and accessible. I've improved my skills tremendously.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-icons">
            <Code className="floating-icon absolute top-20 left-10 w-8 h-8 text-blue-500 opacity-60" />
            <Trophy className="floating-icon absolute top-32 right-20 w-6 h-6 text-yellow-500 opacity-60" />
            <Zap className="floating-icon absolute bottom-40 left-20 w-7 h-7 text-purple-500 opacity-60" />
            <Target className="floating-icon absolute bottom-20 right-10 w-8 h-8 text-green-500 opacity-60" />
            <Star className="floating-icon absolute top-40 left-1/3 w-5 h-5 text-orange-500 opacity-60" />
            <Rocket className="floating-icon absolute bottom-60 right-1/3 w-6 h-6 text-pink-500 opacity-60" />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Master
              </span>
              <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Coding Skills
              </span>
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Faster
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers mastering algorithms, data structures, and competitive programming 
            with our AI-powered learning platform.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row gap-6 justify-center items-center">
            <NavLink to={isUserAuthenticated ? "/problemset" : "/signup"}>
              <motion.button 
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5" />
                {isUserAuthenticated ? "Start Practicing" : "Get Started Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </NavLink>

            <motion.button 
              className="group px-8 py-4 border-2 border-gray-600 rounded-full font-semibold text-lg hover:border-orange-500 transition-all duration-300 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">Trusted by 50K+ developers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm">24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Why Choose IndieCode?
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of coding education with our cutting-edge features designed to accelerate your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card group relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-orange-500/50 transition-all duration-300"
                whileHover={{ y: -10 }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-20 px-4 bg-gradient-to-r from-orange-900/20 to-orange-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="inline-flex p-4 bg-orange-500/20 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hear from developers who transformed their careers with IndieCode
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card group">
                <div className="relative p-8 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-orange-500/50 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-2 border-orange-500/50 mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-orange-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>

                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-r from-orange-900/30 to-orange-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of developers who are already mastering their craft with IndieCode. Start your journey today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <NavLink to={isUserAuthenticated ? "/problemset" : "/signup"}>
              <motion.button 
                className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full font-bold text-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-6 h-6" />
                {isUserAuthenticated ? "Continue Learning" : "Start Free Trial"}
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </NavLink>
          </div>

          <p className="text-gray-400 text-sm mt-8">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  <span className="text-white">Indie</span>
                  <span className="text-orange-500">Code</span>
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering developers worldwide with cutting-edge coding education and competitive programming platform.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Problems</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contests</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Discussions</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 IndieCode. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;