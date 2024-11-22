import { 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, playlistsCollection } from './firebase';
import type { Track, Playlist } from './types';

export const getUserPlaylists = async (userId: string): Promise<Playlist[]> => {
  try {
    const q = query(playlistsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Playlist[];
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw new Error('Failed to fetch playlists');
  }
};

export const createPlaylist = async (userId: string, name: string) => {
  try {
    const newPlaylist = {
      name,
      userId,
      tracks: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    return await addDoc(playlistsCollection, newPlaylist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw new Error('Failed to create playlist');
  }
};

export const updatePlaylist = async (playlistId: string, data: Partial<Playlist>) => {
  try {
    const playlistRef = doc(db, 'playlists', playlistId);
    await updateDoc(playlistRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw new Error('Failed to update playlist');
  }
};

export const deletePlaylist = async (playlistId: string) => {
  try {
    const playlistRef = doc(db, 'playlists', playlistId);
    await deleteDoc(playlistRef);
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw new Error('Failed to delete playlist');
  }
};

export const addTrackToPlaylist = async (playlistId: string, track: Track) => {
  try {
    const playlistRef = doc(db, 'playlists', playlistId);
    const playlistDoc = await getDoc(playlistRef);

    if (!playlistDoc.exists()) {
      throw new Error('Playlist not found');
    }

    const playlist = playlistDoc.data();
    const currentTracks = playlist.tracks || [];

    // Check if track already exists
    if (currentTracks.some((t: Track) => t.id === track.id)) {
      throw new Error('Track already exists in playlist');
    }

    // Update playlist with new track
    await updateDoc(playlistRef, {
      tracks: [...currentTracks, track],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    throw new Error('Failed to add track to playlist');
  }
};

export const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
  try {
    const playlistRef = doc(db, 'playlists', playlistId);
    const playlistDoc = await getDoc(playlistRef);

    if (!playlistDoc.exists()) {
      throw new Error('Playlist not found');
    }

    const playlist = playlistDoc.data();
    const currentTracks = playlist.tracks || [];

    // Remove track from playlist
    await updateDoc(playlistRef, {
      tracks: currentTracks.filter((track: Track) => track.id !== trackId),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    throw new Error('Failed to remove track from playlist');
  }
};