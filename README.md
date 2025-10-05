# PM Standards Book Browser

A web application that organizes project management books by topics and allows comparison of similar texts across different standards.

## Features

- **Topic Organization**: Automatically extracts and categorizes content from PM books
- **Book Comparison**: Compare how different standards (PMBOK, PRINCE2, ISO) handle the same topics
- **Column Layout**: View texts from all books side-by-side for easy comparison
- **Interactive Browsing**: Click topics to explore detailed content comparisons

## Dependencies

### Python Requirements
- Python 3.7 or higher
- PyPDF2 library for PDF text extraction

### Installation

1. **Install Python** (if not already installed):
   - Download from [python.org](https://www.python.org/downloads/)
   - Make sure to check "Add Python to PATH" during installation

2. **Install PDF Library**:
   ```bash
   pip install PyPDF2
   ```
   Or using the requirements file:
   ```bash
   pip install -r requirements.txt
   ```

## Quick Start

### 1. Run the Application

**Option A - Command Line**:
```bash
python server.py
```

**Option B - Easy Startup**:
- **Windows**: Double-click `run.bat`
- **Linux/Mac**: Run `./run.sh`

### 2. Access the Application
- **Main Hub**: Open `http://localhost:8000` in your browser
- **Book Topics**: Go to `http://localhost:8000/books` for direct access

### 3. Explore Topics
- Click on any topic card to view detailed comparisons
- Click "View Related Texts" to see content in column format
- Compare how different books handle the same concepts

## Included Books

The application works with these project management standards:
- **ISO 21500-2021** - Project, programme and portfolio management
- **ISO 21502-2020** - Guidance on project management  
- **PRINCE2 2015** - Managing Successful Projects with PRINCE2®
- **PMBOK Guide 7th Edition** - Project Management Body of Knowledge

## Topics Covered

The system automatically organizes content into these topics:
- Risk Management
- Stakeholder Management
- Quality Management
- Scope Management
- Time Management
- Cost Management
- Project Lifecycle
- Team Management
- Change Management

## How It Works

1. **PDF Analysis**: `book_analyzer.py` extracts text from PDFs in the `Book/` folder
2. **Topic Extraction**: Automatically identifies chapters and categorizes by topic keywords
3. **Web Interface**: Browser-based application for exploring organized content
4. **Column Comparison**: Side-by-side comparison of how different standards approach topics

## Files Overview

```
PM_project-main/
├── Book/                           # PDF books folder
├── book_analysis_results.json      # Generated analysis data
├── book_analyzer.py                # PDF text extraction script
├── book_browser.html              # Main topics browser interface
├── index.html                     # Main application homepage
├── server.py                     # Web server
├── script.js                     # Application functionality
├── styles.css                    # Application styling
├── topic_content_template.html   # Template for topic pages
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
netstat -ano | findstr :8000
# Kill existing Python processes
taskkill /PID [PID_NUMBER] /F
```

**Missing Dependencies**:
```bash
pip install PyPDF2
```

**Server Not Responding**:
- Make sure `book_analysis_results.json` exists
- Run `python book_analyzer.py` to generate analysis data
- Restart the server

### Windows Users
If you encounter Unicode errors, the server includes fix for Windows console encoding issues.

## Notes

- The application automatically analyzes PDFs on first run
- Analysis results are stored in `book_analysis_results.json`
- The web server runs on port 8000 by default
- All book content is extracted and organized by topic automatically