#!/usr/bin/env python3
"""
Book Analyzer for PM Standards Hub
Extracts content from PDF books and organizes them by topics
Written in simple, readable style - no one-liners
"""

import os
import json
import PyPDF2
import re
from pathlib import Path

class BookAnalyzer:
    def __init__(self, book_folder="Book"):
        """
        Initialize the book analyzer
        """
        self.book_folder = Path(book_folder)
        self.processed_books = {}
        self.topics_database = {}
        
    def get_pdf_files(self):
        """
        Get all PDF files from the book folder
        Returns a list of PDF file paths
        """
        pdf_files = []
        
        if not self.book_folder.exists():
            print(f"Error: Book folder '{self.book_folder}' not found!")
            return pdf_files
            
        for file_path in self.book_folder.iterdir():
            if file_path.is_file() and file_path.suffix.lower() == '.pdf':
                pdf_files.append(file_path)
                
        return pdf_files
    
    def extract_text_from_pdf(self, pdf_path):
        """
        Extract text from a PDF file
        Returns the text content as a string
        """
        text_content = ""
        
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                safe_name = pdf_path.name.encode('ascii', errors='replace').decode('ascii')
                print(f"Processing PDF: {safe_name}")
                print(f"Number of pages: {len(pdf_reader.pages)}")
                
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    page_text = page.extract_text()
                    text_content = text_content + " " + page_text
                    
                    # Show progress every 50 pages
                    if page_num % 50 == 0 and page_num > 0:
                        print(f"Processed {page_num} pages...")
                
        except Exception as e:
            safe_name = pdf_path.name.encode('ascii', errors='replace').decode('ascii')
            print(f"Error reading PDF {safe_name}: {e}")
            return ""
            
        return text_content
    
    def identify_chapters_and_sections(self, text_content, book_name):
        """
        Identify chapters and sections in the text
        Returns a dictionary with chapter information
        """
        chapters = {}
        
        # Common patterns for chapter headings
        chapter_patterns = [
            r'Chapter\s+(\d+)[:\s]*(.+)',
            r'SECTION\s+(\d+)[:\s]*(.+)',
            r'Part\s+(\d+)[:\s]*(.+)',
            r'(\d+)\.[\s]*([A-Z][^.]*\.?[^.]*\.?)',
            r'(\d+)\s+([A-Z][^.]{10,})'
        ]
        
        lines = text_content.split('\n')
        
        current_chapter = None
        chapter_content = []
        
        for line_num, line in enumerate(lines):
            line = line.strip()
            
            if not line:
                continue
                
            for pattern in chapter_patterns:
                match = re.match(pattern, line, re.IGNORECASE)
                if match:
                    # Found a new chapter
                    if current_chapter and chapter_content:
                        chapters[current_chapter] = {
                            'content': '\n'.join(chapter_content),
                            'line_start': current_chapter_line
                        }
                    
                    current_chapter = line
                    current_chapter_line = line_num
                    chapter_content = []
                    break
            
            # Add content to current chapter
            if current_chapter:
                chapter_content.append(line)
        
        # Add the last chapter
        if current_chapter and chapter_content:
            chapters[current_chapter] = {
                'content': '\n'.join(chapter_content),
                'line_start': current_chapter_line
            }
        
        return chapters
    
    def categorize_by_topics(self, chapters, book_name):
        """
        Categorize chapters by common project management topics
        Returns organized data by topics
        """
        topic_keywords = {
            'risk_management': [
                'risk', 'risk assessment', 'risk analysis', 'risk mitigation',
                'risk register', 'risk planning', 'risk monitoring'
            ],
            'stakeholder_management': [
                'stakeholder', 'stakeholder engagement', 'stakeholder analysis',
                'communication', 'communication management', 'engagement'
            ],
            'quality_management': [
                'quality', 'quality assurance', 'quality control', 'quality management',
                'quality planning', 'testing', 'verification', 'validation'
            ],
            'scope_management': [
                'scope', 'scope definition', 'scope planning', 'requirements',
                'work breakdown', 'wbs', 'deliverables'
            ],
            'time_management': [
                'schedule', 'scheduling', 'time', 'timeline', 'milestones',
                'critical path', 'resource allocation', 'duration'
            ],
            'cost_management': [
                'cost', 'budget', 'budgeting', 'cost planning', 'financial',
                'resource management', 'procurement'
            ],
            'project_lifecycle': [
                'project lifecycle', 'project phases', 'initiation', 'planning',
       	        'execution', 'monitoring', 'closure', 'project closure'
            ],
            'team_management': [
                'team', 'team management', 'leadership', 'human resources',
                'team building', 'motivation', 'performance'
            ],
    	    'change_management': [
                'change', 'change management', 'configuration management',
                'version control', 'change control', 'modifications'
            ]
        }
        
        categorized_content = {}
        
        for topic, keywords in topic_keywords.items():
            topic_content = {
                'book_references': {},
                'chapter_excerpts': [],
                'similar_concepts': [],
                'unique_aspects': []
            }
            
            for chapter_title, chapter_data in chapters.items():
                content = chapter_data['content'].lower()
                
                # Check if this chapter contains topic-related content
                topic_relevance = 0
                found_keywords = []
                
                for keyword in keywords:
                    if keyword.lower() in content:
                        topic_relevance = topic_relevance + 1
                        found_keywords.append(keyword)
                
                # If chapter is relevant to this topic
                if topic_relevance > 0:
                    # Extract relevant excerpts (first 500 characters)
                    excerpt = chapter_data['content'][:500] + "..."
                    
                    chapter_info = {
                        'chapter_title': chapter_title,
                        'relevance_score': topic_relevance,
                        'keywords_found': found_keywords,
                        'excerpt': excerpt,
                        'full_content_link': f"chapter_{chapter_title.replace(' ', '_')}"
                    }
                    
                    topic_content['chapter_excerpts'].append(chapter_info)
                    
                    # Store book reference
                    if book_name not in topic_content['book_references']:
                        topic_content['book_references'][book_name] = []
                    
                    topic_content['book_references'][book_name].append(chapter_title)
            
            # Only add topic if we found relevant content
            if topic_content['chapter_excerpts']:
                categorized_content[topic] = topic_content
        
        return categorized_content
    
    def process_all_books(self):
        """
        Main function to process all books
        """
        print("Starting book analysis process...")
        
        pdf_files = self.get_pdf_files()
        
        if not pdf_files:
            print("No PDF files found!")
            return
        
        print(f"Found {len(pdf_files)} PDF files to process")
        
        for pdf_file in pdf_files:
            print(f"\n{'='*50}")
            print(f"Processing: {pdf_file.name.encode('ascii', errors='replace').decode('ascii')}")
            print(f"{'='*50}")
            
            # Extract text from PDF
            text_content = self.extract_text_from_pdf(pdf_file)
            
            if not text_content:
                print(f"Skipping {pdf_file.name} - no text extracted")
                continue
            
            print(f"Extracted {len(text_content)} characters of text")
            
            # Get clean book name
            book_name = pdf_file.stem.replace('_', ' ').replace('-', ' ')
            
            # Identify chapters
            chapters = self.identify_chapters_and_sections(text_content, book_name)
            print(f"Identified {len(chapters)} chapters/sections")
            
            # Categorize by topics
            topic_data = self.categorize_by_topics(chapters, book_name)
            print(f"Found content for {len(topic_data)} topics")
            
            # Store processed book data
            self.processed_books[book_name] = {
                'file_path': str(pdf_file),
                'chapters': chapters,
                'topic_data': topic_data,
                'total_text_length': len(text_content)
            }
        
        self.build_topics_database()
        print(f"\nAnalysis complete! Processed {len(self.processed_books)} books")
    
    def build_topics_database(self):
        """
        Build the final topics database that combines all books
        """
        print("Building topics database...")
        
        for topic_name in ['risk_management', 'stakeholder_management', 'quality_management',
                          'scope_management', 'time_management', 'cost_management',
                          'project_lifecycle', 'team_management', 'change_management']:
            
            topic_combined = {
                'topic_title': topic_name.replace('_', ' ').title(),
                'books': {},
                'similar_texts': [],
                'different_texts': [],
                'summary': '',
                'total_excerpts': 0
            }
            
            excerpt_count = 0
            
            # Collect all content for this topic from all books
            for book_name, book_data in self.processed_books.items():
                if topic_name in book_data['topic_data']:
                    topic_data = book_data['topic_data'][topic_name]
                    
                    topic_combined['books'][book_name] = {
                        'chapter_count': len(topic_data['chapter_excerpts']),
                        'excerpts': topic_data['chapter_excerpts']
                    }
                    
                    excerpt_count = excerpt_count + len(topic_data['chapter_excerpts'])
                    
                    # Collect excerpts for similarity analysis
                    for excerpt in topic_data['chapter_excerpts']:
                        excerpt['source_book'] = book_name
                        topic_combined['similar_texts'].append(excerpt.copy())
            
            topic_combined['total_excerpts'] = excerpt_count
            
            # Generate topic summary
            if topic_combined['books']:
                book_names = list(topic_combined['books'].keys())
                topic_combined['summary'] = f"This topic is covered in {len(book_names)} books: {', '.join(book_names)}"
                
                # Store in database
                self.topics_database[topic_name] = topic_combined
        
        print(f"Topics database created with {len(self.topics_database)} topics")

def main():
    """
    Main function to run the book analyzer
    """
    print("Project Management Standards Book Analyzer")
    print("=" * 50)
    
    analyzer = BookAnalyzer()
    analyzer.process_all_books()
    
    # Save results to JSON files
    output_file = "book_analysis_results.json"
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'processed_books': analyzer.processed_books,
                'topics_database': analyzer.topics_database,
                'analysis_timestamp': str(Path().cwd())
            }, f, indent=2, ensure_ascii=False)
        
        print(f"Results saved to {output_file}")
        
    except Exception as e:
        print(f"Error saving results: {e}")
    
    return analyzer

if __name__ == "__main__":
    analyzer = main()
