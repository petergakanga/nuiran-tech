// Projects data and functionality
let projectsData = [

    {
        id: 2,
        title: "kenyan prince blog site",
        description: "Kenya Prince is a modern forex trading blog built to educate, inspire, and guide both new and experienced traders. The website features a clean and professional menu that helps visitors quickly access trading strategies, market analysis, psychology tips, risk-management guides, and practical tutorials. Each section is organized to make learning simple and enjoyable, with easy navigation across charts, insights, and step-by-step breakdowns",
        image: "images/Screenshot 2025-11-09 190459.png",
        imageAlt: "kenyan prince blog site",
        projectType: "Blog",
        technologies: ["html", "css", "js"],
        github: "https://github.com/example/taskmanager",
        live: "https://taskmanager-demo.com",
        featured: true
    },
    {
        id: 3,
        title: "bella vista restaraunt",
        description: "The Bella Vista Hotel website menu is designed to give guests a smooth, elegant browsing experience. Each section is clearly organized, making it easy for visitors to find exactly what they need. ",
        image: "images/Screenshot 2025-11-23 180444.png",
        imageAlt: "Weather application interface showing forecast charts",
        projectType: "Design",
        technologies: ["html", "bt"],
        github: "https://github.com/example/weather",
        live: "https://weather-dashboard-demo.com",
        featured: false
    },
    {
        id: 4,
        title: "Pizza selling website",
        description: "Our pizza menu is designed to make ordering fast, fun, and delicious. Each section is easy to browse, with clear categories for classic pizzas, premium specials, sides, drinks, and desserts. Customers can explore mouth-watering flavors, customize their orders, choose crust types, and add extra toppings with just a few clicks.",
        image: "images/Screenshot 2025-11-23 180548.png",
        imageAlt: "Analytics dashboard with social media performance charts",
        projectType: "design",
        technologies: ["html", "bt"],
        github: "https://github.com/example/analytics",
        live: "https://analytics-demo.com",
        featured: true
    },
    {
        id: 6,
        title: "commedian website",
        description: "The Laughing Comedian website menu is built to give visitors a fun and smooth experience from the moment they click in. Each section is clearly organized, letting fans easily explore comedy videos, skits, stand-up clips, upcoming shows, behind-the-scenes moments, and the comedian’s personal blog",
        image: "images/Screenshot 2025-11-23 180745.png",
        imageAlt: "Person preparing a gourmet meal with fresh ingredients",
        projectType: "design",
        technologies: ["html", "bt"],
        github: "https://github.com/example/recipes",
        live: "https://recipes-demo.com",
        featured: true
    }
];

function hasImageAsset(project) {
    if (!project || !project.image) return false;
    const imageSource = project.image.toString();
    const normalizedSource = imageSource.split('?')[0];
    return /https?:\/\//i.test(imageSource) || /[./\\]/.test(normalizedSource);
}

function getProjectMediaMarkup(project, options = {}) {
    const hasImage = hasImageAsset(project);
    const altText = project.imageAlt || `${project.title} preview`;

    if (hasImage) {
        const extraClass = options.variant === 'modal' ? 'modal-image' : 'card-image';
        return `<img src="${project.image}" alt="${altText}" loading="lazy" class="${extraClass}">`;
    }

    const fallbackIcon = project.image || '📁';
    const fallbackClass = options.variant === 'modal' ? 'modal-icon' : 'project-emoji';
    return `<div class="${fallbackClass}">${fallbackIcon}</div>`;
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initProjectFilters();
});

// Load and render projects
function loadProjects(filter = 'all') {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    let filteredProjects = projectsData;
    
    if (filter === 'featured') {
        filteredProjects = projectsData.filter(project => project.featured);
    }

    projectsGrid.innerHTML = '';

    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-projects" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No projects to display yet.</p>
                <a href="admin.html" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i>
                    Add Your First Project
                </a>
            </div>
        `;
        return;
    }

    filteredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        projectsGrid.appendChild(projectCard);
    });

    // Add stagger animation
    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Create individual project card
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);

    card.innerHTML = `
        <div class="project-image">
            <span class="project-type-label">${project.projectType || 'Project'}</span>
            ${getProjectMediaMarkup(project)}
            <div class="project-overlay">
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="project-link" title="View Code">
                        <i class="fab fa-github"></i>
                    </a>` : ''}
                    ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener" class="project-link" title="Live Demo">
                        <i class="fas fa-external-link-alt"></i>
                    </a>` : ''}
                </div>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
    `;

    // Add click handler for project details
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking on links
        if (e.target.closest('.project-link')) return;
        showProjectModal(project);
    });

    return card;
}

// Project filter functionality
function initProjectFilters() {
    // Create filter buttons if they don't exist
    const projectsSection = document.getElementById('projects');
    const existingFilters = projectsSection.querySelector('.project-filters');
    
    if (!existingFilters) {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'project-filters';
        filtersContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All Projects</button>
            <button class="filter-btn" data-filter="featured">Featured</button>
        `;

        // Insert filters before projects grid
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.parentNode.insertBefore(filtersContainer, projectsGrid);

        // Add filter styles
        addFilterStyles();
    }

    // Add filter event listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            const filter = btn.getAttribute('data-filter');
            loadProjects(filter);
        });
    });
}

