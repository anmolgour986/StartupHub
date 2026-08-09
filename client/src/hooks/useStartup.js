import { useCallback, useEffect, useState } from 'react';
import { startupAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useStartup = (id) => {
  const { user } = useAuth();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await startupAPI.getById(id);
      setStartup(data.startup);
    } catch {
      setStartup(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(Boolean(id));
    reload();
  }, [reload, id]);

  const isFounder = startup ? String(startup.founder._id) === String(user._id) : false;
  const isTeamMember = startup
    ? isFounder || startup.team?.some((t) => String(t.user?._id) === String(user._id))
    : false;

  return { startup, loading, isFounder, isTeamMember, reload, setStartup };
};
