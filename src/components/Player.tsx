import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Player() {
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<any>(null);
  
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    queue, 
    playNext, 
    playPrevious,
    history 
  } = usePlayerStore();

  useEffect(() => {
    if (playerRef.current && isPlaying) {
      playerRef.current.playVideo();
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentTrack, isPlaying]);

  if (!currentTrack) return null;

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const handleStateChange = (event: any) => {
    const state = event.data;
    
    if (state === 1) { // playing
      setIsPlaying(true);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      progressInterval.current = setInterval(() => {
        if (playerRef.current) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 1000);
    } else if (state === 2) { // paused
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else if (state === 0) { // ended
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      playNext();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(seekTime);
      setCurrentTime(seekTime);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={currentTrack.thumbnail} 
                alt={currentTrack.title} 
                className="w-12 h-12 rounded object-cover"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-medium truncate">{currentTrack.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentTrack.channelTitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={playPrevious}
                disabled={history.length === 0}
                className={`p-2 rounded-full ${
                  history.length === 0 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={togglePlay}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <button 
                onClick={playNext}
                disabled={queue.length === 0}
                className={`p-2 rounded-full ${
                  queue.length === 0 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseInt(e.target.value);
                  setVolume(newVolume);
                  if (playerRef.current) {
                    playerRef.current.setVolume(newVolume);
                  }
                }}
                className="w-24"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <YouTube
          videoId={currentTrack.id}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              playsinline: 1
            },
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          className="hidden"
        />
      </div>
    </div>
  );
}