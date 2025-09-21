#!/bin/bash

echo "🚀 Starting Afritable Deployment Process..."
echo "=============================================="

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    print_success "All requirements met!"
}

# Build the application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm run install:all
    
    # Build backend
    print_status "Building backend..."
    cd backend && npm run build && cd ..
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend && npm run build && cd ..
    
    print_success "Application built successfully!"
}

# Deploy to Railway (Backend)
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Please install it:"
        echo "npm install -g @railway/cli"
        echo "Then run: railway login"
        return 1
    fi
    
    # Deploy to Railway
    cd backend
    railway up
    cd ..
    
    print_success "Backend deployed to Railway!"
}

# Deploy to Vercel (Frontend)
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Please install it:"
        echo "npm install -g vercel"
        echo "Then run: vercel login"
        return 1
    fi
    
    # Deploy to Vercel
    cd frontend
    vercel --prod
    cd ..
    
    print_success "Frontend deployed to Vercel!"
}

# Main deployment function
main() {
    echo "🎯 Afritable Deployment Script"
    echo "=============================="
    echo ""
    
    # Check requirements
    check_requirements
    
    # Build application
    build_app
    
    # Ask user which services to deploy
    echo ""
    echo "Which services would you like to deploy?"
    echo "1) Backend only (Railway)"
    echo "2) Frontend only (Vercel)"
    echo "3) Both Backend and Frontend"
    echo "4) Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            deploy_backend
            ;;
        2)
            deploy_frontend
            ;;
        3)
            deploy_backend
            deploy_frontend
            ;;
        4)
            print_status "Deployment cancelled."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Deployment completed!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Set up environment variables in Railway/Vercel"
    echo "2. Configure database connection"
    echo "3. Run database migrations"
    echo "4. Test the deployed application"
    echo ""
    echo "🔗 Useful Links:"
    echo "- Railway Dashboard: https://railway.app/dashboard"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo ""
}

# Run main function
main
