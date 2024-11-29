const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.get('/download', (req, res) => {
    const videoUrl = req.query.url; // URL from client
    if (!videoUrl) {
        return res.status(400).send('Missing video URL');
    }
    
    const command = `yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 -o "./downloads/%(title)s.%(ext)s" ${videoUrl}`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send('Failed to download video');
        }
        console.log(stdout);
        res.send('Video downloaded successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

async function downloadYouTubeVideo(videoUrl) {
    try {
        const response = await fetch(`/download?url=${encodeURIComponent(videoUrl)}`);
        const message = await response.text();
        if (response.ok) {
            alert(message);
        } else {
            alert('Error: ' + message);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while downloading the video.');
    }
}

// Usage
const videoUrl = 'https://www.youtube.com/watch?v=example';
downloadYouTubeVideo(videoUrl);
