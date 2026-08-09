import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Are you sure?', description, confirmText = 'Confirm', danger = true, loading }) => (
  <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
    <div className="flex flex-col items-center text-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${danger ? 'bg-red-100 dark:bg-red-500/10' : 'bg-brand-100 dark:bg-brand-500/10'}`}>
        <AlertTriangle size={22} className={danger ? 'text-red-600' : 'text-brand-600'} />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{description}</p>}
      <div className="flex gap-3 w-full mt-6">
        <button className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
        <button className={danger ? 'btn-danger flex-1' : 'btn-primary flex-1'} onClick={onConfirm} disabled={loading}>
          {loading ? 'Please wait...' : confirmText}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
