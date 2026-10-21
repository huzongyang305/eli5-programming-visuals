/**
 * ELI5 UI Components - Reusable Interface Elements
 * 
 * Provides programmatic DOM creation for common UI components:
 * - NavigationBar: Sticky header with logo, nav links, theme toggle
 * - Breadcrumb: Shows current location in navigation hierarchy
 * - Toast: Notification system for user feedback
 * - LoadingSpinner: Animated loader for async operations
 * - ThemeToggle: Light/dark/high-contrast mode switcher
 * - BackButton: Consistent navigation back button
 * 
 * All components follow accessibility best practices (ARIA labels, keyboard navigation)
 * and support responsive design.
 */

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Element attributes
 * @param {Array|string|HTMLElement} children - Child elements or text content
 * @returns {HTMLElement} Created element
 */
function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  
  // Set attributes
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'textContent') {
      el.textContent = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (typeof value === 'boolean') {
      if (value) el.setAttribute(key, '');
    } else {
      el.setAttribute(key, value);
    }
  });
  
  // Add children
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        el.appendChild(child);
      }
    });
  } else if (typeof children === 'string') {
    el.textContent = children;
  } else if (children instanceof HTMLElement) {
    el.appendChild(children);
  }
  
  return el;
}

/**
 * Get current theme from localStorage or system preference
 * @returns {string} Current theme ('light', 'dark', or 'high-contrast')
 */
function getCurrentTheme() {
  const saved = localStorage.getItem('eli5-theme');
  if (saved) return saved;
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Apply theme to document
 * @param {string} theme - Theme name
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-dark', theme === 'dark' ? 'true' : 'false');
  localStorage.setItem('eli5-theme', theme);
}

// ============================================================================
// NavigationBar Component
// ============================================================================

class NavigationBar {
  /**
   * Create a navigation bar
   * @param {Object} options - Configuration options
   * @param {string} options.brandText - Brand/logo text
   * @param {string} options.brandLink - Link URL for brand
   * @param {Array} options.links - Array of link objects {text, href, active}
   * @param {boolean} options.showThemeToggle - Whether to show theme toggle
   */
  constructor(options = {}) {
    this.options = {
      brandText: options.brandText || '🎨 ELI5',
      brandLink: options.brandLink || './index.html',
      links: options.links || [],
      showThemeToggle: options.showThemeToggle !== false,
      ...options
    };
    
    this.element = this.render();
    this.setupEventListeners();
  }
  
  /**
   * Render the navigation bar DOM structure
   * @returns {HTMLElement} Navigation bar element
   */
  render() {
    const navbar = createElement('nav', {
      className: 'navbar',
      role: 'navigation',
      'aria-label': 'Main navigation'
    });
    
    const container = createElement('div', {
      className: 'navbar-container'
    });
    
    // Brand section
    const brand = createElement('a', {
      className: 'navbar-brand',
      href: this.options.brandLink,
      'aria-label': 'Go to homepage'
    }, [
      createElement('div', { className: 'navbar-logo' }, '📚'),
      createElement('span', {}, this.options.brandText)
    ]);
    
    // Mobile menu toggle
    const toggle = createElement('button', {
      className: 'navbar-toggle',
      'aria-expanded': 'false',
      'aria-label': 'Toggle navigation menu',
      'aria-controls': 'navbar-menu'
    }, [
      createElement('span', { className: 'navbar-toggle-icon' })
    ]);
    
    // Navigation links
    const linksList = createElement('ul', {
      className: 'navbar-links',
      id: 'navbar-menu',
      role: 'menubar'
    });
    
    this.options.links.forEach(link => {
      const li = createElement('li', { role: 'none' });
      const a = createElement('a', {
        className: `navbar-link${link.active ? ' active' : ''}`,
        href: link.href,
        role: 'menuitem',
        'aria-current': link.active ? 'page' : undefined
      }, link.text);
      
      li.appendChild(a);
      linksList.appendChild(li);
    });
    
    // Actions section (theme toggle)
    const actions = createElement('div', {
      className: 'navbar-actions'
    });
    
    if (this.options.showThemeToggle) {
      const themeToggle = new ThemeToggle();
      actions.appendChild(themeToggle.element);
    }
    
    // Assemble navbar
    container.appendChild(brand);
    container.appendChild(toggle);
    container.appendChild(linksList);
    container.appendChild(actions);
    navbar.appendChild(container);
    
    return navbar;
  }
  
