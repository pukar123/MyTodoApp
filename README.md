**Todo App**

A simple todo app built with ASP.NET Core and Angular.

**Features**

Demo login
View todo items
Add todo items
Delete todo items
Protected API endpoints

**Demo login details**

Username: demo@todo.local
Password: Demo123!

The login is for demonstration purposes only.

**API endpoints**

Login: POST /api/auth/login
View todos: GET /api/todos
Add a todo: POST /api/todos
Delete a todo: DELETE /api/todos/{id}

The todo endpoints require a valid bearer token.

**Storage**

Todo items and login tokens are stored in memory. Restarting the API clears the todo items and signs out all users.

**Project structure**

src/TodoApp.Domain - Core todo entity and rules
src/TodoApp.Application - Application services and interfaces
src/TodoApp.Infrastructure - In-memory storage and demo authentication
src/TodoApp.Api - Web API and controllers
frontend - Angular application
tests - Backend unit tests
