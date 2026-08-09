import { Link } from 'react-router-dom';
import { MapPin, Users, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { STATUS_COLORS } from '../../utils/helpers';
import Avatar from '../ui/Avatar';

const StartupCard = ({ startup, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.35 }}
  >
    <Link
      to={`/startups/${startup._id}`}
      className="card p-5 flex flex-col h-full hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {startup.logo ? (
            <img src={startup.logo} alt={startup.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shrink-0">
              {startup.name?.[0]}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-600 transition-colors">{startup.name}</h3>
            <p className="text-xs text-gray-400">{startup.category}</p>
          </div>
        </div>
        <span className={`badge shrink-0 ${STATUS_COLORS[startup.status]}`}>{startup.status}</span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 flex-1">{startup.tagline}</p>

      {startup.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {startup.requiredSkills.slice(0, 3).map((s) => (
            <span key={s} className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{s}</span>
          ))}
          {startup.requiredSkills.length > 3 && (
            <span className="badge bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">+{startup.requiredSkills.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {startup.location && (
            <span className="flex items-center gap-1"><MapPin size={12} /> {startup.isRemote ? 'Remote' : startup.location}</span>
          )}
          <span className="flex items-center gap-1"><Users size={12} /> {startup.team?.length || 1}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Eye size={12} /> {startup.views || 0}
        </div>
      </div>
    </Link>
  </motion.div>
);

export default StartupCard;
