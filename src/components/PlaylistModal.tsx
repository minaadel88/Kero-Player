import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { getUserPlaylists, addTrackToPlaylist } from '../lib/playlistService';
import type { Track } from '../lib/types';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
}

export default function PlaylistModal({ isOpen, onClose, track }: PlaylistModalProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists', user?.uid],
    queryFn: () => user ? getUserPlaylists(user.uid) : Promise.resolve([]),
    enabled: !!user,
  });

  const addToPlaylistMutation = useMutation({
    mutationFn: async (playlistId: string) => {
      if (!user) throw new Error('User not authenticated');
      await addTrackToPlaylist(playlistId, track);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Track added to playlist!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add track to playlist');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-700 rounded"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Add to Playlist</h2>
        
        <div className="mb-4">
          <div className="flex items-center space-x-3 p-2 bg-gray-700 rounded">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-12 h-12 rounded"
            />
            <div>
              <h3 className="font-medium line-clamp-1">{track.title}</h3>
              <p className="text-sm text-gray-400">{track.channelTitle}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : playlists?.length === 0 ? (
          <p className="text-center text-gray-400 py-4">
            No playlists found. Create a playlist first.
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {playlists?.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => addToPlaylistMutation.mutate(playlist.id)}
                className="w-full text-left p-3 rounded hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium">{playlist.name}</h3>
                <p className="text-sm text-gray-400">
                  {playlist.tracks?.length || 0} tracks
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}