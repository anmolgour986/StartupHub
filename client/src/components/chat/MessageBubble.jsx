import { Paperclip } from 'lucide-react';
import Avatar from '../ui/Avatar';

const MessageBubble = ({ message, isOwn, showAvatar = true }) => (
  <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
    {showAvatar && !isOwn ? <Avatar user={message.sender} size="xs" /> : <div className="w-6" />}
    <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
      {!isOwn && showAvatar && <span className="text-[11px] text-gray-400 mb-0.5 ml-1">{message.sender?.name}</span>}
      <div
        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-snug ${
          isOwn
            ? 'bg-brand-600 text-white rounded-br-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-md'
        }`}
      >
        {message.content}
        {message.attachment?.url && (
          <a href={message.attachment.url} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 mt-1.5 text-xs underline ${isOwn ? 'text-brand-100' : 'text-brand-600'}`}>
            <Paperclip size={12} /> {message.attachment.filename || 'Attachment'}
          </a>
        )}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 mx-1">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  </div>
);

export default MessageBubble;
