#!/bin/bash

# Rajeshwari Mali Portfolio - Deployment Script
# This script helps with common deployment tasks

set -e

echo "🚀 Rajeshwari Mali Portfolio Deployment Script"
echo "================================================"

# Function to display usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  check     - Run pre-deployment checks"
    echo "  validate  - Validate HTML and CSS"
    echo "  optimize  - Optimize images and assets"
    echo "  test      - Run local test server"
    echo "  deploy    - Deploy to GitHub Pages"
    echo "  help      - Show this help message"
    echo ""
}

# Function to check if required files exist
check_files() {
    echo "📋 Checking required files..."
    
    required_files=(
        "index.html"
        "style.css"
        "script.js"
        "README.md"
        "manifest.json"
        "sw.js"
    )
    
    missing_files=()
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -eq 0 ]]; then
        echo "✅ All required files present"
    else
        echo "❌ Missing files:"
        printf '   %s\n' "${missing_files[@]}"
        exit 1
    fi
}

# Function to check assets
check_assets() {
    echo "🖼️  Checking assets directory..."
    
    if [[ ! -d "assets" ]]; then
        echo "❌ Assets directory not found"
        exit 1
    fi
    
    # Check for placeholder files that should be replaced
    placeholder_files=(
        "assets/profile picture.jpeg"
    )
    
    echo "⚠️  TODO: Replace these placeholder files:"
    for file in "${placeholder_files[@]}"; do
        if [[ -f "$file" || ! -f "${file/placeholder/actual}" ]]; then
            echo "   - $file"
        fi
    done
}

# Function to validate HTML
validate_html() {
    echo "🔍 Validating HTML..."
    
    if command -v tidy &> /dev/null; then
        tidy -errors -q index.html
        echo "✅ HTML validation complete"
    else
        echo "⚠️  HTML Tidy not found. Install with: apt-get install tidy"
    fi
}

# Function to run local server
run_server() {
    echo "🌐 Starting local development server..."
    
    if command -v python3 &> /dev/null; then
        echo "📡 Server running at http://localhost:8000"
        echo "Press Ctrl+C to stop"
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "📡 Server running at http://localhost:8000"
        echo "Press Ctrl+C to stop"
        python -m SimpleHTTPServer 8000
    elif command -v node &> /dev/null && command -v npx &> /dev/null; then
        echo "📡 Server running at http://localhost:8080"
        echo "Press Ctrl+C to stop"
        npx live-server --port=8080
    else
        echo "❌ No suitable server found. Install Python or Node.js"
        exit 1
    fi
}

# Function to optimize images
optimize_images() {
    echo "🎨 Optimizing images..."
    
    if command -v imageoptim &> /dev/null; then
        find assets -name "*.jpg" -o -name "*.png" | xargs imageoptim
        echo "✅ Images optimized"
    elif command -v optipng &> /dev/null && command -v jpegoptim &> /dev/null; then
        find assets -name "*.png" -exec optipng {} \;
        find assets -name "*.jpg" -exec jpegoptim --max=85 {} \;
        echo "✅ Images optimized"
    else
        echo "⚠️  Image optimization tools not found"
        echo "   Install imageoptim, or optipng + jpegoptim"
    fi
}

# Function to deploy to GitHub Pages
deploy_github() {
    echo "🚀 Deploying to GitHub Pages..."
    
    if [[ ! -d ".git" ]]; then
        echo "❌ Not a Git repository. Initialize with: git init"
        exit 1
    fi
    
    echo "📤 Committing changes..."
    git add .
    git commit -m "Deploy portfolio website - $(date)"
    
    echo "📤 Pushing to GitHub..."
    git push origin main
    
    echo "✅ Deployed! Check your repository settings to enable GitHub Pages"
}

# Function to run all checks
run_checks() {
    echo "🔍 Running pre-deployment checks..."
    check_files
    check_assets
    validate_html
    echo "✅ All checks completed"
}

# Main script logic
case "${1:-help}" in
    "check")
        run_checks
        ;;
    "validate")
        validate_html
        ;;
    "optimize")
        optimize_images
        ;;
    "test")
        run_server
        ;;
    "deploy")
        run_checks
        deploy_github
        ;;
    "help"|*)
        usage
        ;;
esac
