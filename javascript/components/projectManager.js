import { projectAPI } from '../api/api.js';

class ProjectManager {
  constructor() {
    this.currentProjectId = null;
    this.projects = [];
    this.init();
  }

  async init() {
    // Only load projects if not on the show page
    const isShowPage = window.location.pathname.includes('show.html');
    if (!isShowPage) {
      await this.loadProjects();
    }
    this.createProjectSelector();
    this.setupEventListeners();
  }

  async loadProjects() {
    try {
      this.projects = await projectAPI.getProjects();
      this.updateProjectList();
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  createProjectSelector() {
    // Check if we're on the project detail page (show.html)
    const isProjectPage = window.location.pathname.includes('show.html') || window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    
    if (isProjectPage) {
      // On project detail page, set up the header buttons
      this.setupProjectPage();
    } else {
      // On projects index page, this will be handled by projectsIndex.js
      return;
    }
  }

  updateProjectList() {
    const select = document.getElementById('projectSelect');
    if (!select) return;
    const currentValue = select.value;
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select a project...</option>';
    
    // Add project options
    this.projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = project.name;
      select.appendChild(option);
    });
    
    // Restore selected value if it still exists
    if (currentValue && this.projects.find(p => p.id === currentValue)) {
      select.value = currentValue;
    }
  }

  setupEventListeners() {
    // Check if we're on the project detail page
    const isProjectPage = window.location.pathname.includes('show.html') || window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    
    if (isProjectPage) {
      // Project detail page event listeners
      document.getElementById('saveProjectBtn')?.addEventListener('click', () => {
        this.saveCurrentProject();
      });
    } else {
      // Projects index page event listeners (handled by projectsIndex.js)
      return;
    }
  }

  showNewProjectModal() {
    document.getElementById('projectModal').style.display = 'block';
    document.getElementById('newProjectName').focus();
  }

  hideNewProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.getElementById('newProjectName').value = '';
    document.getElementById('newProjectDetails').value = '';
  }

  async createNewProject() {
    const name = document.getElementById('newProjectName').value.trim();
    const details = document.getElementById('newProjectDetails').value.trim();
    
    if (!name) {
      alert('Please enter a project name');
      return;
    }

    try {
      const newProject = await projectAPI.createProject({ name, details });
      this.projects.push(newProject);
      this.updateProjectList();
      this.hideNewProjectModal();
      
      // Select the new project
      document.getElementById('projectSelect').value = newProject.id;
      this.loadProject(newProject.id);
      
      alert('Project created successfully!');
    } catch (error) {
      alert('Failed to create project: ' + error.message);
    }
  }

  setupProjectPage() {
    // Get current project ID from sessionStorage
    const currentProjectId = sessionStorage.getItem('currentProjectId');
    
    if (currentProjectId) {
      this.loadProject(currentProjectId);
    } else {
      // No project selected, redirect to projects page
      window.location.href = 'index.html';
    }
  }

  async loadProject(projectId) {
    if (!projectId) {
      this.clearCurrentProject();
      return;
    }

    try {
      const project = await projectAPI.getProject(projectId);
      this.currentProjectId = projectId;
      
      // Update page title
      document.getElementById('projectTitle').textContent = project.name || 'Measurement Sheet';
      
      // Load project data into the form
      document.querySelector('input[name="projectName"]').value = project.name || '';
      document.querySelector('textarea[name="projectDetails"]').value = project.details || '';

      // Render records from API
      projectAPI.loadProjectData(project);
      
      // Enable save button
      const saveBtn = document.getElementById('saveProjectBtn');
      if (saveBtn) {
        saveBtn.disabled = false;
      }
      
      // TODO: Load records if they exist
      console.log('Project loaded:', project);
      
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project: ' + error.message);
    }
  }

  async saveCurrentProject() {
    if (!this.currentProjectId) {
      alert('No project selected');
      return;
    }

    try {
      const saveBtn = document.getElementById('saveProjectBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = '💾 Saving...';
      }

      const projectData = projectAPI.extractProjectData();
      await projectAPI.updateProject(this.currentProjectId, projectData);
      
      if (saveBtn) {
        saveBtn.textContent = '💾 Saved!';
        setTimeout(() => {
          saveBtn.textContent = '💾 Save Project';
          saveBtn.disabled = false;
        }, 2000);
      }
      
      this.showSuccess('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
      
      const saveBtn = document.getElementById('saveProjectBtn');
      if (saveBtn) {
        saveBtn.textContent = '💾 Save Project';
        saveBtn.disabled = false;
      }
      
      this.showError('Failed to save project: ' + error.message);
    }
  }

  async deleteCurrentProject() {
    if (!this.currentProjectId) {
      alert('No project selected');
      return;
    }

    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await projectAPI.deleteProject(this.currentProjectId);
      
      // Remove from local list
      this.projects = this.projects.filter(p => p.id !== this.currentProjectId);
      this.updateProjectList();
      
      this.clearCurrentProject();
      alert('Project deleted successfully!');
    } catch (error) {
      alert('Failed to delete project: ' + error.message);
    }
  }

  clearCurrentProject() {
    this.currentProjectId = null;
    document.querySelector('input[name="projectName"]').value = '';
    document.querySelector('textarea[name="projectDetails"]').value = '';
    
    // Disable save button
    const saveBtn = document.getElementById('saveProjectBtn');
    if (saveBtn) {
      saveBtn.disabled = true;
    }
    
    // Clear records container
    document.getElementById('recordTablesContainer').innerHTML = '';
    
    // Clear session storage
    sessionStorage.removeItem('currentProjectId');
  }

  showSuccess(message) {
    // Simple success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  showError(message) {
    // Simple error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize project manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProjectManager();
});

export { ProjectManager }; 