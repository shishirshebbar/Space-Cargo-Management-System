# Space Cargo Management System

## Overview

This application is designed to manage cargo within a space station, automating workflows to improve efficiency. It handles the placement, retrieval, rearrangement, waste disposal, and return planning of cargo.

## Features

- **Efficient Placement of Items:** Suggests optimal locations for new cargo based on space availability, priority, and accessibility.
- **Quick Retrieval of Items:** Suggests the fastest item retrieval.
- **Rearrangement Optimization:** Recommends rearranging items to optimize space usage.
- **Waste Disposal Management:** Categorizes unusable items as waste and suggests disposal containers.
- **Cargo Return Planning:** Provides a plan for waste return and space reclamation before resupply module undocking.
- **Logging:** Logs all actions performed by astronauts.
- **3D Visualization:** Offers a 3D view of the cargo arrangement.
- **Data Import/Export:** Imports and exports data using CSV files.

## Tech Stack

- **Backend:**
    - Node.js, Express.js
    - MongoDB
    - csv-parser, json2csv, multer, body-parser
- **Frontend:**
    - React
    - React-three/fiber
    - Tailwind CSS, Shadcn UI, Lucide React

## Algorithms

- **Priority-Based Placement:** Items are sorted by priority and placed in suitable containers within preferred zones.
- **Container Suitability:** Items are placed in containers only if they fit within the container's dimensions.
- **Waste Identification:** Items are identified as waste if they are expired or out of uses.
- **Return Plan Generation:** Waste items are selected for return, considering constraints like maximum weight.

## Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/shishirshebbar/Space-Cargo-Management-System.git
    cd Space-Cargo-Management-System
    ```

2. **Backend Setup:**

    - Navigate to the backend directory:

        ```bash
        cd backend
        ```

    - Install dependencies:

        ```bash
        npm install
        ```

    - Create a `.env` file and add your MongoDB connection string.
    - Run the backend:

        ```bash
        npm run dev
        ```

3. **Frontend Setup:**

    - Navigate to the frontend directory:

        ```bash
        cd frontend
        ```

    - Install dependencies:

        ```bash
        npm install
        ```

    - Run the frontend:

        ```bash
        npm run dev
        ```

## Functionality

The system manages cargo through several key operations:

- **Import/Export:** Imports item and container data from CSV files and exports arrangement data to CSV.
- **Item Management:** Adds, searches, retrieves, and places items. Items have properties like ID, name, dimensions, priority, usage limit, and expiry date.
- **Container Management:** Stores container information, including ID, zone, and dimensions.
- **Placement:** Suggests and records the placement of items into containers, considering space constraints and item properties.
- **Waste Management:** Identifies and manages waste items, including tracking their location and planning for their return.
- **Simulation:** Simulates time progression and item usage, including expiry.
- **Logging:** Records all actions performed within the system to track changes and aid in auditing.

## Key Endpoints

- `/api/import/items`: Imports items from a CSV file.
- `/api/import/containers`: Imports containers from a CSV file.
- `/api/export/arrangement`: Exports the current item arrangement to a CSV file.
- `/api/items/search`: Searches for an item by ID or name.
- `/api/items/retrieve`: Retrieves an item, updating its usage and potentially marking it as waste.
- `/api/items/place`: Places an item into a specified container.
- `/api/placement`: Places multiple items.
- `/api/simulation/day`: Simulates the progression of time.
- `/api/waste/identify`: Identifies items that have become waste.
- `/api/waste/return-plan`: Generates a plan for returning waste items.
- `/api/waste/complete-undocking`: Completes the waste undocking process.
- `/api/logs`: Retrieves logs of actions performed in the system.

## Data Structures

- **Items:** Stored with details like ID, name, dimensions, priority, usage limits, expiry date, container ID, zone, and position.
- **Containers:** Stored with ID, zone, and dimensions.
- **Waste:** Tracks items designated as waste, including the reason and previous container and position.
- **Logs:** Records actions with timestamps, user IDs, action types, item IDs, and details.

## Algorithms

- **Priority-Based Placement:** Items are sorted by priority and placed in suitable containers within preferred zones.
- **Container Suitability:** Items are placed in containers only if they fit within the container's dimensions.
- **Waste Identification:** Items are identified as waste if they are expired or out of uses.
- **Return Plan Generation:** Waste items are selected for return, considering constraints like maximum weight.

## Considerations

- The system uses CSV files for data import/export.
- The system includes logging of actions.
- The system simulates item usage and expiration.
