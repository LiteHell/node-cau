/**
 * @class
 * @exports
 * class used to search courses from cau
 */
export default class Cau {
    /**
     * Get current year and semeter
     */
    getCurrentYear(): Promise<CauYear>;
    /**
     * Get possible college options
     */
    getColleges(filter: CauCollegeFilter): Promise<CauCollege[]>;
    /**
     * Get possible department options
     */
    getDepartments(filter: CauDepartmentFilter): Promise<CauDepartment[]>;
    /**
     * Search subjects
     */
    search(title: string, filter: CauSubjectFilter): Promise<CauSubject[]>;
}
