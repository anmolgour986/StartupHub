import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload, FileText, Image as ImageIcon, FileArchive, Trash2, Download, FolderOpen } from 'lucide-react';
import { useStartup } from '../hooks/useStartup';
import { fileAPI } from '../services/api';
import { FullPageSpinner } from '../components/ui/Spinner';
import StartupHeader from '../components/startup/StartupHeader';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Avatar from '../components/ui/Avatar';
import { formatFileSize, formatRelativeTime } from '../utils/helpers';

const iconFor = (mimeType = '') => {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.includes('zip')) return FileArchive;
  return FileText;
};

const Files = () => {
  const { id } = useParams();
  const { startup, loading: startupLoading, isFounder, isTeamMember } = useStartup(id);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const inputRef = useRef(null);

  const loadFiles = async () => {
    try {
      const { data } = await fileAPI.list(id);
      setFiles(data.files);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fileAPI.upload(id, formData);
      toast.success('File uploaded');
      loadFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDelete = async () => {
    try {
      await fileAPI.remove(deleteTarget._id);
      toast.success('File deleted');
      setDeleteTarget(null);
      loadFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete file');
    }
  };

  if (startupLoading) return <FullPageSpinner />;
  if (!startup) return null;

  return (
    <div className="space-y-6">
      <StartupHeader startup={startup} isFounder={isFounder} isTeamMember={isTeamMember} activeTab="Files" />

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Shared Files</h2>
        <label className="btn-primary cursor-pointer">
          <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload File'}
          <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,.pdf,.doc,.docx,.zip" />
        </label>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading files...</div>
      ) : files.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No files yet" description="Upload images, PDFs, docs, or zip files to share with your team." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => {
            const Icon = iconFor(file.mimeType);
            return (
              <div key={file._id} className="card p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.originalName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(file.size)} · {formatRelativeTime(file.createdAt)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar user={file.uploadedBy} size="xs" />
                    <span className="text-xs text-gray-400">{file.uploadedBy?.name}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <a href={file.url} download target="_blank" rel="noreferrer" className="btn-ghost !p-1.5 rounded-lg"><Download size={14} /></a>
                  <button onClick={() => setDeleteTarget(file)} className="btn-ghost !p-1.5 rounded-lg text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete this file?"
        description={`"${deleteTarget?.originalName}" will be permanently removed.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default Files;
