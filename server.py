#!/usr/bin/env python3
"""
Simple HTTP server for PM Standards Hub development
Serves the static files with proper MIME types and CORS headers
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class PMStandardsHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        """Override MIME type guessing for better file handling"""
        mimetype, encoding = super().guess_type(path)
        
        # Ensure proper MIME types for our files
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html'):
            return 'text/html'
        elif path.endswith('.json'):
            return 'application/json'
        elif path.endswith('.md'):
            return 'text/markdown'
        
        return mimetype

def main():
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Configuration
    PORT = 8000
    HOST = 'localhost'
    
    # Check if port is available
    try:
        with socketserver.TCPServer((HOST, PORT), PMStandardsHTTPRequestHandler) as httpd:
            print(f"🚀 PM Standards Hub Development Server")
            print(f"📁 Serving files from: {script_dir}")
            print(f"🌐 Server running at: http://{HOST}:{PORT}")
            print(f"📱 Mobile access: http://{HOST}:{PORT}")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use.")
            print(f"💡 Try a different port or stop the process using port {PORT}")
            sys.exit(1)
        else:
            print(f"❌ Error starting server: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    main()
