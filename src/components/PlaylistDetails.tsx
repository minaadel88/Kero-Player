import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Play, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updatePlaylist, removeTrackFromPlaylist } from '../lib/playlistService';
import { usePlayerStore } from '../stores/playerStore';
import type { Track, Playlist } from '../lib/types';

interface PlaylistDetailsProps {
  playlist: Playlist;
  onClose: () => void;
}

export default function PlaylistDetails({ playlist, onClose }: PlaylistDetailsProps) {
  const [tracks, setTracks] = useState<Track[]>(playlist.tracks || []);
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const queryClient = useQueryClient();

  const updatePlaylistMutation = useMutation({
    mutationFn: async (newTracks: Track[]) => {
      await updatePlaylist(playlist.id, { tracks: newTracks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Playlist updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update playlist');
      // Revert tracks to original state
      setTracks(playlist.tracks || []);
    }
  });

  const removeTrackMutation = useMutation({
    mutationFn: async ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
      await removeTrackFromPlaylist(playlistId, trackId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Track removed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove track');
    }
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tracks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTracks(items);
    updatePlaylistMutation.mutate(items);
  };

  const handleRemoveTrack = (trackId: string) => {
    removeTrackMutation.mutate({ playlistId: playlist.id, trackId });
    setTracks(tracks.filter(track => track.id !== trackId));
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track, tracks);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{playlist.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tracks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {tracks.map((track, index) => (
                    <Draggable
                      key={track.id}
                      draggableId={track.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-gray-700 rounded-lg p-3 flex items-center space-x-3"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          >
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <img
                            src={track.thumbnail}
                            alt={track.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{track.title}</h3>
                            <p className="text-sm text-gray-400 truncate">
                              {track.channelTitle}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePlayTrack(track)}
                              className="p-2 hover:bg-gray-600 rounded-full"
                            >
                              <Play className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRemoveTrack(track.id)}
                              className="p-2 hover:bg-gray-600 rounded-full"
                            >
                              <Trash2 className="w-5 h-5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}