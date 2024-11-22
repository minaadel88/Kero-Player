Kero Player 🎵
Kero Player is a modern audio streaming application built with Vite.js. It leverages the YouTube API to fetch and play audio from specific channels, providing users with a sleek and simple interface for enjoying their favorite tracks.

🚀 Features
Audio Streaming: Fetches audio from YouTube videos using specific channel IDs.
Playlist Management: Users can browse playlists by singers or channel names.
User Authentication: Create an account or log in to save your own playlists (Firebase Auth).
Custom Playlists: Create, name, and save your favorite playlists using Firebase Firestore.
Continuous Playback: Automatically play the next track when the current one finishes.
🛠️ Tech Stack
Frontend: Vite.js, React, TypeScript
Backend: Firebase Authentication and Firestore
APIs: YouTube Data API v3
Hosting: Vercel
📦 Setup and Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/kero-player.git
cd kero-player
Install dependencies:

bash
Copy code
npm install
Set up environment variables:
Create a .env file in the root directory and add the following:

env
Copy code
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_YOUTUBE_API_KEY=your_youtube_api_key
Start the development server:

bash
Copy code
npm run dev
Open your browser and visit http://localhost:5173.

📖 Usage
Browse Playlists: Click on a singer or channel to see their playlists.
Create Playlists: Log in to your account to save custom playlists.
Stream Audio: Select a track to start listening. Enjoy continuous playback without interruptions!
🤝 Contributing
Contributions are welcome!
Feel free to open issues or submit pull requests to improve the project.

Fork the repository.
Create a new branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m 'Add a feature').
Push to the branch (git push origin feature/YourFeature).
Open a pull request.
📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

🌟 Acknowledgements
Vite.js
YouTube API
Firebase
