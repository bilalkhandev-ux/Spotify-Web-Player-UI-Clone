# Spotify Clone - Web Player

A web-based music player built with vanilla JavaScript, HTML, and CSS. This is a Spotify-like music player that allows you to browse and play songs from your local music library.

## Features

- **Song Library**: Browse songs organized by folders (mood, Arjeet, Diljeet, NCS, Shubh)
- **Music Playback**: Play, pause, and navigate between songs
- **Seekbar**: Click on the progress bar to seek to any position in the song
- **Volume Control**: Adjust volume with the slider
- **Mute/Unmute**: Click the volume icon to mute/unmute
- **Responsive Design**: Works on desktop and mobile devices
- **Album Art**: Displays cover images for each folder
- **Professional UI**: Clean, Spotify-inspired interface

## How to Run

1. Make sure you have Node.js installed
2. Open terminal in the project directory
3. Run the server:
   ```
   node server.js
   ```
4. Open browser and go to:
   ```
   http://127.0.0.1:4000
   ```

## Project Structure

```
Spotify/
├── index.html          # Main HTML file
├── style.css          # Main stylesheet
├── utility.css        # Utility classes
├── script.js         # JavaScript logic
├── server.js         # Node.js server
├── img/              # Images and icons
└── songs/            # Music files
    ├── mood/
    ├── Arjeet/
    ├── Diljeet/
    ├── ncs/
    └── shubh/
```

## Adding Music

1. Create a new folder in the `songs/` directory
2. Add your MP3 files to the folder
3. Add a `cover.png` image for the album
4. Add an `info.json` file with:
   ```json
   {
     "title": "Album Name",
     "description": "Album description"
   }
   ```
5. Refresh the page - your new album will appear automatically

## Technologies Used

- HTML5 Audio API
- Vanilla JavaScript
- CSS3 Flexbox
- Node.js HTTP Server
- Range Requests for audio seeking


=======
# Spotify Clone - Web Player

A web-based music player built with vanilla JavaScript, HTML, and CSS. This is a Spotify-like music player that allows you to browse and play songs from your local music library.

## Features

- **Song Library**: Browse songs organized by folders (mood, Arjeet, Diljeet, NCS, Shubh)
- **Music Playback**: Play, pause, and navigate between songs
- **Seekbar**: Click on the progress bar to seek to any position in the song
- **Volume Control**: Adjust volume with the slider
- **Mute/Unmute**: Click the volume icon to mute/unmute
- **Responsive Design**: Works on desktop and mobile devices
- **Album Art**: Displays cover images for each folder
- **Professional UI**: Clean, Spotify-inspired interface

## How to Run

1. Make sure you have Node.js installed
2. Open terminal in the project directory
3. Run the server:
   ```
   node server.js
   ```
4. Open browser and go to:
   ```
   http://127.0.0.1:4000
   ```

## Project Structure

```
Spotify/
├── index.html          # Main HTML file
├── style.css          # Main stylesheet
├── utility.css        # Utility classes
├── script.js         # JavaScript logic
├── server.js         # Node.js server
├── img/              # Images and icons
└── songs/            # Music files
    ├── mood/
    ├── Arjeet/
    ├── Diljeet/
    ├── ncs/
    └── shubh/
```

## Adding Music

1. Create a new folder in the `songs/` directory
2. Add your MP3 files to the folder
3. Add a `cover.png` image for the album
4. Add an `info.json` file with:
   ```json
   {
     "title": "Album Name",
     "description": "Album description"
   }
   ```
5. Refresh the page - your new album will appear automatically

## Technologies Used

- HTML5 Audio API
- Vanilla JavaScript
- CSS3 Flexbox
- Node.js HTTP Server
- Range Requests for audio seeking

Bilal Afzal