// Add filter button styles
function addFilterStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .project-filters {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 0.75rem 1.5rem;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--border-radius);
            color: var(--text-secondary);
            cursor: pointer;
            transition: var(--transition);
            font-weight: 500;
        }

        .filter-btn:hover,
        .filter-btn.active {
            background: var(--gradient-primary);
            color: white;
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }

        .project-emoji {
            font-size: 4rem;
            filter: grayscale(100%);
            transition: var(--transition);
        }

        .project-card:hover .project-emoji {
            filter: grayscale(0%);
            transform: scale(1.1);
        }

        @media (max-width: 768px) {
            .project-filters {
                gap: 0.5rem;
            }
            
            .filter-btn {
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Project modal functionality
function showProjectModal(project) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.project-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <div class="modal-media">
                        ${getProjectMediaMarkup(project, { variant: 'modal' })}
                    </div>
                    <span class="project-type-pill">${project.projectType || 'Project'}</span>
                    <h2 class="modal-title">${project.title}</h2>
                </div>
                <div class="modal-body">
                    <p class="modal-description">${project.description}</p>
                    <div class="modal-tech">
                        <h4>Technologies Used:</h4>
                        <div class="tech-list">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="modal-links">
                        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn btn-secondary">
                            <i class="fab fa-github"></i> View Code
                        </a>` : ''}
                        ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    addModalStyles();

    // Add to DOM
    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', handleEscapeKey);

    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.removeEventListener('keydown', handleEscapeKey);
        }, 300);
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    }
}

// Add modal styles
function addModalStyles() {
    const existingModalStyles = document.querySelector('#modal-styles');
    if (existingModalStyles) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .project-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .project-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .modal-content {
            background: var(--bg-secondary);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--border-radius);
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.3s ease;
        }

        .project-modal.active .modal-content {
            transform: scale(1) translateY(0);
        }

        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1;
            transition: var(--transition);
        }

        .modal-close:hover {
            color: var(--primary-color);
        }

        .modal-header {
            text-align: center;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-media {
            width: 100%;
            border-radius: var(--border-radius);
            overflow: hidden;
            margin-bottom: 1.5rem;
            background: var(--gradient-primary);
        }

        .modal-media img {
            width: 100%;
            height: 280px;
            object-fit: cover;
            display: block;
        }

        .project-type-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.75rem;
            background: rgba(0, 212, 255, 0.2);
            color: var(--primary-color);
            border: 1px solid rgba(0, 212, 255, 0.4);
            border-radius: 999px;
            padding: 0.35rem 1rem;
            font-size: 0.8rem;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.06em;
        }

        .modal-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        .modal-title {
            color: var(--text-primary);
            margin: 0;
            font-size: 1.8rem;
        }

        .modal-body {
            padding: 2rem;
        }

        .modal-description {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        .modal-tech h4 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }

        .tech-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }

        .modal-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        @media (max-width: 768px) {
            .modal-overlay {
                padding: 1rem;
            }

            .modal-header,
            .modal-body {
                padding: 1.5rem;
            }

            .modal-media img {
                height: 200px;
            }

            .modal-title {
                font-size: 1.5rem;
            }

            .modal-links {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
}

// Project search functionality (bonus feature)
function initProjectSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'project-search';
    searchContainer.innerHTML = `
        <div class="search-input-container">
            <input type="text" id="project-search" placeholder="Search projects...">
            <i class="fas fa-search search-icon"></i>
        </div>
    `;

    // Insert search before filters
    const filtersContainer = document.querySelector('.project-filters');
    if (filtersContainer) {
        filtersContainer.parentNode.insertBefore(searchContainer, filtersContainer);
    }

    // Add search functionality
    const searchInput = document.getElementById('project-search');
    searchInput.addEventListener('input', debounceSearch);
}

// Debounced search function
const debounceSearch = debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProjects = projectsData.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
    );

    renderFilteredProjects(filteredProjects);
}, 300);

// Render filtered projects
function renderFilteredProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">No projects found matching your search.</p>
            </div>
        `;
        return;
    }

    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        projectsGrid.appendChild(projectCard);
    });
}

// Utility debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other files
window.ProjectsManager = {
    loadProjects,
    showProjectModal,
    projectsData,
    refreshProjects: () => {
        loadProjects();
    }
};