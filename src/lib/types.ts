export interface Track {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
}