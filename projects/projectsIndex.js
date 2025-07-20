import { projectAPI } from '../javascript/api/api.js';

class ProjectsIndex {
  constructor() {
    this.projects = [];
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadProjects();
  }

  setupEventListeners() {
    // New project button
    document.getElementById('newProjectBtn').addEventListener('click', () => {
      this.showNewProjectModal();
    });

    // Create project button
    document.getElementById('createProjectBtn').addEventListener('click', () => {
      this.createNewProject();
    });

    // Cancel button
    document.getElementById('cancelProjectBtn').addEventListener('click', () => {
      this.hideNewProjectModal();
    });

    // Modal backdrop click to close
    document.getElementById('projectModal').addEventListener('click', (e) => {
      if (e.target.id === 'projectModal') {
        this.hideNewProjectModal();
      }
    });
  }

  async loadProjects() {
    try {
      this.projects = await projectAPI.getProjects();
      this.renderProjects();
      // Hide loading spinner
      const loading = document.querySelector('#projectsContent .loading');
      if (loading) loading.style.display = 'none';
    } catch (error) {
      console.error('Failed to load projects:', error);
      this.showError('Failed to load projects. Please try again.');
      // Hide loading spinner on error as well
      const loading = document.querySelector('#projectsContent .loading');
      if (loading) loading.style.display = 'none';
    }
  }

  renderProjects() {
    const container = document.getElementById('projectsContent');
    const emptyState = document.getElementById('emptyState');
    
    if (this.projects.length === 0) {
      // Hide projects grid, show empty state
      if (emptyState) emptyState.style.display = '';
      // Remove any projects grid if present
      const grid = container.querySelector('.projects-grid');
      if (grid) grid.remove();
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    // Sort projects by updated date (newest first)
    const sortedProjects = [...this.projects].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    const projectsHTML = sortedProjects.map(project => this.createProjectCard(project)).join('');
    
    // Remove any previous grid and insert new
    const oldGrid = container.querySelector('.projects-grid');
    if (oldGrid) oldGrid.remove();
    const gridDiv = document.createElement('div');
    gridDiv.className = 'projects-grid';
    gridDiv.innerHTML = projectsHTML;
    container.appendChild(gridDiv);

    // Add event listeners to project cards
    this.addProjectCardListeners();
  }

  createProjectCard(project) {
    const date = new Date(project.updatedAt);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en', { month: 'short' });
    const day = date.getDate();
    const updatedDate = `${year} ${month} ${day}`;
    
    return `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-content">
          <div class="project-title">${this.escapeHtml(project.name)}</div>
          <div class="project-details">${this.escapeHtml(project.details || 'No description')}</div>
          <div class="project-date">
            Updated: ${updatedDate}
          </div>
        </div>
        <div class="project-menu-overlay">
          <button class="menu-btn" data-project-id="${project.id}">
            ⋮
          </button>
          <div class="menu-dropdown" data-project-id="${project.id}">
            <button class="menu-item delete-item" data-project-id="${project.id}">
              <img src="../images/icons/delete.png" class="delete-icon" alt="Delete">
              Delete Project
            </button>
          </div>
        </div>
      </div>
    `;
  }

  addProjectCardListeners() {
    // Project card click (navigate to project)
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking on menu elements
        if (e.target.closest('.project-menu-overlay')) {
          return;
        }
        
        const projectId = card.dataset.projectId;
        this.navigateToProject(projectId);
      });
    });

    // Menu button click
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = btn.dataset.projectId;
        this.toggleMenu(projectId);
      });
    });

    // Delete menu item click
    document.querySelectorAll('.delete-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = btn.dataset.projectId;
        this.hideAllMenus();
        this.deleteProject(projectId);
      });
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.project-menu-overlay')) {
        this.hideAllMenus();
      }
    });
  }

  navigateToProject(projectId) {
    // Store the project ID in sessionStorage for the project page to use
    sessionStorage.setItem('currentProjectId', projectId);
    window.location.href = 'show.html';
  }

  async deleteProject(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await projectAPI.deleteProject(projectId);
      
      // Remove from local list
      this.projects = this.projects.filter(p => p.id !== projectId);
      this.renderProjects();
      
      this.showSuccess('Project deleted successfully!');
    } catch (error) {
      console.error('Failed to delete project:', error);
      this.showError('Failed to delete project. Please try again.');
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
      this.showError('Please enter a project name');
      return;
    }

    try {
      const newProject = await projectAPI.createProject({ name, details });
      this.projects.push(newProject);
      this.hideNewProjectModal();
      
      // Navigate to the new project
      this.navigateToProject(newProject.id);
      
    } catch (error) {
      console.error('Failed to create project:', error);
      this.showError('Failed to create project. Please try again.');
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  toggleMenu(projectId) {
    // Hide all other menus first
    this.hideAllMenus();
    
    // Show this menu
    const menu = document.querySelector(`.menu-dropdown[data-project-id="${projectId}"]`);
    if (menu) {
      menu.classList.add('show');
    }
  }

  hideAllMenus() {
    document.querySelectorAll('.menu-dropdown').forEach(menu => {
      menu.classList.remove('show');
    });
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

// Initialize projects index when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProjectsIndex();
}); 