// VideoTable.js
import { useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import { useAuthStore } from '../stores/authStore';
import PlaylistModal from './PlaylistModal';
import { CHANNELS } from '../lib/constants';

interface VideoTableProps {
  channelId: string | null;
}

export default function VideoTable({ channelId }: VideoTableProps) {
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const selectedChannel = CHANNELS.find(channel => channel.id === channelId);
  const videos = selectedChannel?.videos || [];

  const handleAddToPlaylist = (video: any) => {
    if (!isAuthenticated) return;
    setSelectedTrack({
      id: video.id,
      title: video.title,
      channelTitle: selectedChannel?.name,
      thumbnail: video.thumbnail,
    });
  };

  if (!channelId) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-500">
        Select an artist from the sidebar to view their tracks
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="w-full md:table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 md:w-12">#</th>
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4 md:w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr
                key={video.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="py-3 px-4 md:w-12">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded md:w-24 md:h-16"
                    />
                    <div>
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedChannel?.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 md:w-32">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setCurrentTrack({
                          id: video.id,
                          title: video.title,
                          channelTitle: selectedChannel?.name,
                          thumbnail: video.thumbnail,
                        });
                        setIsPlaying(true);
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                      title="Play"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                    {isAuthenticated && (
                      <button
                        onClick={() => handleAddToPlaylist(video)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                        title="Add to playlist"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTrack && (
        <PlaylistModal
          isOpen={!!selectedTrack}
          onClose={() => setSelectedTrack(null)}
          track={selectedTrack}
        />
      )}
    </div>
  );
}
