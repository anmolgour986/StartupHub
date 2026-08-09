import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 20, className = '' }) => (
  <Loader2 size={size} className={`animate-spin text-brand-600 ${className}`} />
);

export const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size={32} />
  </div>
);

export default Spinner;
