import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { X, Rocket } from 'lucide-react';
import { startupAPI } from '../services/api';
import { FullPageSpinner } from '../components/ui/Spinner';

const CATEGORIES = ['SaaS', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'AI/ML', 'Gaming', 'Social', 'Other'];
const STATUSES = ['idea', 'building', 'launched', 'scaling', 'closed'];

const TagInput = ({ label, values, onChange, placeholder }) => {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="input"
        />
        <button type="button" onClick={add} className="btn-secondary shrink-0">Add</button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {values.map((v) => (
            <span key={v} className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateEditStartup = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [skills, setSkills] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const { data } = await startupAPI.getById(id);
        const s = data.startup;
        ['name', 'tagline', 'description', 'category', 'teamSize', 'location', 'isRemote', 'status', 'logo', 'banner'].forEach((f) =>
          setValue(f, s[f])
        );
        setSkills(s.requiredSkills || []);
        setTags(s.tags || []);
      } catch {
        toast.error('Failed to load startup');
        navigate('/my-startups');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, navigate, setValue]);

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        teamSize: Number(formData.teamSize) || 1,
        isRemote: formData.isRemote === 'true' || formData.isRemote === true,
        requiredSkills: skills,
        tags,
      };
      if (isEdit) {
        await startupAPI.update(id, payload);
        toast.success('Startup updated');
        navigate(`/startups/${id}`);
      } else {
        const { data } = await startupAPI.create(payload);
        toast.success('Startup created!');
        navigate(`/startups/${data.startup._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FullPageSpinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
          <Rocket size={20} className="text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? 'Edit Startup' : 'Create a Startup'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tell the world what you're building.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div>
          <label className="label">Startup Name</label>
          <input className="input" placeholder="e.g. FlowBoard" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Tagline</label>
          <input className="input" placeholder="A one-line pitch (max 150 chars)" maxLength={150} {...register('tagline', { required: 'Tagline is required' })} />
          {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea rows={5} className="input" placeholder="What are you building, and why?" {...register('description', { required: 'Description is required' })} />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Category</label>
            <select className="input" {...register('category', { required: true })}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" {...register('status')}>
              {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="label">Team Size</label>
            <input type="number" min={1} className="input" {...register('teamSize')} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" placeholder="e.g. San Francisco, CA" {...register('location')} />
          </div>
          <div>
            <label className="label">Work style</label>
            <select className="input" {...register('isRemote')}>
              <option value="true">Remote</option>
              <option value="false">On-site</option>
            </select>
          </div>
        </div>

        <TagInput label="Required Skills" values={skills} onChange={setSkills} placeholder="e.g. React (press Enter)" />
        <TagInput label="Tags" values={tags} onChange={setTags} placeholder="e.g. productivity (press Enter)" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Logo URL (optional)</label>
            <input className="input" placeholder="https://..." {...register('logo')} />
          </div>
          <div>
            <label className="label">Banner URL (optional)</label>
            <input className="input" placeholder="https://..." {...register('banner')} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Startup'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditStartup;
