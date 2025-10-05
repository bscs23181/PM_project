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
        mimetype = super().guess_type(path)
        
        # Ensure proper MIME types for our files
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html') or path.endswith('.htm'):
            return 'text/html'
        elif path.endswith('.json'):
            return 'application/json'
        elif path.endswith('.md'):
            return 'text/markdown'
        
        return mimetype
    
    def do_GET(self):
        """Override to handle specific routes"""
        path = self.path.split('?')[0]  # Remove query parameters
        
        # Handle specific routes
        if path == '/':
            self.path = '/index.html'
        elif path == '/books':
            self.path = '/book_browser.html'
        elif path == '/api/topics':
            self._serve_topics_api()
            return
        elif path.startswith('/topic/'):
            self._serve_topic_page(path)
            return
        
        # Call parent method for normal file serving
        super().do_GET()
    
    def _serve_topics_api(self):
        """Serve topic data as JSON API"""
        try:
            # Try to read the analysis results
            analysis_file = Path('book_analysis_results.json')
            if analysis_file.exists():
                with open(analysis_file, 'r', encoding='utf-8') as f:
                    data = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(data.encode('utf-8'))
            else:
                self.send_error(404, "Book analysis results not found")
        except Exception as e:
            self.send_error(500, f"Error serving topics: {str(e)}")
    
    def _serve_topic_page(self, path):
        """Serve individual topic content pages"""
        try:
            # Extract topic name from path
            topic_name = path.replace('/topic/', '').replace('_', ' ').title()
            
            # Read the template
            template_file = Path('topic_content_template.html')
            if not template_file.exists():
                self.send_error(404, "Topic template not found")
                return
            
            with open(template_file, 'r', encoding='utf-8') as f:
                template_content = f.read()
            
            # Read the analysis data
            analysis_file = Path('book_analysis_results.json')
            if not analysis_file.exists():
                self.send_error(404, "Book analysis results not found")
                return
            
            with open(analysis_file, 'r', encoding='utf-8') as f:
                analysis_data = f.read()
            
            # Replace placeholders in template
            html_content = template_content.replace('{TOPIC_NAME}', topic_name).replace('{TOPIC_DATA}', analysis_data)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html_content.encode('utf-8'))
            
        except Exception as e:
            self.send_error(500, f"Error serving topic page: {str(e)}")

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
            print(f"PM Standards Hub Development Server")
            print(f"Serving files from: {script_dir}")
            print(f"Server running at: http://{HOST}:{PORT}")
            print(f"Mobile access: http://{HOST}:{PORT}")
            print(f"Press Ctrl+C to stop the server")
            print("-" * 50)
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"ERROR: Port {PORT} is already in use.")
            print(f"Tip: Try a different port or stop the process using port {PORT}")
            sys.exit(1)
        else:
            print(f"ERROR: Error starting server: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print(f"\nServer stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    main()
