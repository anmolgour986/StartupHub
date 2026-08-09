import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Rocket, Mail, Lock, User, AtSign, Code2, Palette, Briefcase, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'founder', label: 'Founder', desc: 'I have a startup idea', icon: Briefcase },
  { value: 'developer', label: 'Developer', desc: 'I build software', icon: Code2 },
  { value: 'designer', label: 'Designer', desc: 'I design experiences', icon: Palette },
];

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'developer' } });
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const role = watch('role');

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setSkills(skills.filter((sk) => sk !== s));

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ ...data, skills });
      toast.success('Account created! Welcome to StartupHub 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Rocket size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">StartupHub</span>
        </Link>

        <div className="card p-7">
          <h1 className="text-xl font-bold text-center">Create your account</h1>
          <p className="text-sm text-gray-500 text-center mt-1.5 mb-6">Join founders, developers, and designers building together</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`cursor-pointer rounded-xl border p-3 text-center transition-colors ${
                      role === r.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input type="radio" value={r.value} className="hidden" {...register('role')} />
                    <r.icon size={18} className={`mx-auto mb-1 ${role === r.value ? 'text-brand-600' : 'text-gray-400'}`} />
                    <div className="text-xs font-medium">{r.label}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Full name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="input !pl-10" placeholder="Jane Doe" {...register('name', { required: 'Required' })} />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Username</label>
                <div className="relative">
                  <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="input !pl-10" placeholder="janedoe" {...register('username', { required: 'Required' })} />
                </div>
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" className="input !pl-10" placeholder="you@example.com" {...register('email', { required: 'Required' })} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="input !pl-10"
                  placeholder="At least 6 characters"
                  {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Skills</label>
              <div className="input flex flex-wrap gap-1.5 !py-2 min-h-[46px]">
                {skills.map((s) => (
                  <span key={s} className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder={skills.length ? '' : 'Type a skill and press Enter'}
                  className="flex-1 min-w-[100px] outline-none bg-transparent text-sm"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
