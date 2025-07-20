# Measurement Sheets

A web-based application for creating and managing measurement records with support for multiple dimensions, units, and CSV export functionality.

## 🌐 Live Demo

**Visit the application:** [https://sunilmarikhu.github.io/measurement-sheets/](https://sunilmarikhu.github.io/measurement-sheets/)

## 📋 Features

- **Multiple Records**: Create and manage multiple measurement records
- **Flexible Dimensions**: Add measurements with length, width, and height dimensions
- **Unit Selection**: Choose from various units (mm, cm, m, ft, in, etc.)
- **Real-time Calculations**: Automatic calculation of areas and totals
- **CSV Export**: Export all measurement data to CSV format
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and intuitive user interface

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs entirely in the browser

### Usage

1. **Start at Main Page**: Open `index.html` to see the welcome page
2. **Access Projects**: Click "Get Started" to go to the projects listing page
3. **Create Project**: Click "New Project" to create a new measurement project
4. **Edit Project**: Click on a project card to open the project detail page
5. **Add Records**: Use "Add New Record" to create measurement blocks
6. **Set Record Title**: Each record can have a custom title (defaults to Record-1, Record-2, etc.)
7. **Choose Units**: Select the appropriate unit of measurement for each record
8. **Add Measurements**: Click "Add Measurement" within each record to add measurement rows
9. **Enter Dimensions**: Fill in the length, width, and height values
10. **Save Project**: Click the "Save Project" button to persist your changes
11. **Export Data**: Use the "Export CSV" button to download all measurement data

## 📁 Project Structure

```
measurement-sheets/
├── backend/               # API Backend
│   ├── package.json       # Backend dependencies
│   ├── server.js          # Express.js server
│   ├── README.md          # Backend documentation
│   └── data/              # Data storage (auto-created)
│       └── projects.json  # Project data
├── projects/              # Project Management
│   ├── index.html         # Projects listing page
│   ├── show.html          # Project detail page
│   └── projectsIndex.js   # Projects listing logic
├── css/                   # Stylesheets
│   ├── layouts/           # Layout styles
│   │   ├── index.css      # Main layout styles
│   │   └── welcome.css    # Welcome page styles
│   ├── components/        # Component styles
│   │   ├── navigation.css # Navigation bar styles
│   │   ├── project-manager.css # Project management styles
│   │   └── projects-listing.css # Projects listing styles
│   └── utilities/         # Utility styles (empty)
├── javascript/            # JavaScript modules
│   ├── api/               # API services
│   │   └── api.js         # API service module
│   ├── components/        # UI components
│   │   ├── index.js       # Main application logic
│   │   └── projectManager.js # Project management logic
│   ├── utils/             # Utility functions
│   │   ├── constants.js   # Application constants
│   │   ├── utils.js       # Utility functions
│   │   └── exportCsv.js   # CSV export functionality
│   └── records/           # Record management
│       ├── addRecord.js   # Add new record functionality
│       ├── addSubRecord.js # Add measurement rows
│       └── removeRow.js   # Remove measurement rows
├── images/                # Application images
│   └── icons/            # Application icons
├── index.html             # Main entry point
├── README.md              # Main documentation
└── SETUP.md              # Setup guide
```

## 🛠️ Development

### Local Development
1. Clone the repository
2. Open `index.html` in your web browser
3. No build process required - pure HTML, CSS, and JavaScript

### Key Components

- **Record Management**: Each record represents a measurement block with its own unit and calculations
- **Sub-records**: Individual measurement rows within each record
- **Dynamic Calculations**: Real-time area and total calculations
- **CSV Export**: Structured export of all measurement data

## 📊 Data Structure

Each record contains:
- Record title
- Unit of measurement
- Multiple measurement rows with:
  - Length, Width, Height dimensions
  - Calculated area
  - Description (optional)
- Sub-total calculations

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Application**: [https://sunilmarikhu.github.io/measurement-sheets/](https://sunilmarikhu.github.io/measurement-sheets/)
- **GitHub Repository**: [https://github.com/sunilmarikhu/measurement-sheets](https://github.com/sunilmarikhu/measurement-sheets)

---

**Note**: This application runs entirely in your browser - no data is stored on servers, ensuring privacy and offline functionality. 