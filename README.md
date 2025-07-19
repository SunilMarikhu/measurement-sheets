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

1. **Add New Record**: Click the "Add New Record" button to create a new measurement block
2. **Set Record Title**: Each record can have a custom title (defaults to Record-1, Record-2, etc.)
3. **Choose Units**: Select the appropriate unit of measurement for each record
4. **Add Measurements**: Click "Add Measurement" within each record to add measurement rows
5. **Enter Dimensions**: Fill in the length, width, and height values
6. **View Calculations**: Areas and totals are calculated automatically
7. **Export Data**: Use the "Export CSV" button to download all measurement data

## 📁 Project Structure

```
measurement-sheets/
├── css/
│   └── index.css          # Styles for the application
├── icons/
│   ├── delete.png         # Delete icon
│   └── trash_icon.svg     # Trash icon
├── javascript/
│   ├── constants.js       # Application constants and labels
│   ├── exportCsv.js       # CSV export functionality
│   ├── index.js           # Main application logic
│   ├── utils.js           # Utility functions
│   └── records/
│       ├── addRecord.js   # Add new record functionality
│       ├── addSubRecord.js # Add measurement rows
│       └── removeRow.js   # Remove measurement rows
└── index.html             # Main HTML file
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