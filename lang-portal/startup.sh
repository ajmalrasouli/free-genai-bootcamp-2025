#!/bin/bash
set -e

echo "Starting Language Learning Portal..."
echo "Current working directory: $(pwd)"
echo "Listing files:"
ls -la

# Install any missing dependencies
echo "Checking client dependencies..."
cd client
npm install --silent || echo "Warning: Some client dependencies could not be installed"

# Ensure tsconfig.json exists
if [ ! -f "tsconfig.json" ]; then
  echo "Creating client tsconfig.json..."
  echo '{
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "noUnusedLocals": false,
      "noUnusedParameters": false,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
  }' > tsconfig.json
fi

# Ensure tsconfig.node.json exists
if [ ! -f "tsconfig.node.json" ]; then
  echo "Creating client tsconfig.node.json..."
  echo '{
    "compilerOptions": {
      "composite": true,
      "skipLibCheck": true,
      "module": "ESNext",
      "moduleResolution": "bundler",
      "allowSyntheticDefaultImports": true
    },
    "include": ["vite.config.ts"]
  }' > tsconfig.node.json
fi

# Try to build client
echo "Building client..."
npm run build || {
  echo "Client build failed. Installing additional dependencies..."
  npm install --save-dev @types/node @types/react @types/react-dom
  npm install wouter lucide-react
  echo "Retrying client build..."
  npm run build || echo "Warning: Client build failed, but continuing with server setup"
}

echo "Changing to server directory..."
cd ../server

# Install any missing dependencies
echo "Checking server dependencies..."
npm install --silent || echo "Warning: Some server dependencies could not be installed"

# Ensure tsconfig.json exists
if [ ! -f "tsconfig.json" ]; then
  echo "Creating server tsconfig.json..."
  echo '{
    "compilerOptions": {
      "target": "ES2020",
      "module": "NodeNext",
      "moduleResolution": "NodeNext",
      "esModuleInterop": true,
      "outDir": "dist",
      "strict": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "baseUrl": ".",
      "paths": {
        "@shared/*": ["shared/*"]
      },
      "types": ["node", "express"]
    },
    "include": ["*.ts", "shared/**/*.ts"],
    "ts-node": {
      "esm": true,
      "experimentalSpecifierResolution": "node"
    }
  }' > tsconfig.json
fi

# Try to build server
echo "Building server..."
npm run build || {
  echo "Server build failed. Installing additional dependencies..."
  npm install --save-dev @types/node @types/express
  npm install express cors
  echo "Retrying server build..."
  npm run build || echo "Warning: Server build failed, continuing with direct execution"
}

# Create public directory for static files
echo "Setting up public directory..."
mkdir -p public

# Copy client build to server public directory if it exists
echo "Copying client build to server public directory..."
if [ -d "../client/dist" ]; then
  cp -r ../client/dist/* public/ || echo "Warning: Failed to copy client build files"
else
  echo "Warning: Client build directory not found"
fi

echo "Starting server..."
npx tsx simple-server.ts 