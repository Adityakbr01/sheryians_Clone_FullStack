import { Section as BaseSection, Topic as BaseTopic, SubTopic as BaseSubTopic } from '@/types/course';

// Extended interfaces with _id fields for API data
export interface ApiSubTopic extends BaseSubTopic {
    _id: string;
    subTopics?: ApiSubTopic[];
}

export interface ApiTopic extends BaseTopic {
    _id: string;
    subTopics: ApiSubTopic[];
}

export interface ApiSection extends BaseSection {
    _id: string;
    topics: ApiTopic[];
}

// Export the base types as well
export type { BaseSection, BaseTopic, BaseSubTopic };