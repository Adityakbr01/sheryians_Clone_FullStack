import { clearRouteCache } from "@/middleware/custom/cache.middleware";
import syllabusService from "@/services/syllabus.service";
import { ISection, ISubTopic, ITopic } from "@/types/models/courses/courseSyllabus";
import { ApiError } from "@/utils/ApiError";
import { ApiResponder } from "@/utils/response";
import { wrapAsync } from "@/utils/wrapAsync";
import { Request, Response } from "express";
const syllabusController = {
    getSyllabusByCourseId: wrapAsync(async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        const syllabus = await syllabusService.getSyllabusByCourseId(courseId);
        ApiResponder.success(
            res,
            200,
            "Course syllabus retrieved successfully",
            syllabus
        );
    }),
    createCourseSyllabus: wrapAsync(async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        const syllabusData = req.body.syllabus as ISection[];
        if (!syllabusData || !Array.isArray(syllabusData)) {
            throw new ApiError(400, "Valid syllabus data is required");
        }

        const newSyllabus = await syllabusService.createCourseSyllabus(courseId, syllabusData);
        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(
            res,
            201,
            "Course syllabus created successfully",
            newSyllabus
        );
    }),
    updateCourseSyllabus: wrapAsync(async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        const syllabusData = req.body.syllabus as ISection[];
        if (!syllabusData || !Array.isArray(syllabusData)) {
            throw new ApiError(400, "Valid syllabus data is required");
        }

        const updatedSyllabus = await syllabusService.updateCourseSyllabus(courseId, syllabusData);
        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(
            res,
            200,
            "Course syllabus updated successfully",
            updatedSyllabus
        );
    }),

    deleteCourseSyllabus: wrapAsync(async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        await syllabusService.deleteCourseSyllabus(courseId);
        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(
            res,
            200,
            "Course syllabus deleted successfully"
        );
    }),
    // Section Operations
    addSection: wrapAsync(async (req: Request, res: Response) => {
        const { courseId } = req.params;
        if (!courseId) {
            throw new ApiError(400, "Course ID is required");
        }

        const sectionData = req.body as ISection;
        if (!sectionData || !sectionData.title) {
            throw new ApiError(400, "Valid section data is required");
        }

        const syllabus = await syllabusService.addSection(courseId, sectionData);
        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(res, 201, "Section added successfully", syllabus);
    }),

    updateSection: wrapAsync(async (req: Request, res: Response) => {
        const { courseId, sectionIndex } = req.params;
        if (!courseId || !sectionIndex) {
            throw new ApiError(400, "Course ID and section index are required");
        }

        const sectionData = req.body as ISection;
        if (!sectionData) {
            throw new ApiError(400, "Valid section data is required");
        }

        console.log("Received section update request:");
        console.log("Section index:", sectionIndex);
        console.log("Section data from client:", JSON.stringify(sectionData, null, 2));

        // Get existing section data to preserve structure
        const existingSyllabus = await syllabusService.getSyllabusByCourseId(courseId);
        const existingSection = existingSyllabus.syllabus[parseInt(sectionIndex)];

        if (!existingSection) {
            throw new ApiError(404, "Section not found");
        }

        console.log("Existing section:", JSON.stringify(existingSection, null, 2));

        // Create updated section by merging existing data with new data
        // This ensures we preserve all nested content
        const updatedSection: ISection = {
            ...existingSection,
            title: sectionData.title || existingSection.title,
            topics: sectionData.topics || existingSection.topics
        };

        console.log("Final section to save (after merge):", JSON.stringify(updatedSection, null, 2));

        const syllabus = await syllabusService.updateSection(
            courseId,
            parseInt(sectionIndex),
            updatedSection
        );

        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(res, 200, "Section updated successfully", syllabus);
    }),

    deleteSection: wrapAsync(async (req: Request, res: Response) => {
        const { courseId, sectionIndex } = req.params;
        if (!courseId || !sectionIndex) {
            throw new ApiError(400, "Course ID and section index are required");
        }

        const syllabus = await syllabusService.deleteSection(
            courseId,
            parseInt(sectionIndex)
        );

        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(res, 200, "Section deleted successfully", syllabus);
    }),
    // Topic Operations
    addTopic: wrapAsync(async (req: Request, res: Response) => {
        const { courseId, sectionIndex } = req.params;
        if (!courseId || !sectionIndex) {
            throw new ApiError(400, "Course ID and section index are required");
        }

        const topicData = req.body as ITopic;
        if (!topicData || !topicData.title) {
            throw new ApiError(400, "Valid topic data is required");
        }

        const syllabus = await syllabusService.addTopic(
            courseId as string,
            parseInt(sectionIndex as string),
            topicData
        );

        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(res, 201, "Topic added successfully", syllabus);
    }),

    updateTopic: wrapAsync(async (req: Request, res: Response) => {
        const { courseId, sectionIndex, topicIndex } = req.params;
        if (!courseId || !sectionIndex || !topicIndex) {
            throw new ApiError(400, "Course ID, section index, and topic index are required");
        }

        const topicData = req.body as ITopic;
        if (!topicData) {
            throw new ApiError(400, "Valid topic data is required");
        }

        // Get existing topic data to preserve structure
        const existingSyllabus = await syllabusService.getSyllabusByCourseId(courseId);
        const sectionIdx = parseInt(sectionIndex as string);
        const topicIdx = parseInt(topicIndex as string);

        if (!existingSyllabus.syllabus[sectionIdx]) {
            throw new ApiError(404, "Section not found");
        }

        const existingTopic = existingSyllabus.syllabus[sectionIdx].topics[topicIdx];
        if (!existingTopic) {
            throw new ApiError(404, "Topic not found");
        }

        console.log("Received topic update request:");
        console.log("Topic index:", topicIdx);
        console.log("Topic data from client:", JSON.stringify(topicData, null, 2));
        console.log("Existing topic:", JSON.stringify(existingTopic, null, 2));

        // Create updated topic by merging existing data with new data
        // This ensures we preserve all nested content (subtopics)
        const updatedTopic: ITopic = {
            ...existingTopic,
            title: topicData.title || existingTopic.title,
            subTopics: topicData.subTopics || existingTopic.subTopics
        };

        console.log("Final topic to save (after merge):", JSON.stringify(updatedTopic, null, 2));

        const syllabus = await syllabusService.updateTopic(
            courseId as string,
            sectionIdx,
            topicIdx,
            updatedTopic
        );

        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(res, 200, "Topic updated successfully", syllabus);
    }), deleteTopic: wrapAsync(async (req: Request, res: Response) => {
        const { courseId, sectionIndex, topicIndex } = req.params;
        const syllabus = await syllabusService.deleteTopic(
            courseId as string,
            parseInt(sectionIndex as string),
            parseInt(topicIndex as string)
        );
        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`
        ]);
        ApiResponder.success(res, 200, "Topic deleted successfully", syllabus);
    }),
    // Subtopic Operations
    addSubtopic: wrapAsync(async (req: Request, res: Response) => {
        const { courseId, sectionIndex, topicIndex } = req.params;
        if (!courseId || !sectionIndex || !topicIndex) {
            throw new ApiError(400, "Course ID, section index, and topic index are required");
        }

        const subtopicData = req.body as ISubTopic;
        if (!subtopicData || !subtopicData.title) {
            throw new ApiError(400, "Valid subtopic data is required");
        }

        const syllabus = await syllabusService.addSubtopic(
            courseId as string,
            parseInt(sectionIndex as string),
            parseInt(topicIndex as string),
            subtopicData
        );

        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(res, 201, "Subtopic added successfully", syllabus);
    }),

    updateSubtopic: wrapAsync(async (req: Request, res: Response) => {
        const { courseId, sectionIndex, topicIndex, subtopicIndex } = req.params;
        if (!courseId || !sectionIndex || !topicIndex || !subtopicIndex) {
            throw new ApiError(400, "Course ID, section index, topic index, and subtopic index are required");
        }

        const subtopicData = req.body as ISubTopic;
        if (!subtopicData) {
            throw new ApiError(400, "Valid subtopic data is required");
        }

        // Get existing subtopic data to preserve structure
        const existingSyllabus = await syllabusService.getSyllabusByCourseId(courseId);
        const sectionIdx = parseInt(sectionIndex as string);
        const topicIdx = parseInt(topicIndex as string);
        const subtopicIdx = parseInt(subtopicIndex as string);

        if (!existingSyllabus.syllabus[sectionIdx]) {
            throw new ApiError(404, "Section not found");
        }

        const existingSection = existingSyllabus.syllabus[sectionIdx];
        if (!existingSection.topics[topicIdx]) {
            throw new ApiError(404, "Topic not found");
        }

        const existingTopic = existingSection.topics[topicIdx];
        if (!existingTopic.subTopics || !existingTopic.subTopics[subtopicIdx]) {
            throw new ApiError(404, "Subtopic not found");
        }

        const existingSubtopic = existingTopic.subTopics[subtopicIdx];

        console.log("Received subtopic update request:");
        console.log("Subtopic index:", subtopicIdx);
        console.log("Subtopic data from client:", JSON.stringify(subtopicData, null, 2));
        console.log("Existing subtopic:", JSON.stringify(existingSubtopic, null, 2));

        // Create updated subtopic by merging existing data with new data
        // This ensures we preserve all nested content
        const updatedSubtopic: ISubTopic = {
            ...existingSubtopic,
            title: subtopicData.title || existingSubtopic.title,
            subTopics: subtopicData.subTopics || existingSubtopic.subTopics || []
        };

        console.log("Final subtopic to save (after merge):", JSON.stringify(updatedSubtopic, null, 2));

        const syllabus = await syllabusService.updateSubtopic(
            courseId as string,
            sectionIdx,
            topicIdx,
            subtopicIdx,
            updatedSubtopic
        );

        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(res, 200, "Subtopic updated successfully", syllabus);
    }),

    deleteSubtopic: wrapAsync(async (req: Request, res: Response) => {
        const { courseId, sectionIndex, topicIndex, subtopicIndex } = req.params;
        if (!courseId || !sectionIndex || !topicIndex || !subtopicIndex) {
            throw new ApiError(400, "Course ID, section index, topic index, and subtopic index are required");
        }

        const syllabus = await syllabusService.deleteSubtopic(
            courseId as string,
            parseInt(sectionIndex as string),
            parseInt(topicIndex as string),
            parseInt(subtopicIndex as string)
        );

        await clearRouteCache([
            `/api/v1/syllabus/course/${courseId}`,
            `/api/v1/courses/${courseId}/syllabus`,
            '/api/v1/courses',
            `/api/v1/courses/${courseId}`
        ]);

        ApiResponder.success(res, 200, "Subtopic deleted successfully", syllabus);
    }),
}

export default syllabusController