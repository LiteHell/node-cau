declare type CollegeCode = string;
declare type DepartmentCode = string;
declare const enum Semester {
    First = "1",
    Summer = "S",
    Second = "2",
    Winter = "W"
}
declare const enum Campus {
    Seoul = 1,
    Anseong = 2
}
declare const enum SchoolType {
    Undergraduate = 3,
    GraduateSchool = 2
}
declare type CauCollegeFilter = {
    year: number;
    semester: Semester;
    campus: Campus;
    course: SchoolType;
};
declare type CauYear = {
    year: number;
    semester: Semester;
};
declare type CauDepartmentFilter = CauCollegeFilter & {
    college: CauCollege;
};
declare type CauSubjectFilter = CauDepartmentFilter & {
    department: CauDepartment;
};
declare type CauCollege = {
    name: string;
    code: CollegeCode;
    campus: Campus;
};
declare type CauCollegeWithDepartments = CauCollege & {
    departments: CauDepartment[];
};
declare type CauDepartment = {
    campus: Campus;
    college: CauCollege;
    name: string;
    code: DepartmentCode;
};
declare type CauSubject = {
    collegeName: string;
    departmentName: string;
    schoolYear: number;
    courseName: string;
    classification: string;
    code: number;
    class: number;
    name: string;
    points: number;
    time: number;
    professor: string;
    closed: string;
    schedule: string;
    flexible: string;
    remarks: string;
};
