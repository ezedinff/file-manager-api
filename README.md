# File Manager API

## Description

The File Manager API is crafted for a coding challenge, offering a robust solution for managing file uploads, downloads, and listing within specified folders. It's designed to streamline file management tasks, making it easier for users to manage their files effectively. This API uses NestJS for the backend and PostgreSQL to store file and folder metadata, ensuring high performance and reliability.

## Features

- **File Upload**: Upload files to a specified folder.
- **File Download**: Download files by specifying the file name and folder.
- **List Files**: Retrieve a list of all files within a specified folder.

## Getting Started

### Running with Docker

Ensure you have Docker installed on your machine. To start the PostgreSQL database, run:

```bash
docker-compose up -d
```

This command initializes a PostgreSQL instance configured for use with the File Manager API.

```bash
# Install dependencies
yarn install

# Start the application
yarn start
```

### API Endpoints

#### 1. File Upload

- **Endpoint**: \`POST /file-manager/upload\`
- **Description**: Uploads a file to a specified folder.
- **Request**:
  - Form data with the following keys:
    - \`file\`: The file to upload.
    - \`folder\`: The folder where the file will be uploaded.

```plaintext
POST http://localhost:3000/file-manager/upload
Content-Type: multipart/form-data

form-data:
  file: (binary)
  folder: images
```

- **Response Example** (HTTP 201 Created):
  
```json
{
    "message": "File uploaded successfully",
    "fileDetails": {
        "name": "765.webp",
        "path": "uploads/images/765.webp",
        "folder": {
            "id": 3,
            "name": "images",
            "path": "uploads/images"
        },
        "id": 4
    }
}
```

#### 2. List Files

- **Endpoint**: \`GET /file-manager/files\`
- **Description**: Lists all files within a specified folder.
- **Query Parameters**:
  - \`folder\`: The name of the folder to list files from.

```plaintext
GET http://localhost:3000/file-manager/files?folder=images
```

- **Response Example** (HTTP 200 OK):
  
```json
[
    {
        "id": 4,
        "name": "765.webp",
        "path": "uploads/images/765.webp",
        "folder": {
            "id": 3,
            "name": "images",
            "path": "uploads/images"
        }
    }
]
```

#### 3. File Download

- **Endpoint**: \`GET /file-manager/download\`
- **Description**: Downloads a file by specifying the file name and folder.
- **Query Parameters**:
  - \`fileName\`: The name of the file to download.
  - \`folder\`: The folder where the file is located.

```plaintext
GET http://localhost:3000/file-manager/download?fileName=765.webp&folder=images
```

- **Response**: Binary file data.
