// mockNestedSyllabus.ts
// Mock data for the nested syllabus structure

// Define the nested syllabus data structure with sections, topics, and subtopics
export const mockNestedSyllabus = [
    {
        id: "section-1",
        section: "Introduction to Web Development",
        topics: [
            {
                id: "topic-1",
                title: "Web Fundamentals",
                subtopics: [
                    { id: "subtopic-1", title: "HTML5 Basics" },
                    { id: "subtopic-2", title: "CSS3 Fundamentals" },
                    { id: "subtopic-3", title: "JavaScript Essentials" },
                ],
            },
            {
                id: "topic-2",
                title: "Setting Up Development Environment",
                subtopics: [
                    { id: "subtopic-4", title: "Code Editors and IDEs" },
                    { id: "subtopic-5", title: "Browser Developer Tools" },
                    { id: "subtopic-6", title: "Version Control with Git" },
                ],
            },
        ],
    },
    {
        id: "section-2",
        section: "Frontend Development",
        topics: [
            {
                id: "topic-3",
                title: "Modern JavaScript",
                subtopics: [
                    { id: "subtopic-7", title: "ES6+ Features" },
                    { id: "subtopic-8", title: "Asynchronous JavaScript" },
                    { id: "subtopic-9", title: "JavaScript Modules" },
                ],
            },
            {
                id: "topic-4",
                title: "React.js Fundamentals",
                subtopics: [
                    { id: "subtopic-10", title: "Components and Props" },
                    { id: "subtopic-11", title: "State and Lifecycle" },
                    { id: "subtopic-12", title: "Hooks and Context API" },
                ],
            },
        ],
    },
    {
        id: "section-3",
        section: "Backend Development",
        topics: [
            {
                id: "topic-5",
                title: "Node.js Basics",
                subtopics: [
                    { id: "subtopic-13", title: "Node.js Runtime" },
                    { id: "subtopic-14", title: "NPM Package Management" },
                    { id: "subtopic-15", title: "File System Operations" },
                ],
            },
            {
                id: "topic-6",
                title: "Express.js Framework",
                subtopics: [
                    { id: "subtopic-16", title: "Routing and Middleware" },
                    { id: "subtopic-17", title: "RESTful API Design" },
                    { id: "subtopic-18", title: "Error Handling" },
                ],
            },
        ],
    },
    {
        id: "section-4",
        section: "Database Integration",
        topics: [
            {
                id: "topic-7",
                title: "MongoDB Fundamentals",
                subtopics: [
                    { id: "subtopic-19", title: "MongoDB Setup and Configuration" },
                    { id: "subtopic-20", title: "CRUD Operations" },
                    { id: "subtopic-21", title: "Mongoose ODM" },
                ],
            },
            {
                id: "topic-8",
                title: "SQL Databases",
                subtopics: [
                    { id: "subtopic-22", title: "PostgreSQL Basics" },
                    { id: "subtopic-23", title: "SQL Queries and Joins" },
                    { id: "subtopic-24", title: "Sequelize ORM" },
                ],
            },
        ],
    },
    {
        id: "section-5",
        section: "Deployment and DevOps",
        topics: [
            {
                id: "topic-9",
                title: "Deployment Strategies",
                subtopics: [
                    { id: "subtopic-25", title: "Heroku Deployment" },
                    { id: "subtopic-26", title: "AWS Basics" },
                    { id: "subtopic-27", title: "Docker Containers" },
                ],
            },
            {
                id: "topic-10",
                title: "CI/CD Pipelines",
                subtopics: [
                    { id: "subtopic-28", title: "GitHub Actions" },
                    { id: "subtopic-29", title: "Automated Testing" },
                    { id: "subtopic-30", title: "Monitoring and Logging" },
                ],
            },
        ],
    },
];

export default mockNestedSyllabus;