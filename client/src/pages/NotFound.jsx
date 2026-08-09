import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-5">
      <Rocket size={28} className="text-brand-600" />
    </div>
    <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
    <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">This page took off without you. Let's get you back on track.</p>
    <Link to="/" className="btn-primary">Back to home</Link>
  </div>
);

export default NotFound;
