# Node.js Menu Management API

This is a RESTful API built with Node.js, Express, and MongoDB for managing a restaurant's menu. The API supports a hierarchical structure of Categories, Subcategories, and Items.

This project was completed as part of an internship assignment.

---

## ✨ Features

* **CRUD Operations:** Full Create, Read, Update, and Delete functionality for:
    * Categories
    * Subcategories
    * Items
* **Hierarchical Structure:** Items can be linked to a Category and an optional Subcategory.
* **Tax Inheritance:** Subcategories and Items inherit tax details from their parent Category by default.
* **Dynamic Calculations:** Item `totalAmount` is dynamically calculated (`baseAmount` - `discount`).
* **Search:** A dedicated endpoint to search for items by name.

---

## 🚀 Tech Stack

* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web framework for building the API.
* **MongoDB:** NoSQL database for storing menu data.
* **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
* **dotenv:** For managing environment variables.
* **cors:** For enabling Cross-Origin Resource Sharing.

---

## 🔧 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or newer)
* [npm](https://www.npmjs.com/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (a free cloud database) or a local MongoDB installation.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add the following, replacing the placeholder with your own MongoDB connection string:

    ```
    # Port for the server
    PORT=5000

    # Your MongoDB connection string
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/menu-db?retryWrites=true&w=majority
    ```

4.  **Run the server (for development):**
    This command uses `nodemon` to automatically restart the server on file changes.
    ```sh
    npm run dev
    ```

5.  **Run the server (for production):**
    ```sh
    npm start
    ```

The server will be running at `http://localhost:5000`.

---

## 📚 API Endpoints

All endpoints are prefixed with `/api`.

### Categories

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/categories` | Create a new category. |
| `GET` | `/api/categories` | Get all categories. |
| `GET` | `/api/categories/:id` | Get a single category by its ID. |
| `PATCH` | `/api/categories/:id` | Update a category's attributes. |

### Subcategories

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/subcategories` | Create a new subcategory. |
| `GET` | `/api/subcategories` | Get all subcategories. |
| `GET` | `/api/subcategories/:id` | Get a single subcategory by its ID. |
| `GET` | `/api/subcategories/category/:categoryId` | Get all subcategories under a specific category. |
| `PATCH` | `/api/subcategories/:id` | Update a subcategory's attributes. |

### Items

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/items` | Create a new item. |
| `GET` | `/api/items` | Get all items. |
| `GET` | `/api/items/search` | Search for items by name (e.g., `/api/items/search?name=Pizza`). |
| `GET` | `/api/items/:id` | Get a single item by its ID. |
| `GET` | `/api/items/category/:categoryId` | Get all items under a specific category. |
| `GET` | `/api/subcategories/:subcategoryId/items` | Get all items under a specific subcategory. |
| `PATCH` | `/api/items/:id` | Update an item's attributes. |

---

## ❓ Assignment Questions

### Which database you have chosen and why?

I chose **MongoDB** (using Mongoose) because its document-based model is a natural fit for the hierarchical `Category` -> `Subcategory` -> `Item` data structure. This design allowed for flexible relationships (like optional subcategories) without the complexity of SQL joins. As I primarily work with the MERN stack, using MongoDB provides a seamless, JSON-based workflow, and its scalability is ideal for read-heavy operations like fetching a menu.

### 3 things that you learned from this assignment?

1.  **Refining Database Schema Design:** I gained practical experience in structuring hierarchical data, deciding when to reference versus embed documents, and ensuring data consistency (e.g., implementing tax inheritance).
2.  **Building Modular REST APIs:** This project reinforced the importance of a clean architecture (separating models, routes, and controllers) for building production-ready APIs, particularly around error handling and reusable logic.
3.  **Implementing Backend Business Logic:** I learned how to implement dynamic rules directly into the API, such as the automatic tax inheritance from a parent category and the server-side calculation of an item's `totalAmount`, making the API both reliable and predictable.

### What was the most difficult part of the assignment?

The most challenging aspect was structuring the routes to be intuitive, readable, and free of conflicts. Specifically:

* Ensuring the `/items/search` route was defined *before* the `/items/:id` route to prevent the router from misinterpreting "search" as an ID.
* Implementing multiple item-fetching methods (by category, by subcategory, and by search) while keeping the controller logic clean and avoiding code duplication.
* Managing the tax inheritance logic consistently across the different models.

This experience strengthened my understanding of Express routing order and backend logic flow.

### What you would have done differently given more time?

Given more time, I would have enhanced the project's robustness and feature set:

1.  **Advanced Validation:** Implement schema validation using a library like **Joi** or **Zod** to provide more granular, field-level error messages, especially for prices and tax fields.
2.  **Authentication & Authorization:** Secure the `POST`, `PATCH`, and `DELETE` endpoints using JWT-based authentication, similar to how I've implemented it in past MERN projects, so only an "Admin" role could modify the menu.
3.  **Image Uploads:** Integrate **Cloudinary** or **AWS S3** to support actual file uploads for item and category images, rather than just storing a URL string.
4.  **Unit & Integration Tests:** Write tests using **Jest** and **Supertest** to validate the controllers and Mongoose operations, ensuring long-term code reliability and maintainability.
