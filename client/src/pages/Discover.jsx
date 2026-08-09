import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Compass } from 'lucide-react';
import { startupAPI } from '../services/api';
import StartupCard from '../components/startup/StartupCard';
import { SkeletonGrid } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const CATEGORIES = ['SaaS', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'AI/ML', 'Gaming', 'Social', 'Other'];
const STATUSES = ['idea', 'building', 'launched', 'scaling', 'closed'];

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [remote, setRemote] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await startupAPI.list({
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        remote: remote || undefined,
        sort,
        page,
        limit: 9,
      });
      setStartups(data.startups);
      setPagination(data.pagination);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [search, category, status, remote, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setSearchParams(search ? { search } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const clearFilters = () => {
    setCategory('');
    setStatus('');
    setRemote('');
    setSort('-createdAt');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Discover Startups</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Find a project that matches your skills and interests.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, tagline, tags..."
            className="input !pl-10"
          />
        </div>
        <button onClick={() => setShowFilters((s) => !s)} className="btn-secondary">
          <SlidersHorizontal size={16} /> Filters
        </button>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input sm:w-48">
          <option value="-createdAt">Newest first</option>
          <option value="-views">Most viewed</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {showFilters && (
        <div className="card p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="label">Category</label>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="input">
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input">
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Work style</label>
            <select value={remote} onChange={(e) => { setRemote(e.target.value); setPage(1); }} className="input">
              <option value="">Any</option>
              <option value="true">Remote</option>
              <option value="false">On-site</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={clearFilters} className="btn-ghost w-full justify-center">Clear filters</button>
          </div>
        </div>
      )}

      {loading ? (
        <SkeletonGrid count={9} />
      ) : startups.length === 0 ? (
        <EmptyState icon={Compass} title="No startups found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {startups.map((s, i) => <StartupCard key={s._id} startup={s} index={i} />)}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    page === i + 1 ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Discover;
