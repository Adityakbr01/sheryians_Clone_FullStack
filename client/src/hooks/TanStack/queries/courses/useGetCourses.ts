import { Course } from '@/types/course';
import api from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

/**
 * API response type for fetching courses
 */
interface GetCoursesResponse {
    success: boolean;
    message: string;
    data: Course[];
}



export function useGetCourses() {
    return useQuery<GetCoursesResponse, Error>({
        queryKey: ['courses'],
        queryFn: async () => {
            const { data } = await api.get<GetCoursesResponse>("/courses");
            return data;
        },
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });
}

export default useGetCourses;