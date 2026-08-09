import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Rocket,
  Users,
  Kanban,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Search,
  Handshake,
  Hammer,
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { startupAPI } from '../services/api';
import { STATUS_COLORS } from '../utils/helpers';
import { SkeletonGrid } from '../components/ui/Skeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  { icon: Rocket, title: 'Post your startup idea', desc: 'Share your vision, define the skills you need, and attract the right collaborators.' },
  { icon: Users, title: 'Build your dream team', desc: 'Review applications, chat with candidates, and bring on developers and designers you trust.' },
  { icon: Kanban, title: 'Manage work visually', desc: 'A kanban board with drag-and-drop keeps everyone aligned on what to build next.' },
  { icon: MessageCircle, title: 'Real-time collaboration', desc: 'Team chat, file sharing, and live notifications keep your team in sync.' },
  { icon: ShieldCheck, title: 'Role-based access', desc: 'Founders, developers, and designers each get a tailored experience.' },
  { icon: Sparkles, title: 'Track milestones', desc: 'Set goals, visualize progress, and celebrate wins together.' },
];

const steps = [
  { icon: Rocket, title: 'Post your idea', desc: 'Founders create a startup profile with the skills and roles they need.' },
  { icon: Search, title: 'Discover & apply', desc: 'Developers and designers browse startups and apply to the ones that excite them.' },
  { icon: Handshake, title: 'Get accepted', desc: 'Founders review applications and welcome new members to the team.' },
  { icon: Hammer, title: 'Build together', desc: 'Manage tasks, chat, share files, and hit milestones as a team.' },
];

const Landing = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ startups: 0, builders: 0, tasks: 0 });

  useEffect(() => {
    startupAPI
      .list({ limit: 3, sort: '-views' })
      .then(({ data }) => {
        setStartups(data.startups);
        setStats({
          startups: data.pagination.total,
          builders: data.startups.reduce((acc, s) => acc + (s.team?.length || 1), 0) * 7,
          tasks: data.pagination.total * 14,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white dark:from-brand-950/40 dark:via-gray-950 dark:to-gray-950" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-300/30 blur-3xl -z-10" />
        <div className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-purple-300/20 blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-20 pb-24 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 px-4 py-1.5 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <Sparkles size={14} className="text-brand-600" />
            Where startup teams come together
          </motion.div>

          <motion.h1 initial="hidden" animate="show" variants={fadeUp} transition={{ delay: 0.05 }} className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Build your startup <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">with the right team</span>
          </motion.h1>

          <motion.p initial="hidden" animate="show" variants={fadeUp} transition={{ delay: 0.1 }} className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            StartupHub connects founders with developers and designers ready to build. Post your idea, find your co-founders, and ship your product together — all in one place.
          </motion.p>

          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ delay: 0.15 }} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary px-6 py-3 text-base group">
              Start building free
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/register" className="btn-secondary px-6 py-3 text-base">
              <UserPlus size={18} />
              Join as a builder
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-5 lg:px-8 -mt-8 mb-16">
        <div className="card grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 py-6">
          {[
            { label: 'Active startups', value: stats.startups || '—' },
            { label: 'Builders on platform', value: stats.builders || '—' },
            { label: 'Tasks shipped', value: stats.tasks || '—' },
          ].map((s) => (
            <div key={s.label} className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-5 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to build together</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">From idea to shipped product, StartupHub gives your team the tools to move fast.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card p-6 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 dark:bg-gray-900/40 py-20">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">Four simple steps from idea to shipped product.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative"
              >
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-soft flex items-center justify-center mb-4">
                  <s.icon size={20} className="text-brand-600" />
                </div>
                <div className="text-xs font-semibold text-brand-600 mb-1">STEP {i + 1}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured startups */}
      <section id="startups" className="max-w-6xl mx-auto px-5 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured startups</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Teams actively looking for their next builder.</p>
          </div>
          <Link to="/register" className="text-sm font-medium text-brand-600 hover:underline hidden sm:flex items-center gap-1">
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={3} />
        ) : startups.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">No startups yet — be the first to post one!</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {startups.map((s) => (
              <Link key={s._id} to="/register" className="card p-6 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 block">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {s.name[0]}
                  </div>
                  <span className={`badge ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{s.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{s.tagline}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {s.requiredSkills?.slice(0, 3).map((sk) => (
                    <span key={sk} className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{sk}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-purple-700 px-8 py-16 text-center">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-14 -left-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight relative">Ready to build something great?</h2>
          <p className="mt-4 text-brand-100 max-w-xl mx-auto relative">Join founders, developers, and designers already building their next startup on StartupHub.</p>
          <Link to="/register" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 mt-8 px-6 py-3 text-base relative inline-flex">
            Get started for free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
