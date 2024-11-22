import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import VideoTable from '../components/VideoTable';
import { CHANNELS } from '../lib/constants';

export default function Home() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(CHANNELS[0].id);

  return (
    <div className="flex">
      <Sidebar
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
      />
      <div className="w-full">
        <VideoTable channelId={selectedChannel} />
      </div>
    </div>
  );
}