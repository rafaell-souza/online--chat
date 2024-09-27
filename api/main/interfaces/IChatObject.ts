
enum Language {
    Portuguese = 'Portuguese',
    English = 'English',
    Spanish = 'Spanish',
    French = 'French',
    Italian = 'Italian',
    German = 'German',
    Russian = 'Russian',
    Chinese = 'Chinese',
    Japanese = 'Japanese',
    Korean = 'Korean',
    Arabic = 'Arabic',
}

export default interface IChatObject {
    name: string;
    description: string;
    capacity: string;
    language: Language;
    token: string;
}