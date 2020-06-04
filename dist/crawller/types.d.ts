declare const enum FileWriterPrepareOption {
    Full = 0,
    DepartmentsOnly = 1,
    CollegesOnly = 2
}
interface FileWriter {
    prepare(filename: string, option: FileWriterPrepareOption): Promise<void>;
    write(campus: Campus, college: CauCollege, department?: CauDepartment, subject?: CauSubject): Promise<void>;
    finish(): Promise<void>;
}
