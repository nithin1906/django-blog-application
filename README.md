Full-Stack Blog Application
This is a complete full-stack blog application built with Django and the Django REST Framework on the backend, and a simple HTML, CSS, and JavaScript frontend. It features user authentication, full CRUD (Create, Read, Update, Delete) functionality for blog posts, and a secure REST API architecture.

Features
User Authentication: Secure user registration and login system using Django's built-in authentication.

RESTful API: A well-structured API for all blog functionalities.

POST /api/register/ - Register a new user.

POST /api/login/ - Log in and receive an authentication token.

GET /api/posts/ - View all blog posts.

POST /api/posts/ - Create a new blog post (authentication required).

GET /api/posts/{id}/ - Retrieve a single blog post.

PUT /api/posts/{id}/ - Update a blog post (author only).

DELETE /api/posts/{id}/ - Delete a blog post (author only).

CRUD Operations: Authenticated users can create, read, update, and delete their own blog posts.

Database Integration: Uses PostgreSQL for robust and scalable data storage.

Simple Frontend: A clean user interface built with HTML, CSS, and vanilla JavaScript to interact with the backend API.

Technologies Used
Backend: Python, Django, Django REST Framework

Database: PostgreSQL

Frontend: HTML, CSS, JavaScript

API Testing: Tools like Postman or Insomnia can be used to interact with the API endpoints.

Project Setup
Prerequisites
Python 3.8+

PostgreSQL installed and running.

pip for package management.

1. Clone the Repository
git clone <your-github-repo-url>
cd <repository-name>


2. Set Up the Backend
a. Create a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`


b. Install dependencies:

pip install django djangorestframework psycopg2-binary djoser


c. Configure the database in blog_project/settings.py:

Update the DATABASES section with your PostgreSQL credentials.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


d. Run database migrations:

python manage.py migrate


e. Start the Django development server:

python manage.py runserver


The API will be accessible at http://127.0.0.1:8000/.

3. Set Up the Frontend
Simply open the index.html file in your web browser. The JavaScript code is configured to communicate with the Django backend running on http://127.0.0.1:8000.

How to Use
1. Register a User: Use the registration form on the frontend or send a POST request to /api/register/.

2. Log In: Use the login form to get an authentication token. The token is stored in the browser's local storage.

3. Manage Posts: Once logged in, you can create new posts. You will also see "Edit" and "Delete" buttons on the posts you have authored.