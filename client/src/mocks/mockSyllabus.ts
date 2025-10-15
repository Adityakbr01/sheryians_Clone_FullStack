import { Section } from '@/types/course';

// Mock data for course syllabus
export const mockNestedSyllabus: Section[] = [
    {
        title: "Introduction to Web Development",
        topics: [
            {
                title: "Web Fundamentals",
                subTopics: [
                    { title: "HTML5 Basics" },
                    { title: "CSS3 Fundamentals" },
                    { title: "JavaScript Essentials" },
                ],
            },
            {
                title: "Setting Up Development Environment",
                subTopics: [
                    { title: "Code Editors and IDEs" },
                    { title: "Browser Developer Tools" },
                    { title: "Version Control with Git" },
                ],
            },
        ],
    },
    {
        title: "Frontend Development",
        topics: [
            {
                title: "Modern JavaScript",
                subTopics: [
                    { title: "ES6+ Features" },
                    { title: "Asynchronous JavaScript" },
                    { title: "JavaScript Modules" },
                ],
            },
            {
                title: "React.js Fundamentals",
                subTopics: [
                    { title: "Components and Props" },
                    { title: "State and Lifecycle" },
                    { title: "Hooks and Context API" },
                ],
            },
        ],
    },
    {
        title: "Backend Development",
        topics: [
            {
                title: "Node.js Basics",
                subTopics: [
                    { title: "Node.js Runtime" },
                    { title: "NPM Package Management" },
                    { title: "File System Operations" },
                ],
            },
            {
                title: "Express.js Framework",
                subTopics: [
                    { title: "Routing and Middleware" },
                    { title: "RESTful API Design" },
                    { title: "Error Handling" },
                ],
            },
        ],
    },
    {
        title: "Database Integration",
        topics: [
            {
                title: "MongoDB Fundamentals",
                subTopics: [
                    { title: "MongoDB Setup and Configuration" },
                    { title: "CRUD Operations" },
                    { title: "Mongoose ODM" },
                ],
            },
            {
                title: "SQL Databases",
                subTopics: [
                    { title: "PostgreSQL Basics" },
                    { title: "SQL Queries and Joins" },
                    { title: "Sequelize ORM" },
                ],
            },
        ],
    },
    {
        title: "Deployment and DevOps",
        topics: [
            {
                title: "Deployment Strategies",
                subTopics: [
                    { title: "Heroku Deployment" },
                    { title: "AWS Basics" },
                    { title: "Docker Containers" },
                ],
            },
            {
                title: "CI/CD Pipelines",
                subTopics: [
                    { title: "GitHub Actions" },
                    { title: "Automated Testing" },
                    { title: "Monitoring and Logging" },
                ],
            },
        ],
    },
];

export default mockNestedSyllabus;