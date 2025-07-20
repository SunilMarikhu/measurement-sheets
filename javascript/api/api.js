// const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = 'https://measurement-sheets-backend.onrender.com/api';

class ProjectAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all projects
  async getProjects() {
    return this.request('/projects');
  }

  // Get a specific project
  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  // Create a new project
  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  // Update a project
  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  }

  // Delete a project
  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE'
    });
  }

  // Save project data
  async saveProjectData(id, projectData) {
    return this.request(`/projects/${id}/save`, {
      method: 'POST',
      body: JSON.stringify({ projectData })
    });
  }

  // Extract project data from DOM
  extractProjectData() {
    const projectName = document.querySelector('input[name="projectName"]')?.value || '';
    const projectDetails = document.querySelector('textarea[name="projectDetails"]')?.value || '';
    
    const records = [];
    const tables = document.querySelectorAll('table');
    
    tables.forEach((table, index) => {
      const recordTitle = table.querySelector('.recordTitleInput')?.value || `Record-${index + 1}`;
      const recordUnit = table.querySelector('.recordUnitSelect')?.value || '';
      const subRecords = [];
      
      table.querySelectorAll('tr.subRecord, tr.innerRecord').forEach((subRecord) => {
        const cells = subRecord.children;
        const subRecordData = {
          sn: cells[0].textContent,
          description: cells[1].firstChild?.value || '',
          nos: cells[2].firstChild?.value || '',
          length: cells[3].firstChild?.value || '',
          width: cells[4].firstChild?.value || '',
          height: cells[5].firstChild?.value || '',
          quantity: cells[6].textContent,
          isLessRecord: subRecord.classList.contains('innerRecord')
        };
        subRecords.push(subRecordData);
      });
      
      const subTotal = table.querySelector('td.recordTotal')?.textContent || '0';
      
      records.push({
        title: recordTitle,
        unit: recordUnit,
        subRecords,
        subTotal
      });
    });
    
    return {
      name: projectName,
      details: projectDetails,
      records
    };
  }

  // Load project data into DOM
  loadProjectData(projectData) {
    // Clear existing data
    document.querySelector('input[name="projectName"]').value = projectData.name || '';
    document.querySelector('textarea[name="projectDetails"]').value = projectData.details || '';
    
    // Clear existing records
    const container = document.getElementById('recordTablesContainer');
    container.innerHTML = '';
    
    // Load records
    if (projectData.records && projectData.records.length > 0) {
      // Dynamically import addRecordFromData to avoid circular dependency
      import('../records/addRecord.js').then(module => {
        projectData.records.forEach(record => {
          module.addRecordFromData(record);
        });
      });
    }
  }
}

// Export the API instance
export const projectAPI = new ProjectAPI(); 