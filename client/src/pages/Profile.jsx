import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { X, Github, Linkedin, Globe, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Avatar from '../components/ui/Avatar';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      bio: user.bio || '',
      github: user.github || '',
      linkedin: user.linkedin || '',
      portfolio: user.portfolio || '',
      location: user.location || '',
      experience: user.experience || '',
      avatar: user.avatar || '',
    },
  });
  const [skills, setSkills] = useState(user.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) setSkills([...skills, v]);
    setSkillInput('');
  };

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      const { data } = await userAPI.updateProfile({ ...formData, skills });
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage how you appear to founders and teammates.</p>
      </div>

      <div className="card p-6 flex items-center gap-4">
        <Avatar user={user} size="xl" />
        <div>
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-sm text-gray-400">@{user.username} · {user.email}</p>
          <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 capitalize mt-2 inline-flex">{user.role}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Full Name</label>
            <input className="input" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Avatar URL</label>
            <input className="input" placeholder="https://..." {...register('avatar')} />
          </div>
        </div>

        <div>
          <label className="label">Bio</label>
          <textarea rows={3} maxLength={500} className="input" placeholder="Tell people about yourself" {...register('bio')} />
        </div>

        <div>
          <label className="label">Skills</label>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="e.g. React (press Enter)"
              className="input"
            />
            <button type="button" onClick={addSkill} className="btn-secondary shrink-0">Add</button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {skills.map((s) => (
                <span key={s} className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label flex items-center gap-1.5"><MapPin size={13} /> Location</label>
            <input className="input" placeholder="City, Country" {...register('location')} />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Briefcase size={13} /> Experience</label>
            <input className="input" placeholder="e.g. 5 years full-stack" {...register('experience')} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="label flex items-center gap-1.5"><Github size={13} /> GitHub</label>
            <input className="input" placeholder="https://github.com/..." {...register('github')} />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Linkedin size={13} /> LinkedIn</label>
            <input className="input" placeholder="https://linkedin.com/in/..." {...register('linkedin')} />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Globe size={13} /> Portfolio</label>
            <input className="input" placeholder="https://..." {...register('portfolio')} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
};

export default Profile;