  /**
   * Setup event listeners for interactive features
   */
  setupEventListeners() {
    const toggle = this.element.querySelector('.navbar-toggle');
    const menu = this.element.querySelector('.navbar-links');
    
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('open');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.element.contains(e.target) && menu.classList.contains('open')) {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('open');
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('open');
          toggle.focus();
        }
      });
    }
  }
  
  /**
   * Append navbar to document body
   */
  mount() {
    document.body.insertBefore(this.element, document.body.firstChild);
  }
}

// ============================================================================
// Breadcrumb Component
// ============================================================================

class Breadcrumb {
  /**
   * Create a breadcrumb navigation
   * @param {Array} items - Array of breadcrumb items {text, href}
   * @param {string} currentPage - Current page name (last item)
   */
  constructor(items, currentPage) {
    this.items = items || [];
    this.currentPage = currentPage;
    this.element = this.render();
  }
  
  /**
   * Render breadcrumb DOM structure
   * @returns {HTMLElement} Breadcrumb element
   */
  render() {
    const nav = createElement('nav', {
      className: 'breadcrumb',
      'aria-label': 'Breadcrumb'
    });
    
    // Home link
    const homeItem = createElement('div', { className: 'breadcrumb-item' });
    const homeLink = createElement('a', {
      className: 'breadcrumb-link',
      href: './index.html'
    }, '首页');
    homeItem.appendChild(homeLink);
    nav.appendChild(homeItem);
    
    // Intermediate items
    this.items.forEach(item => {
      const div = createElement('div', { className: 'breadcrumb-item' });
      const link = createElement('a', {
        className: 'breadcrumb-link',
        href: item.href
      }, item.text);
      div.appendChild(link);
      nav.appendChild(div);
    });
    
    // Current page (not a link)
    if (this.currentPage) {
      const currentDiv = createElement('div', { className: 'breadcrumb-item' });
      const currentSpan = createElement('span', {
        className: 'breadcrumb-current',
        'aria-current': 'page'
      }, this.currentPage);
      currentDiv.appendChild(currentSpan);
      nav.appendChild(currentDiv);
    }
    
    return nav;
  }
  
  /**
   * Insert breadcrumb after navbar or at top of container
   * @param {HTMLElement} container - Container to insert into
   */
  mount(container) {
    if (container) {
      container.insertBefore(this.element, container.firstChild);
    } else {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        navbar.insertAdjacentElement('afterend', this.element);
      } else {
        document.body.insertBefore(this.element, document.body.firstChild);
      }
    }
  }
}

// ============================================================================
// Toast Notification System
// ============================================================================

class Toast {
  static container = null;
  
  /**
   * Initialize toast container if not exists
   */
  static initContainer() {
    if (!Toast.container) {
      Toast.container = createElement('div', {
        className: 'toast-container',
        role: 'status',
        'aria-live': 'polite',
        'aria-atomic': 'true'
      });
      document.body.appendChild(Toast.container);
    }
  }
  
