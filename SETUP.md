# Measurement Sheets Setup Guide

This guide will help you set up the Measurement Sheets application with the new API backend for multiple project support.

## Project Structure

```
measurement-sheets/
├── backend/                 # API Backend
│   ├── package.json        # Backend dependencies
│   ├── server.js           # Express.js server
│   ├── README.md           # Backend documentation
│   └── data/               # Data storage (auto-created)
│       └── projects.json   # Project data
├── css/
│   ├── index.css           # Main styles
│   └── project-manager.css # Project management styles
├── javascript/
│   ├── api.js              # API service
│   ├── projectManager.js   # Project management UI
│   ├── index.js            # Main application
│   ├── exportCsv.js        # CSV export
│   ├── constants.js        # Constants
│   ├── utils.js            # Utilities
│   └── records/            # Record management
│       ├── addRecord.js
│       ├── addSubRecord.js
│       └── removeRow.js
├── icons/                  # Application icons
├── index.html              # Main HTML file
├── README.md               # Main documentation
└── SETUP.md               # This file
```

## Setup Instructions

### 1. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Start the API server**:
   ```bash
   # Development mode (with auto-restart)
   yarn dev
   
   # Production mode
   yarn start
   ```

4. **Verify the server is running**:
   - Open: http://localhost:3000/api/projects
   - You should see an empty array `[]`

### 2. Frontend Setup

1. **Open the application**:
   - Open `index.html` in your web browser
   - Or serve it using a local server

2. **Test the application**:
   - Create a new project using the "New Project" button
   - Add measurement records
   - Save and load projects

## Features

### New Features (with API)

- **Multiple Projects**: Create and manage multiple measurement projects
- **Project Persistence**: All data is saved to the backend
- **Project Management UI**: Dropdown to select projects, save/delete buttons
- **Data Export**: CSV export with proper formatting
- **Real-time Updates**: Changes are saved automatically

### API Endpoints

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/save` - Save project data

## Usage

### Creating a New Project

1. Click "New Project" button
2. Enter project name and details
3. Click "Create"
4. The project will be selected automatically

### Working with Projects

1. **Select Project**: Use the dropdown to switch between projects
2. **Add Records**: Use "Add New Record" to add measurement blocks
3. **Save Project**: Click "Save Project" to persist changes
4. **Delete Project**: Click "Delete Project" to remove a project

### Data Export

- Click "Export CSV" to download measurement data
- CSV includes proper formatting with quoted fields
- Negative values for "less" records
- Proper column alignment

## Development

### Backend Development

```bash
cd backend
yarn dev  # Auto-restart on file changes
```

### Frontend Development

- Edit files in the root directory
- Refresh browser to see changes
- Check browser console for errors

### API Testing

Test the API endpoints using curl or Postman:

```bash
# Get all projects
curl http://localhost:3000/api/projects

# Create a project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","details":"Test details"}'
```

## Troubleshooting

### Common Issues

1. **API Connection Error**:
   - Ensure backend server is running on port 3000
   - Check browser console for CORS errors
   - Verify API_BASE_URL in `javascript/api.js`

2. **Data Not Saving**:
   - Check backend logs for errors
   - Verify data directory permissions
   - Check network tab in browser dev tools

3. **Project Not Loading**:
   - Refresh the page
   - Check if project exists in backend
   - Verify project ID in URL

### Debug Mode

Enable debug logging in the browser console:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## Production Deployment

### Backend Deployment

1. **Environment Variables**:
   ```bash
   export PORT=3000
   export NODE_ENV=production
   ```

2. **Start Production Server**:
   ```bash
   cd backend
   yarn start
   ```

### Frontend Deployment

1. **Update API URL**:
   - Edit `javascript/api.js`
   - Change `API_BASE_URL` to production URL

2. **Serve Static Files**:
   - Use nginx, Apache, or any static file server
   - Ensure CORS is properly configured

## Data Backup

The application stores data in `backend/data/projects.json`. To backup:

```bash
cp backend/data/projects.json backup-projects.json
```

To restore:

```bash
cp backup-projects.json backend/data/projects.json
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify backend server is running
3. Check network connectivity
4. Review API endpoint responses 