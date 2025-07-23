// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    const API_BASE_URL = 'http://127.0.0.1:8000/api';
    let authToken = localStorage.getItem('authToken');
    let currentUsername = localStorage.getItem('currentUsername');

    // --- Element Selectors ---
    const navLinks = document.getElementById('nav-links');
    const viewContainer = document.getElementById('view-container');
    const authView = document.getElementById('auth-view');
    const createPostView = document.getElementById('create-post-view');
    const postsView = document.getElementById('posts-view');
    const postsContainer = document.getElementById('posts-container');
    const errorMessage = document.getElementById('error-message');

    // Form selectors
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const createPostForm = document.getElementById('create-post-form');
    const editPostSection = document.getElementById('edit-post-section');
    const editPostForm = document.getElementById('edit-post-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');


    // --- API Helper Functions ---

    /**
     * A generic fetch function to make API requests.
     * @param {string} endpoint - The API endpoint to call.
     * @param {object} options - The options for the fetch request (method, headers, body).
     * @returns {Promise<object>} - The JSON response from the API.
     */
    async function apiRequest(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (authToken) {
            headers['Authorization'] = `Token ${authToken}`;
        }

        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: response.statusText }));
                throw new Error(JSON.stringify(errorData));
            }
            // Handle responses that might not have a body (e.g., 204 No Content)
            if (response.status === 204) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            showError(error.message);
            throw error;
        }
    }

    // --- UI Update Functions ---

    /**
     * Updates the UI based on whether the user is logged in or not.
     */
    function updateUI() {
        navLinks.innerHTML = ''; // Clear existing links
        if (authToken) {
            // User is logged in
            navLinks.innerHTML = `
                <span>Welcome, ${currentUsername}</span>
                <a href="#" id="home-link">Home</a>
                <a href="#" id="create-post-link">Create Post</a>
                <button id="logout-btn">Logout</button>
            `;
            showView('posts');
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
            document.getElementById('create-post-link').addEventListener('click', () => showView('create'));
            document.getElementById('home-link').addEventListener('click', () => showView('posts'));
        } else {
            // User is logged out
            navLinks.innerHTML = `
                <a href="#" id="login-register-link">Login / Register</a>
            `;
            showView('auth');
            document.getElementById('login-register-link').addEventListener('click', () => showView('auth'));
        }
        fetchPosts();
    }

    /**
     * Shows a specific view and hides others.
     * @param {string} viewName - The name of the view to show ('auth', 'posts', 'create', 'edit').
     */
    function showView(viewName) {
        // Hide all main views first
        authView.classList.add('hidden');
        postsView.classList.add('hidden');
        createPostView.classList.add('hidden');
        editPostSection.classList.add('hidden'); // Ensure edit form is hidden

        // Show the requested view
        if (viewName === 'auth') {
            authView.classList.remove('hidden');
        } else if (viewName === 'posts') {
            postsView.classList.remove('hidden');
        } else if (viewName === 'create') {
            createPostView.classList.remove('hidden');
            // Ensure create form is visible and edit form is not
            createPostForm.classList.remove('hidden');
        } else if (viewName === 'edit') {
            createPostView.classList.remove('hidden');
            createPostForm.classList.add('hidden');
            editPostSection.classList.remove('hidden');
        }
    }

    /**
     * Displays an error message to the user.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        try {
            const parsedError = JSON.parse(message);
            const errorParts = [];
            for (const key in parsedError) {
                errorParts.push(`${key}: ${parsedError[key].join(', ')}`);
            }
            errorMessage.textContent = errorParts.join('; ');
        } catch (e) {
            errorMessage.textContent = message;
        }
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
    }


    // --- Event Handlers ---

    async function handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        try {
            await apiRequest('/auth/users/', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            // Automatically log in after successful registration
            await handleLogin(e, username, password);
        } catch (error) {
            // Error is already shown by apiRequest
        }
    }

    async function handleLogin(e, username, password) {
        e.preventDefault();
        const u = username || document.getElementById('login-username').value;
        const p = password || document.getElementById('login-password').value;
        try {
            const data = await apiRequest('/auth/token/login/', {
                method: 'POST',
                body: JSON.stringify({ username: u, password: p }),
            });
            authToken = data.auth_token;
            currentUsername = u;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUsername', currentUsername);
            updateUI();
        } catch (error) {
             // Error is already shown by apiRequest
        }
    }

    function handleLogout() {
        // No need to call the API for token-based auth, just clear local state
        authToken = null;
        currentUsername = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUsername');
        updateUI();
    }

    async function handleCreatePost(e) {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        try {
            await apiRequest('/posts/', {
                method: 'POST',
                body: JSON.stringify({ title, content }),
            });
            createPostForm.reset();
            updateUI(); // Refreshes the post list
        } catch (error) {
            // Error handling is in apiRequest
        }
    }

    async function handleEditPost(e) {
        e.preventDefault();
        const id = document.getElementById('edit-post-id').value;
        const title = document.getElementById('edit-post-title').value;
        const content = document.getElementById('edit-post-content').value;
        try {
            await apiRequest(`/posts/${id}/`, {
                method: 'PUT',
                body: JSON.stringify({ title, content }),
            });
            editPostForm.reset();
            updateUI();
        } catch (error) {
            // Error handling is in apiRequest
        }
    }

    async function handleDeletePost(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                await apiRequest(`/posts/${postId}/`, { method: 'DELETE' });
                fetchPosts(); // Refresh the list
            } catch (error) {
                // Error handling is in apiRequest
            }
        }
    }

    function showEditForm(post) {
        document.getElementById('edit-post-id').value = post.id;
        document.getElementById('edit-post-title').value = post.title;
        document.getElementById('edit-post-content').value = post.content;
        showView('edit');
    }

    // --- Data Fetching and Rendering ---

    /**
     * Fetches all posts from the API and renders them.
     */
    async function fetchPosts() {
        postsContainer.innerHTML = '<p>Loading posts...</p>';
        try {
            // Use a different endpoint for authenticated vs unauthenticated users if needed
            // For this app, the public endpoint is fine. Permissions handle the rest.
            const posts = await apiRequest('/posts/', { method: 'GET' });
            renderPosts(posts);
        } catch (error) {
            postsContainer.innerHTML = '<p class="error">Could not fetch posts.</p>';
        }
    }

    /**
     * Renders a list of posts to the page.
     * @param {Array<object>} posts - An array of post objects.
     */
    function renderPosts(posts) {
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts yet. Be the first to create one!</p>';
            return;
        }

        postsContainer.innerHTML = ''; // Clear the container
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            const postDate = new Date(post.created_at).toLocaleString();

            let actionsHtml = '';
            // Show edit/delete buttons only if the logged-in user is the author
            if (authToken && currentUsername === post.author) {
                actionsHtml = `
                    <div class="post-actions">
                        <button class="edit-btn" data-id="${post.id}">Edit</button>
                        <button class="delete-btn" data-id="${post.id}">Delete</button>
                    </div>
                `;
            }

            postElement.innerHTML = `
                <div class="post-header">
                    <h3 class="post-title">${post.title}</h3>
                    <span class="post-meta">by ${post.author} on ${postDate}</span>
                </div>
                <p class="post-content">${post.content}</p>
                ${actionsHtml}
            `;
            postsContainer.appendChild(postElement);

            // Add event listeners for edit/delete buttons if they exist
            if (actionsHtml) {
                postElement.querySelector('.edit-btn').addEventListener('click', () => showEditForm(post));
                postElement.querySelector('.delete-btn').addEventListener('click', () => handleDeletePost(post.id));
            }
        });
    }

    // --- Initial Setup ---
    
    // Attach event listeners to forms
    registerForm.addEventListener('submit', handleRegister);
    loginForm.addEventListener('submit', handleLogin);
    createPostForm.addEventListener('submit', handleCreatePost);
    editPostForm.addEventListener('submit', handleEditPost);
    cancelEditBtn.addEventListener('click', () => updateUI());

    // Initial UI setup on page load
    updateUI();
});
