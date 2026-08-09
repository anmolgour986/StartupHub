import { Link } from 'react-router-dom';
import { MapPin, Users, Eye, Pencil, Trash2, UserPlus, Info, ClipboardList, KanbanSquare, FolderOpen, Flag, MessageCircle } from 'lucide-react';
import { STATUS_COLORS } from '../../utils/helpers';

const tabDefs = (id, isFounder, isTeamMember) => [
  { to: `/startups/${id}`, label: 'Overview', icon: Info },
  ...(isTeamMember ? [{ to: `/startups/${id}/team`, label: 'Team', icon: Users }] : []),
  ...(isFounder ? [{ to: `/startups/${id}/applications`, label: 'Applications', icon: ClipboardList }] : []),
  ...(isTeamMember ? [{ to: `/startups/${id}/tasks`, label: 'Tasks', icon: KanbanSquare }] : []),
  ...(isTeamMember ? [{ to: `/startups/${id}/files`, label: 'Files', icon: FolderOpen }] : []),
  ...(isTeamMember ? [{ to: `/startups/${id}/milestones`, label: 'Milestones', icon: Flag }] : []),
  ...(isTeamMember ? [{ to: `/startups/${id}/chat`, label: 'Team Chat', icon: MessageCircle }] : []),
];

const StartupHeader = ({ startup, isFounder, isTeamMember, activeTab, onApply, onEdit, onDelete, canApply }) => {
  const tabs = tabDefs(startup._id, isFounder, isTeamMember);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {startup.logo ? (
              <img src={startup.logo} alt={startup.name} className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold">
                {startup.name[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{startup.name}</h1>
                <span className={`badge ${STATUS_COLORS[startup.status]}`}>{startup.status}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{startup.tagline}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 flex-wrap">
                {startup.location && (
                  <span className="flex items-center gap-1"><MapPin size={12} /> {startup.isRemote ? 'Remote' : startup.location}</span>
                )}
                <span className="flex items-center gap-1"><Users size={12} /> {startup.team?.length} team members</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {startup.views} views</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {isFounder ? (
              <>
                <Link to={`/startups/${startup._id}/edit`} className="btn-secondary"><Pencil size={15} /> Edit</Link>
                {onDelete && <button onClick={onDelete} className="btn-danger !px-3"><Trash2 size={15} /></button>}
              </>
            ) : canApply ? (
              <button onClick={onApply} className="btn-primary"><UserPlus size={16} /> Apply to Join</button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto card p-1.5">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === label ? 'bg-brand-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon size={15} /> {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StartupHeader;
