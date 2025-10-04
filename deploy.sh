#!/bin/bash

# PM Standards Hub - Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 PM Standards Hub Deployment Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    local required_files=("index.html" "styles.css" "script.js" "README.md" "package.json")
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        print_success "All required files present"
        return 0
    else
        print_error "Missing files: ${missing_files[*]}"
        return 1
    fi
}

# Validate HTML
validate_html() {
    print_status "Validating HTML structure..."
    
    # Basic HTML validation
    if grep -q "<!DOCTYPE html>" index.html && grep -q "</html>" index.html; then
        print_success "HTML structure is valid"
    else
        print_error "HTML structure is invalid"
        return 1
    fi
}

# Check for common issues
check_issues() {
    print_status "Checking for common issues..."
    
    local issues=()
    
    # Check for broken links
    if grep -q "href=\"#\"" index.html; then
        issues+=("Found placeholder links (href='#')")
    fi
    
    # Check for console.log statements
    if grep -q "console.log" script.js; then
        issues+=("Found console.log statements in production code")
    fi
    
    # Check for TODO comments
    if grep -q "TODO\|FIXME\|XXX" *.html *.css *.js; then
        issues+=("Found TODO/FIXME comments")
    fi
    
    if [ ${#issues[@]} -eq 0 ]; then
        print_success "No common issues found"
    else
        print_warning "Found potential issues:"
        for issue in "${issues[@]}"; do
            echo "  - $issue"
        done
    fi
}

# Create deployment package
create_package() {
    print_status "Creating deployment package..."
    
    local package_name="pm-standards-hub-$(date +%Y%m%d-%H%M%S).zip"
    
    # Create temporary directory
    local temp_dir=$(mktemp -d)
    
    # Copy files to temp directory
    cp index.html styles.css script.js README.md package.json LICENSE "$temp_dir/"
    
    # Create zip package
    cd "$temp_dir"
    zip -r "$package_name" . > /dev/null
    cd - > /dev/null
    
    # Move package to current directory
    mv "$temp_dir/$package_name" .
    
    # Clean up
    rm -rf "$temp_dir"
    
    print_success "Deployment package created: $package_name"
}

# Deploy to GitHub Pages (if git repository)
deploy_github_pages() {
    print_status "Checking for GitHub Pages deployment..."
    
    if [ -d ".git" ]; then
        print_status "Git repository detected"
        
        # Check if we're on main/master branch
        local current_branch=$(git branch --show-current)
        if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
            print_status "On main branch, ready for GitHub Pages"
            print_warning "To deploy to GitHub Pages:"
            echo "  1. Push your changes to GitHub"
            echo "  2. Go to repository Settings > Pages"
            echo "  3. Select 'Deploy from a branch'"
            echo "  4. Choose 'main' branch and '/ (root)' folder"
        else
            print_warning "Not on main branch (current: $current_branch)"
        fi
    else
        print_warning "Not a git repository"
    fi
}

# Deploy to Netlify
deploy_netlify() {
    print_status "Preparing for Netlify deployment..."
    
    # Create netlify.toml configuration
    cat > netlify.toml << EOF
[build]
  publish = "."
  command = "echo 'No build process needed'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
EOF
    
    print_success "netlify.toml created"
    print_warning "To deploy to Netlify:"
    echo "  1. Connect your GitHub repository to Netlify"
    echo "  2. Netlify will automatically deploy from this configuration"
    echo "  3. Or drag and drop the project folder to netlify.com/drop"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Preparing for Vercel deployment..."
    
    # Create vercel.json configuration
    cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF
    
    print_success "vercel.json created"
    print_warning "To deploy to Vercel:"
    echo "  1. Install Vercel CLI: npm i -g vercel"
    echo "  2. Run: vercel"
    echo "  3. Follow the prompts"
}

# Main deployment function
main() {
    echo
    print_status "Starting deployment process..."
    
    # Run checks
    if ! check_files; then
        print_error "Deployment aborted due to missing files"
        exit 1
    fi
    
    validate_html
    check_issues
    
    echo
    print_status "Creating deployment packages..."
    create_package
    
    echo
    print_status "Preparing deployment configurations..."
    deploy_github_pages
    deploy_netlify
    deploy_vercel
    
    echo
    print_success "Deployment preparation complete!"
    echo
    print_status "Next steps:"
    echo "  1. Test the application locally"
    echo "  2. Choose your deployment platform"
    echo "  3. Follow the platform-specific instructions above"
    echo "  4. Update your README.md with deployment URLs"
    echo
    print_status "Files created:"
    echo "  - Deployment package (.zip)"
    echo "  - netlify.toml (for Netlify)"
    echo "  - vercel.json (for Vercel)"
    echo
}

# Run main function
main "$@"
