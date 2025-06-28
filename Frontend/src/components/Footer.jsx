// components/Footer.jsx - Improved and Fixed
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Heart,
  BookOpen,
  Users,
  Award,
  Zap
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Mock Tests', href: '/testSection' },
      { name: 'Analytics', href: '/analytics' },
      { name: 'Mobile App', href: '/mobile' }
    ],
    exams: [
      { name: 'JEE Main & Advanced', href: '/testSection' },
      { name: 'NEET', href: '/testSection' },
      { name: 'GATE', href: '/testSection' },
      { name: 'CAT', href: '/testSection' },
      { name: 'UPSC', href: '/testSection' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Contact', href: '/contact' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Student Stories', href: '/stories' },
      { name: 'System Status', href: '/status' },
      { name: 'Report Bug', href: '/bug-report' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' }
    ]
  };

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      href: 'https://facebook.com/mockint', 
      hoverColor: 'hover:text-blue-400' 
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      href: 'https://twitter.com/mockint', 
      hoverColor: 'hover:text-sky-400' 
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: 'https://instagram.com/mockint', 
      hoverColor: 'hover:text-pink-400' 
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://linkedin.com/company/mockint', 
      hoverColor: 'hover:text-blue-500' 
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      href: 'https://youtube.com/mockint', 
      hoverColor: 'hover:text-red-400' 
    }
  ];

  const stats = [
    { icon: Users, label: 'Students', value: '50,000+' },
    { icon: BookOpen, label: 'Mock Tests', value: '1M+' },
    { icon: Award, label: 'Success Rate', value: '98%' },
    { icon: Zap, label: 'Questions', value: '100K+' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Animated Background - Matching Login */}
      <div className="absolute inset-0">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            >
              <div className={`w-2 h-2 bg-emerald-400 rounded-full opacity-20 ${i % 3 === 0 ? 'animate-pulse' : ''}`}></div>
            </div>
          ))}
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="h-full w-full" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Stats Section */}
        <div className="border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Trusted by Students Across India
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Join thousands of successful students who have achieved their dreams with Mockint
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow group-hover:shadow-glow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Enhanced Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-glow">
                    <span className="text-white font-bold text-2xl">M</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Mockint
                </span>
              </Link>
              
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                India&apos;s leading AI-powered mock test platform. Helping students achieve their dreams through smart preparation and personalized learning.
              </p>

              {/* Enhanced Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  <div className="w-10 h-10 bg-dark-800/50 rounded-lg flex items-center justify-center border border-dark-700/50">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="font-medium">support@mockint.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  <div className="w-10 h-10 bg-dark-800/50 rounded-lg flex items-center justify-center border border-dark-700/50">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="font-medium">+91 80123 45678</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  <div className="w-10 h-10 bg-dark-800/50 rounded-lg flex items-center justify-center border border-dark-700/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Bangalore, India</span>
                </div>
              </div>

              {/* Enhanced Social Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 glass-card hover:bg-dark-700/50 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 text-slate-400 ${social.hoverColor} hover:shadow-glow`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Enhanced Links Sections */}
            <div className="lg:col-span-4 grid md:grid-cols-4 gap-8">
              {/* Product Links */}
              <div>
                <h3 className="font-bold text-white mb-6 text-lg">Product</h3>
                <ul className="space-y-4">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group font-medium"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exam Links */}
              <div>
                <h3 className="font-bold text-white mb-6 text-lg">Exams</h3>
                <ul className="space-y-4">
                  {footerLinks.exams.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group font-medium"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="font-bold text-white mb-6 text-lg">Company</h3>
                <ul className="space-y-4">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group font-medium"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="font-bold text-white mb-6 text-lg">Support</h3>
                <ul className="space-y-4">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group font-medium"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <div className="flex items-center gap-3 text-slate-400">
                <span className="font-medium">© {currentYear} Mockint. All rights reserved.</span>
                <span className="hidden md:block">•</span>
                <span className="flex items-center gap-2 font-medium">
                  Made with <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" /> by the Mockint Team
                </span>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-6">
                {footerLinks.legal.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;