  /**
   * Show a toast notification
   * @param {Object} options - Toast options
   * @param {string} options.type - Type: 'success', 'error', 'warning', 'info'
   * @param {string} options.title - Toast title
   * @param {string} options.message - Toast message
   * @param {number} options.duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
   */
  static show(options = {}) {
    Toast.initContainer();
    
    const {
      type = 'info',
      title = '',
      message = '',
      duration = 5000
    } = options;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    const toast = createElement('div', {
      className: `toast ${type}`,
      role: 'alert'
    });
    
    // Icon
    const icon = createElement('div', {
      className: 'toast-icon'
    }, icons[type] || icons.info);
    
    // Content
    const content = createElement('div', { className: 'toast-content' });
    
    if (title) {
      const titleEl = createElement('div', {
        className: 'toast-title'
      }, title);
      content.appendChild(titleEl);
    }
    
    if (message) {
      const msgEl = createElement('div', {
        className: 'toast-message'
      }, message);
      content.appendChild(msgEl);
    }
    
    // Close button
    const closeBtn = createElement('button', {
      className: 'toast-close',
      'aria-label': 'Close notification'
    }, '×');
    
    // Assemble toast
    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(closeBtn);
    
    // Add to container
    Toast.container.appendChild(toast);
    
    // Close handler
    const dismiss = () => {
      toast.classList.add('hiding');
      setTimeout(() => {
        toast.remove();
      }, 250);
    };
    
    closeBtn.addEventListener('click', dismiss);
    
    // Auto-dismiss
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
    
    return toast;
  }
  
  /**
   * Convenience methods for different toast types
   */
  static success(title, message, duration) {
    return Toast.show({ type: 'success', title, message, duration });
  }
  
  static error(title, message, duration) {
    return Toast.show({ type: 'error', title, message, duration });
  }
  
  static warning(title, message, duration) {
    return Toast.show({ type: 'warning', title, message, duration });
  }
  
  static info(title, message, duration) {
    return Toast.show({ type: 'info', title, message, duration });
  }
}

// ============================================================================
// LoadingSpinner Component
// ============================================================================

class LoadingSpinner {
  /**
   * Create a loading spinner
   * @param {Object} options - Spinner options
   * @param {string} options.size - Size: 'sm', 'md', 'lg'
   * @param {string} options.label - Accessible label
   */
  constructor(options = {}) {
    this.options = {
      size: options.size || 'md',
      label: options.label || 'Loading...',
      ...options
    };
    
    this.element = this.render();
  }
  
  /**
   * Render spinner DOM structure
   * @returns {HTMLElement} Spinner element
   */
  render() {
    const wrapper = createElement('div', {
      className: 'spinner-wrapper',
      role: 'status',
      'aria-label': this.options.label
    });
    
    const sizeClass = this.options.size === 'sm' ? 'spinner-sm' :
                      this.options.size === 'lg' ? 'spinner-lg' : '';
    
    const spinner = createElement('div', {
      className: `spinner ${sizeClass}`
    });
    
    const srText = createElement('span', {
      className: 'sr-only',
      style: 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;'
    }, this.options.label);
    
    wrapper.appendChild(spinner);
    wrapper.appendChild(srText);
    
    return wrapper;
  }
  
  /**
   * Show spinner in a container
   * @param {HTMLElement} container - Container to append to
   */
  mount(container) {
    if (container) {
      container.appendChild(this.element);
    }
  }
  
  /**
   * Remove spinner from DOM
   */
  remove() {
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
  }
}

// ============================================================================
// ThemeToggle Component
// ============================================================================

class ThemeToggle {
  /**
   * Create a theme toggle button
   */
  constructor() {
    this.currentTheme = getCurrentTheme();
    this.element = this.render();
    this.updateIcon();
    this.setupEventListeners();
  }
  
  /**
   * Render toggle button
   * @returns {HTMLElement} Toggle button element
   */
  render() {
    const button = createElement('button', {
      className: 'theme-toggle',
      'aria-label': 'Toggle theme (current: ' + this.getThemeLabel() + ')',
      title: '切换主题'
    });
    
    return button;
  }
  
  /**
   * Get human-readable theme label
   * @returns {string} Theme label
   */
  getThemeLabel() {
    const labels = {
      'light': '浅色',
      'dark': '深色',
      'high-contrast': '高对比度'
    };
    return labels[this.currentTheme] || '浅色';
  }
  
