import { create } from 'zustand';
import type { Track } from '../lib/types';

interface PlayerStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  history: Track[];
  currentPlaylist: Track[] | null;
  currentTrackIndex: number | null;
  setCurrentTrack: (track: Track, playlist?: Track[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToHistory: (track: Track) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  history: [],
  currentPlaylist: null,
  currentTrackIndex: null,

  setCurrentTrack: (track, playlist) => {
    const currentTrack = get().currentTrack;
    if (currentTrack) {
      get().addToHistory(currentTrack);
    }

    if (playlist) {
      const trackIndex = playlist.findIndex(t => t.id === track.id);
      const nextTracks = playlist.slice(trackIndex + 1);
      set({ 
        currentTrack: track,
        currentPlaylist: playlist,
        currentTrackIndex: trackIndex,
        queue: nextTracks
      });
    } else {
      set({ 
        currentTrack: track,
        currentPlaylist: null,
        currentTrackIndex: null 
      });
    }
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  
  removeFromQueue: (trackId) => 
    set((state) => ({ queue: state.queue.filter((t) => t.id !== trackId) })),
  
  clearQueue: () => set({ queue: [] }),

  playNext: () => {
    const { queue, currentTrack, currentPlaylist, currentTrackIndex } = get();
    
    if (currentPlaylist && currentTrackIndex !== null) {
      const nextIndex = currentTrackIndex + 1;
      if (nextIndex < currentPlaylist.length) {
        const nextTrack = currentPlaylist[nextIndex];
        if (currentTrack) {
          get().addToHistory(currentTrack);
        }
        set({ 
          currentTrack: nextTrack,
          currentTrackIndex: nextIndex,
          queue: currentPlaylist.slice(nextIndex + 1)
        });
        return;
      }
    }

    if (queue.length > 0) {
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      if (currentTrack) {
        get().addToHistory(currentTrack);
      }
      set({ currentTrack: nextTrack, queue: newQueue });
    }
  },

  playPrevious: () => {
    const { history, currentTrack, currentPlaylist, currentTrackIndex } = get();
    
    if (currentPlaylist && currentTrackIndex !== null && currentTrackIndex > 0) {
      const previousIndex = currentTrackIndex - 1;
      const previousTrack = currentPlaylist[previousIndex];
      if (currentTrack) {
        set((state) => ({ queue: [currentTrack, ...state.queue] }));
      }
      set({ 
        currentTrack: previousTrack,
        currentTrackIndex: previousIndex,
        queue: currentPlaylist.slice(previousIndex + 1)
      });
      return;
    }

    if (history.length > 0) {
      const previousTrack = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      if (currentTrack) {
        set((state) => ({ queue: [currentTrack, ...state.queue] }));
      }
      set({ currentTrack: previousTrack, history: newHistory });
    }
  },

  addToHistory: (track) => 
    set((state) => ({ history: [...state.history, track] })),
}));