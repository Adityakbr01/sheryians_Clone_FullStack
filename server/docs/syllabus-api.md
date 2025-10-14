# Course Syllabus API Documentation

This document describes the API endpoints for managing course syllabi.

## Models

### Syllabus Structure

The syllabus follows a hierarchical structure with the following levels:

- **Sections**: Top-level organization of the syllabus (e.g., "Web Development Fundamentals")
  - **Topics**: Main subjects within a section (e.g., "HTML & CSS")
    - **Subtopics**: Specific areas within a topic (e.g., "HTML Basics")
      - **Nested Subtopics**: Further breakdown of subtopics (optional)

## API Endpoints

### Get Syllabus by Course ID

Retrieves the complete syllabus for a specific course.

- **URL**: `/syllabus/course/:courseId`
- **Method**: `GET`
- **Auth Required**: No (Public endpoint)
- **Cache**: Medium TTL
- **URL Params**: 
  - Required: `courseId=[string]` - MongoDB ObjectId of the course

**Success Response**:
- **Code**: 200 OK
- **Content Example**:
```json
{
  "success": true,
  "message": "Course syllabus retrieved successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "courseId": "60d21b4667d0d8992e610c80",
    "syllabus": [
      {
        "title": "Web Development Fundamentals",
        "topics": [
          {
            "title": "HTML & CSS",
            "subTopics": [
              {
                "title": "HTML Basics",
                "subTopics": [
                  {"title": "HTML Document Structure"},
                  {"title": "Semantic HTML"}
                ]
              }
            ]
          }
        ]
      }
    ],
    "createdAt": "2023-06-18T14:34:12.123Z",
    "updatedAt": "2023-06-18T14:34:12.123Z"
  },
  "timestamp": "2023-06-18T14:35:22.456Z",
  "path": "/syllabus/course/60d21b4667d0d8992e610c80"
}
```

**Error Response**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Invalid course ID format" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Syllabus not found" }`

### Create Course Syllabus

Creates a new syllabus for a specific course.

- **URL**: `/syllabus/course/:courseId`
- **Method**: `POST`
- **Auth Required**: Yes (Admin role)
- **URL Params**: 
  - Required: `courseId=[string]` - MongoDB ObjectId of the course
- **Request Body**:
```json
{
  "syllabus": [
    {
      "title": "Section Title",
      "topics": [
        {
          "title": "Topic Title",
          "subTopics": [
            {
              "title": "Subtopic Title",
              "subTopics": [] // Optional nested subtopics
            }
          ]
        }
      ]
    }
  ]
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**: Same structure as GET response

**Error Response**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Invalid syllabus data", "errors": [...] }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Course not found" }`
- **Code**: 409 Conflict
  - **Content**: `{ "success": false, "message": "Syllabus already exists for this course" }`

### Update Course Syllabus

Updates an existing syllabus for a specific course.

- **URL**: `/syllabus/course/:courseId`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin role)
- **URL Params**: 
  - Required: `courseId=[string]` - MongoDB ObjectId of the course
- **Request Body**: Same structure as POST request

**Success Response**:
- **Code**: 200 OK
- **Content**: Same structure as GET response

**Error Response**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Invalid syllabus data", "errors": [...] }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Syllabus not found for this course" }`

### Delete Course Syllabus

Deletes a syllabus for a specific course.

- **URL**: `/syllabus/course/:courseId`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin role)
- **URL Params**: 
  - Required: `courseId=[string]` - MongoDB ObjectId of the course

**Success Response**:
- **Code**: 200 OK
- **Content**: `{ "success": true, "message": "Course syllabus deleted successfully" }`

**Error Response**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Invalid course ID format" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Syllabus not found for this course" }`

## Example Usage

### Example Syllabus JSON

```json
{
  "syllabus": [
    {
      "title": "Web Development Fundamentals",
      "topics": [
        {
          "title": "HTML & CSS",
          "subTopics": [
            {
              "title": "HTML Basics",
              "subTopics": [
                {
                  "title": "HTML Document Structure"
                },
                {
                  "title": "Semantic HTML"
                }
              ]
            },
            {
              "title": "CSS Fundamentals",
              "subTopics": [
                {
                  "title": "Selectors and Specificity"
                },
                {
                  "title": "Box Model"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```