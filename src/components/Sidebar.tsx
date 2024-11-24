import { Music } from 'lucide-react';
import { CHANNELS } from '../lib/constants';

interface SidebarProps {
  selectedChannel: string | null;
  onChannelSelect: (channelId: string) => void;
}

export default function Sidebar({ selectedChannel, onChannelSelect }: SidebarProps) {
  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 h-[calc(100vh-4rem)] fixed left-0 top-16 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Artists</h2>
      <div className="space-y-2">
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onChannelSelect(channel.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              selectedChannel === channel.id
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Music className="w-5 h-5" />
            <span className="text-right flex-1">{channel.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
