
type CollegeCode = string;
type DepartmentCode = string;
const enum Semester {
    First = '1',
    Summer = 'S',
    Second = '2',
    Winter = 'W'
}
const enum Campus {
    Seoul = 1,
    Anseong = 2
}
const enum SchoolType {
    Undergraduate = 3,
    GraduateSchool = 2
}

type CauCollegeFilter = {
    year: number,
    semester: Semester,
    campus: Campus,
    course: SchoolType
}

type CauYear = {
    year: number,
    semester: Semester
}

type CauDepartmentFilter = CauCollegeFilter & {
    college: CauCollege
}

type CauSubjectFilter = CauDepartmentFilter & {
    department: CauDepartment
}

type CauCollege = {
    name: string,
    code: CollegeCode,
    campus: Campus
}

type CauCollegeWithDepartments = CauCollege & {departments: CauDepartment[]}

type CauDepartment = {
    campus: Campus,
    college: CauCollege,
    name: string,
    code: DepartmentCode
}

type CauSubject = {
    collegeName: string,
    departmentName: string,
    schoolYear: number,
    courseName: string,
    classification: string,
    code: number,
    class: number,
    name: string,
    points: number,
    time: number,
    professor: string,
    closed: string,
    schedule: string,
    flexible: string,
    remarks: string,
    classType: string
};