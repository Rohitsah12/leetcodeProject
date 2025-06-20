import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { Code, Brain, Video, Users, Trophy, Zap, ChevronRight, Play, Star, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const features = [
    {
      icon: Code,
      title: "Interactive Coding Environment",
      description: "Write, test, and debug code in multiple languages with our advanced Monaco editor",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Brain,
      title: "AI-Powered Assistance",
      description: "Get personalized hints and explanations from our intelligent tutoring system",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Video,
      title: "Video Solutions",
      description: "Watch detailed video explanations for complex problems and algorithms",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description: "Monitor your coding journey with detailed analytics and achievements",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "This platform helped me ace my technical interviews. The AI tutor is incredibly helpful!",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Michael Rodriguez",
      role: "Full Stack Developer",
      content: "The video explanations are top-notch. I finally understand dynamic programming!",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Emily Johnson",
      role: "CS Student",
      content: "Perfect for learning algorithms. The interactive environment makes coding fun!",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500+", label: "Coding Problems" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="navbar bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex-1">
            <NavLink to="/" className="btn btn-ghost text-2xl font-bold text-primary">
              <Code className="w-8 h-8 mr-2" />
              CodeMaster
            </NavLink>
          </div>
          <div className="flex-none gap-4">
            <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
            <NavLink to="/signup" className="btn btn-primary">Get Started</NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="hero-content text-center relative z-10 max-w-6xl">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Master Coding with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {" "}AI-Powered Learning
              </span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Elevate your programming skills with our interactive platform featuring AI tutoring, 
              video solutions, and real-time code execution. Join thousands of developers mastering algorithms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NavLink to="/signup" className="btn btn-primary btn-lg px-8 py-4 text-lg">
                Start Coding Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </NavLink>
              <button className="btn btn-outline btn-lg px-8 py-4 text-lg text-white border-white hover:bg-white hover:text-primary">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center">
            <Code className="w-8 h-8 text-yellow-300" />
          </div>
        </div>
        <div className="absolute bottom-32 right-16 animate-pulse">
          <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center">
            <Brain className="w-10 h-10 text-green-300" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" data-animate className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to become a coding expert
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  className={`card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                    isVisible.features ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-body text-center p-8">
                    <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="card-title text-lg mb-3 justify-center">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" data-animate className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to start your coding journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Choose a Problem",
                description: "Select from hundreds of carefully curated coding challenges across different difficulty levels",
                icon: Code
              },
              {
                step: "02", 
                title: "Code & Learn",
                description: "Write your solution in our interactive editor with real-time feedback and AI assistance",
                icon: Brain
              },
              {
                step: "03",
                title: "Master & Progress",
                description: "Track your progress, watch video explanations, and level up your skills",
                icon: Trophy
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" data-animate className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-blue-100">Join thousands of successful developers</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card bg-white/10 backdrop-blur-md shadow-xl">
              <div className="card-body p-12 text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <img 
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-blue-200">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Coding Journey?</h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join our community of learners and take your programming skills to the next level
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/signup" className="btn btn-primary btn-lg px-8 py-4 text-lg bg-white text-green-600 hover:bg-gray-100">
              Get Started Free
              <Zap className="w-5 h-5 ml-2" />
            </NavLink>
            <NavLink to="/login" className="btn btn-outline btn-lg px-8 py-4 text-lg text-white border-white hover:bg-white hover:text-green-600">
              Sign In
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 mr-2 text-primary" />
                <span className="text-2xl font-bold">CodeMaster</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering developers worldwide with AI-powered learning and interactive coding challenges.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Problems</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Tutor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Progress</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CodeMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;