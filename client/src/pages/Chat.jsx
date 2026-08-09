import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send, MessageSquare } from 'lucide-react';
import { useStartup } from '../hooks/useStartup';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messageAPI, userAPI } from '../services/api';
import { FullPageSpinner } from '../components/ui/Spinner';
import StartupHeader from '../components/startup/StartupHeader';
import MessageBubble from '../components/chat/MessageBubble';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';

const Chat = () => {
  const { id } = useParams(); // startup id, present only for team chat
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const isTeamChat = Boolean(id);

  const { startup, loading: startupLoading, isFounder, isTeamMember } = useStartup(isTeamChat ? id : null);

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Load conversations list (direct chat mode only)
  useEffect(() => {
    if (isTeamChat) return;
    const load = async () => {
      try {
        const { data } = await messageAPI.conversations();
        setConversations(data.conversations);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isTeamChat]);

  // Load message history
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (isTeamChat) {
          const { data } = await messageAPI.team(id);
          setMessages(data.messages);
          socket?.emit('team:join', { startupId: id });
        } else if (activeUser) {
          const { data } = await messageAPI.direct(activeUser._id);
          setMessages(data.messages);
          await messageAPI.markRead(activeUser._id);
          socket?.emit('message:read', { senderId: activeUser._id });
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    if (isTeamChat || activeUser) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, activeUser, socket]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      if (isTeamChat && String(msg.startup) === String(id)) {
        setMessages((prev) => [...prev, msg]);
      } else if (!isTeamChat && activeUser) {
        const otherId = String(msg.sender._id) === String(user._id) ? msg.recipient : msg.sender._id;
        if (String(otherId) === String(activeUser._id)) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    };

    const onTyping = ({ userId, isTyping }) => {
      if (!isTeamChat && activeUser && String(userId) === String(activeUser._id)) {
        setTypingUser(isTyping ? userId : null);
      }
    };

    socket.on('message:new', onNewMessage);
    socket.on('typing:update', onTyping);
    return () => {
      socket.off('message:new', onNewMessage);
      socket.off('typing:update', onTyping);
    };
  }, [socket, isTeamChat, id, activeUser, user._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !socket) return;
    if (isTeamChat) {
      socket.emit('message:team', { startupId: id, content: input.trim() });
    } else if (activeUser) {
      socket.emit('message:direct', { recipientId: activeUser._id, content: input.trim() });
    }
    setInput('');
  };

  const handleTyping = (value) => {
    setInput(value);
    if (!socket || isTeamChat || !activeUser) return;
    socket.emit('typing:start', { recipientId: activeUser._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing:stop', { recipientId: activeUser._id });
    }, 1500);
  };

  const startNewChat = async (query) => {
    if (!query.trim()) return;
    try {
      const { data } = await userAPI.list({ search: query, limit: 5 });
      if (data.users.length) setActiveUser(data.users[0]);
    } catch {
      /* ignore */
    }
  };

  if (isTeamChat && startupLoading) return <FullPageSpinner />;
  if (isTeamChat && !startup) return null;

  return (
    <div className="space-y-6">
      {isTeamChat && <StartupHeader startup={startup} isFounder={isFounder} isTeamMember={isTeamMember} activeTab="Team Chat" />}
      {!isTeamChat && (
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Chat directly with founders and team members.</p>
        </div>
      )}

      <div className={`card p-0 overflow-hidden ${isTeamChat ? '' : 'grid grid-cols-1 md:grid-cols-3'}`} style={{ height: '65vh' }}>
        {!isTeamChat && (
          <div className="border-r border-gray-100 dark:border-gray-800 flex flex-col h-full">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800">
              <input
                placeholder="Search people by name..."
                onKeyDown={(e) => { if (e.key === 'Enter') startNewChat(e.target.value); }}
                className="input !py-2 text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading && conversations.length === 0 ? (
                <div className="p-4 text-sm text-gray-400">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-sm text-gray-400">No conversations yet. Search for someone to start chatting.</div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.user._id}
                    onClick={() => setActiveUser(c.user)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      activeUser?._id === c.user._id ? 'bg-brand-50 dark:bg-brand-500/10' : ''
                    }`}
                  >
                    <Avatar user={c.user} size="sm" online={onlineUsers.has(String(c.user._id))} />
                    <div className="min-w-0 text-left flex-1">
                      <p className="text-sm font-medium truncate">{c.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className={`flex flex-col h-full ${isTeamChat ? '' : 'md:col-span-2'}`}>
          {!isTeamChat && !activeUser ? (
            <EmptyState icon={MessageSquare} title="Select a conversation" description="Choose someone from the left, or search to start a new chat." />
          ) : (
            <>
              {!isTeamChat && activeUser && (
                <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <Avatar user={activeUser} size="sm" online={onlineUsers.has(String(activeUser._id))} />
                  <div>
                    <p className="text-sm font-medium">{activeUser.name}</p>
                    <p className="text-xs text-gray-400">{typingUser ? 'typing...' : onlineUsers.has(String(activeUser._id)) ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  <p className="text-sm text-gray-400">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center mt-10">No messages yet. Say hello 👋</p>
                ) : (
                  messages.map((m, i) => (
                    <MessageBubble
                      key={m._id || i}
                      message={m}
                      isOwn={String(m.sender._id || m.sender) === String(user._id)}
                    />
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                  placeholder="Type a message..."
                  className="input !py-2.5 flex-1"
                />
                <button onClick={send} className="btn-primary !px-3.5">
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
