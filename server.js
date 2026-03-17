<<<<<<< HEAD
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 4000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    
    // Decode the URL to handle spaces and special characters
    let decodedUrl = decodeURIComponent(req.url);
    let filePath = '.' + decodedUrl;
    
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Check if it's a directory request
    fs.stat(filePath, (err, stats) => {
        if (!err && stats && stats.isDirectory()) {
            // List files in directory
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Server Error');
                    return;
                }
                
                let html = '<html><head></head><body>';
                files.forEach(file => {
                    // Add trailing slash for directories
                    const fileStat = fs.statSync(path.join(filePath, file));
                    const href = req.url.endsWith('/') ? req.url + encodeURIComponent(file) : req.url + '/' + encodeURIComponent(file);
                    html += `<a href="${href}">${file}${fileStat.isDirectory() ? '/' : ''}</a><br>`;
                });
                html += '</body></html>';
                
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
        } else {
            const extname = path.extname(filePath);
            let contentType = mimeTypes[extname] || 'application/octet-stream';
            
            // Handle Range requests for seeking in audio/video
            const range = req.headers.range;
            
            if (range) {
                // Parse the Range header
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
                const chunksize = (end - start) + 1;
                
                const fileStream = fs.createReadStream(filePath, { start, end });
                
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': contentType
                });
                
                fileStream.pipe(res);
            } else {
                // No Range request - serve the whole file
                fs.readFile(filePath, (error, content) => {
                    if (error) {
                        console.log(`File not found: ${filePath}`);
                        res.writeHead(404);
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 
                            'Content-Type': contentType,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': stats.size
                        });
                        res.end(content, 'utf-8');
                    }
                });
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
=======
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 4000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    
    // Decode the URL to handle spaces and special characters
    let decodedUrl = decodeURIComponent(req.url);
    let filePath = '.' + decodedUrl;
    
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Check if it's a directory request
    fs.stat(filePath, (err, stats) => {
        if (!err && stats && stats.isDirectory()) {
            // List files in directory
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Server Error');
                    return;
                }
                
                let html = '<html><head></head><body>';
                files.forEach(file => {
                    // Add trailing slash for directories
                    const fileStat = fs.statSync(path.join(filePath, file));
                    const href = req.url.endsWith('/') ? req.url + encodeURIComponent(file) : req.url + '/' + encodeURIComponent(file);
                    html += `<a href="${href}">${file}${fileStat.isDirectory() ? '/' : ''}</a><br>`;
                });
                html += '</body></html>';
                
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
        } else {
            const extname = path.extname(filePath);
            let contentType = mimeTypes[extname] || 'application/octet-stream';
            
            // Handle Range requests for seeking in audio/video
            const range = req.headers.range;
            
            if (range) {
                // Parse the Range header
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
                const chunksize = (end - start) + 1;
                
                const fileStream = fs.createReadStream(filePath, { start, end });
                
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': contentType
                });
                
                fileStream.pipe(res);
            } else {
                // No Range request - serve the whole file
                fs.readFile(filePath, (error, content) => {
                    if (error) {
                        console.log(`File not found: ${filePath}`);
                        res.writeHead(404);
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 
                            'Content-Type': contentType,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': stats.size
                        });
                        res.end(content, 'utf-8');
                    }
                });
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
>>>>>>> 55b4c8412e4d178d299883c902a85a1cbcb3b8a4
