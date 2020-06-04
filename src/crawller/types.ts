
const enum FileWriterPrepareOption {
    Full,
    DepartmentsOnly,
    CollegesOnly
}
interface FileWriter {
    prepare(filename:string, option: FileWriterPrepareOption): Promise<void>;
    write(campus: Campus, college: CauCollege, department?: CauDepartment, subject?: CauSubject): Promise<void>;
    finish(): Promise<void>;
}