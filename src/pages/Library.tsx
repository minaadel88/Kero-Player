import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, Plus, Trash2, List } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usePlayerStore } from '../stores/playerStore';
import { toast } from 'react-hot-toast';
import { getUserPlaylists, createPlaylist, deletePlaylist } from '../lib/playlistService';
import PlaylistDetails from '../components/PlaylistDetails';
import type { Playlist } from '../lib/types';

export default function Library() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const user = useAuthStore((state) => state.user);
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const queryClient = useQueryClient();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists', user?.uid],
    queryFn: () => user ? getUserPlaylists(user.uid) : Promise.resolve([]),
    enabled: !!user,
  });

  const createPlaylistMutation = useMutation({
    mutationFn: (name: string) => {
      if (!user) throw new Error('User not authenticated');
      return createPlaylist(user.uid, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      setShowCreateModal(false);
      setNewPlaylistName('');
      toast.success('Playlist created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create playlist');
    }
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Playlist deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete playlist');
    }
  });

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylistMutation.mutate(newPlaylistName.trim());
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks?.length > 0) {
      setCurrentTrack(playlist.tracks[0], playlist.tracks);
      setIsPlaying(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Create Playlist</span>
        </button>
      </div>

      {playlists?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No playlists yet</h2>
          <p className="text-gray-400">Create your first playlist to start organizing your music</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists?.map((playlist: Playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{playlist.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setSelectedPlaylist(playlist)}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="View details"
                    >
                      <List className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                    <button
                      onClick={() => deletePlaylistMutation.mutate(playlist.id)}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="Delete playlist"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {playlist.tracks?.length || 0} tracks
                </p>
                {playlist.tracks?.length > 0 && (
                  <button
                    onClick={() => handlePlayPlaylist(playlist)}
                    className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
            <form onSubmit={handleCreatePlaylist}>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPlaylist && (
        <PlaylistDetails
          playlist={selectedPlaylist}
          onClose={() => setSelectedPlaylist(null)}
        />
      )}
    </div>
  );
}