  /**
   * Update button icon based on current theme
   */
  updateIcon() {
    const icons = {
      'light': '🌙',
      'dark': '☀️',
      'high-contrast': '◐'
    };
    
    this.element.textContent = icons[this.currentTheme] || icons.light;
    this.element.setAttribute('aria-label', '切换主题 (当前: ' + this.getThemeLabel() + ')');
  }
  
  /**
   * Setup click handler to cycle through themes
   */
  setupEventListeners() {
    this.element.addEventListener('click', () => {
      const themes = ['light', 'dark', 'high-contrast'];
      const currentIndex = themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      
      this.currentTheme = themes[nextIndex];
      applyTheme(this.currentTheme);
      this.updateIcon();
      
      // Show feedback
      Toast.info('主题已切换', `当前主题: ${this.getThemeLabel()}`, 2000);
    });
  }
}

// ============================================================================
// BackButton Component
// ============================================================================

class BackButton {
  /**
   * Create a back button
   * @param {Object} options - Button options
   * @param {string} options.text - Button text
   * @param {string} options.href - Back URL (defaults to index)
   */
  constructor(options = {}) {
    this.options = {
      text: options.text || '返回首页',
      href: options.href || './index.html',
      ...options
    };
    
    this.element = this.render();
  }
  
  /**
   * Render back button
   * @returns {HTMLElement} Back button element
   */
  render() {
    const button = createElement('a', {
      className: 'back-button',
      href: this.options.href,
      'aria-label': this.options.text
    }, this.options.text);
    
    return button;
  }
  
  /**
   * Insert button before first heading or at top of container
   * @param {HTMLElement} container - Container to insert into
   */
  mount(container) {
    if (container) {
      const firstHeading = container.querySelector('h1, h2');
      if (firstHeading) {
        firstHeading.insertAdjacentElement('beforebegin', this.element);
      } else {
        container.insertBefore(this.element, container.firstChild);
      }
    }
  }
}

// ============================================================================
// Card Component (Enhanced)
// ============================================================================

class Card {
  /**
   * Create an enhanced card
   * @param {Object} options - Card options
   */
  constructor(options = {}) {
    this.options = {
      icon: options.icon || '📄',
      title: options.title || 'Untitled',
      description: options.description || '',
      href: options.href || '#',
      tags: options.tags || [],
      loading: options.loading || false,
      ...options
    };
    
    this.element = this.render();
  }
  
  /**
   * Render card DOM structure
   * @returns {HTMLElement} Card element
   */
  render() {
    const card = createElement('a', {
      className: `card${this.options.loading ? ' loading' : ''}`,
      href: this.options.href
    });
    
    if (this.options.loading) {
      // Skeleton loading state
      const icon = createElement('div', { className: 'card-icon' });
      const title = createElement('h3', { className: 'card-title' });
      const desc = createElement('p', { className: 'card-description' });
      
      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(desc);
      
      return card;
    }
    
    // Header with icon
    const header = createElement('div', { className: 'card-header' });
    const icon = createElement('div', { className: 'card-icon' }, this.options.icon);
    const title = createElement('h3', { className: 'card-title' }, this.options.title);
    
    header.appendChild(icon);
    header.appendChild(title);
    
    // Description
    const description = createElement('p', {
      className: 'card-description'
    }, this.options.description);
    
    // Footer with tags
    const footer = createElement('div', { className: 'card-footer' });
    const tags = createElement('div', { className: 'card-tags' });
    
    this.options.tags.forEach(tag => {
      const tagEl = createElement('span', {
        className: 'card-tag'
      }, tag);
      tags.appendChild(tagEl);
    });
    
    footer.appendChild(tags);
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(footer);
    
    return card;
  }
}

// ============================================================================
// Export Components
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NavigationBar,
    Breadcrumb,
    Toast,
    LoadingSpinner,
    ThemeToggle,
    BackButton,
    Card,
    createElement,
    getCurrentTheme,
    applyTheme
  };
}

// Auto-initialize theme on load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const theme = getCurrentTheme();
    applyTheme(theme);
  });
}
