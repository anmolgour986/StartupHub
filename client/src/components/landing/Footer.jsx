import { Rocket } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-gray-100 dark:border-gray-900 mt-24">
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
          <Rocket size={14} className="text-white" />
        </div>
        <span className="font-semibold">StartupHub</span>
        <span className="text-sm text-gray-400 ml-2">© {new Date().getFullYear()} All rights reserved.</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <a href="#features" className="hover:text-brand-600">Features</a>
        <a href="#how-it-works" className="hover:text-brand-600">How it works</a>
        <a href="#startups" className="hover:text-brand-600">Startups</a>
      </div>
    </div>
  </footer>
);

export default Footer;
