const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url; // URL from client
    if (!videoUrl) {
        return res.status(400).send('Missing video URL');
    }

    // const command = `yt-dlp -f bestvideo+bestaudio --merge-output-format mp4 -o "./downloads/%(title)s.%(ext)s" ${videoUrl}`;
    const command = `yt-dlp --cookies "./cookies.txt" -f bestvideo+bestaudio --merge-output-format mp4 -o "./downloads/%(title)s.%(ext)s" ${videoUrl}`;

    
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
