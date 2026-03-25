# Article Social Media Platform

A full-stack, community-driven discussion platform inspired by the architecture of Reddit. This project serves as a foundational milestone in my web development journey, transitioning from theoretical concepts to practical, scalable implementation.


## 🏛️ Project Genesis & Educational Journey
This application was developed following my participation as a finalist in the **UBS India Hackathon**. That experience served as a significant professional "eye-opener," revealing the complexities of real-world software engineering. This project was built to bridge that gap, moving from entry-level experimentation to a structured understanding of full-stack ecosystems.


## 🛠️ Technical Stack
* **Runtime Environment:** Node.js
* **Backend Framework:** Express.js (RESTful Routing)
* **Database:** MongoDB with Mongoose ODM (Object Data Modeling)
* **Frontend Engine:** EJS (Embedded JavaScript) for Server-Side Rendering (SSR)
* **Styling:** Bootstrap 5 (Responsive UI/UX)
* **Authentication:** Passport.js (Session-based authentication)
* **Media Management:** Cloudinary API (Cloud-based image hosting and transformations)


## 🚀 Key Implementations & Lessons

### 1. Robust Authentication & Authorization
* Implemented **Passport.js** for secure session management and user authentication.
* Developed authorization logic to ensure data integrity, restricting "Edit" and "Delete" privileges exclusively to the original content creators.

### 2. Relational Data Modeling
* Utilized Mongoose to establish relationships between Users, Posts, and Comments.
* Managed data persistence for complex structures, including multimedia arrays and nested user IDs.

### 3. Server-Side Rendering (SSR) Logic
* Architected a modular frontend using **EJS partials** and layouts to maintain DRY (Don't Repeat Yourself) principles.
* Successfully resolved technical hurdles regarding recursive layout calls (Maximum call stack errors) and optimized directory traversal for nested views.

### 4. Multimedia Integration
* Integrated multipart/form-data handling for image uploads.
* Implemented a responsive Bootstrap carousel for multi-image post displays.


## 📈 Technical Challenges Overcome

* **Asynchronous Flow Control:** Mastered the use of `async/await` to handle database I/O, ensuring data is fully resolved before rendering the view layer.
* **Directory Management:** Overcame pathing complexities within nested folders (e.g., `/views/posts/`) to ensure consistent rendering of global partials.
* **Validation Logic:** Implemented both client-side (Bootstrap 5) and server-side validation to ensure data quality and application stability.


## 💻 Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/article-social-platform.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Configuration:** Create a `.env` file and populate it with your MongoDB URI, Cloudinary credentials, and session secret.
4.  **Launch:**
    ```bash
    node app.js
    ```
---