# Staffly Frontend – User Interface Layer 🎨

Staffly Frontend is the client-side interface of the Staffly event staffing platform, developed to provide an intuitive experience for both event administrators (**Admins**) and event workers (**Applicants**).

Built using React.js, the frontend serves as the interaction layer between users and the backend API, allowing users to browse events, manage applications, monitor staffing requirements, and interact with the platform in real time.

Unlike traditional static websites, Staffly uses a modern Single Page Application (SPA) architecture that dynamically updates content without requiring full-page reloads.

---

# 🛠️ Tech Stack

* **Framework:** React.js
* **Language:** JavaScript (ES6+)
* **Routing:** React Router DOM
* **HTTP Client:** Fetch API
* **State Management:** React Hooks (useState, useEffect, useMemo)
* **Styling:** CSS3
* **Build Tool:** Vite

---

# ⚙️ Core Frontend Features

### **1. Event Discovery Interface**

Applicants can browse available event opportunities through a searchable and filterable event feed.

Features include:

* Event category filtering
* Location filtering
* Availability filtering
* Date sorting
* Dynamic search functionality

---

### **2. Role Registration Workflow**

Applicants can:

* View detailed event information
* Select available staffing roles
* Submit applications
* Receive immediate registration feedback

All registration requests are communicated to the backend using asynchronous HTTP requests.

---

### **3. Administrative Management Dashboard**

Administrators can:

* Create new events
* Edit existing events
* View staffing requirements
* Monitor submitted applications
* Track event performance

---

### **4. Dynamic User Experience**

React component state allows Staffly to update the user interface instantly after API responses without requiring page refreshes.

Examples include:

* Registration confirmations
* Event list updates
* Dashboard statistics refreshes
* Application status changes

---

# 🚀 Local Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/maysana26/staffly-app.git
cd staffly-app
```

### **2. Install Project Dependencies**

```bash
npm install
```

### **3. Configure Backend Connection**

Ensure the backend API server is running locally.

Update API endpoints if required:

```javascript
http://localhost:5000/api/
```

### **4. Start the Development Server**

```bash
npm run dev
```

The frontend application should now be running locally and accessible through the browser.

---

# 🧭 Application Pages

## 🔐 Authentication Pages

### Login

Allows registered users to authenticate and access their personalized workspace.

### Sign Up

Creates new Applicant or Admin accounts.

---

## 🏃 Applicant Pages

### Explore Events

Displays all available event opportunities retrieved from the backend API.

Features:

* Search functionality
* Category filtering
* Location filtering
* Event sorting

### Register Event

Allows applicants to:

* View event details
* Select available roles
* Submit applications

### My Events

Displays all registered event assignments and application statuses.

### Profile

Displays applicant information including:

* Personal details
* Skills
* Points
* Rankings
* Performance feedback

---

## 💼 Admin Pages

### Dashboard

Provides a summary of platform activity including:

* Total events
* Total applicants
* Staffing statistics
* Recent activity

### Manage Events

Allows administrators to:

* Create events
* Edit events
* Monitor staffing requirements

### Applications Management

Displays submitted applications for review and workforce planning.

---

# 🔄 Frontend Request–Response Flow

The frontend communicates with the backend using HTTP requests.

Example Registration Flow:

1. User selects an event role.
2. React captures the submit action.
3. A POST request is sent to:

```http
/api/applicant/register
```

4. The backend validates and stores the application.
5. A success response is returned.
6. React updates component state.
7. The user immediately sees a confirmation message.

This architecture allows Staffly to provide a fast and responsive user experience without full-page reloads.

---

# 👥 User Roles

## Admin

* Manage events
* View applications
* Monitor staffing requirements
* Access administrative dashboards

## Applicant

* Browse available events
* Register for staffing roles
* View assigned events
* Track application status
* Receive performance feedback

---

# 📄 License

This project is intended for educational and academic purposes.
