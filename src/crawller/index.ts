
import Cau from '../cau.js';
import CsvWriter from './csvWriter';
import commander from 'commander';
import JsonWriter from './jsonWriter.js';
import { withRetries } from "./retriable";

commander.version('1.0.0')
         .description('Crawlls courses, deparmtent list, college list from CAU')
         .option('--year <year>', 'Set year to search for courses, default value is current year')
         .option('--semester <semester>', 'Set semester to search for courses, default value is current semester')
         .option('--graduate-school', 'Find courses of graduate school')
         .option('--undergraduate', 'Find courses of undergraduate school, default option')
         .option('--only-colleges', 'Find for colleges only')
         .option('--only-departments', 'Find for departments only')
         .option('--query <query>', 'Course query')
         .option('--delay <delay>', 'Crawlling delay in milliseconds, default value is 100', '100')
         .option('--outFile <outFile>', 'Path to save, default is courses.csv')
         .option('--type <type>', 'Sets output type, csv and json are supported. automatically set by output filename if not specified')
         .option('--retries <retries>', 'Retry count, default is 3', '3');
const argv = commander.parse(process.argv);

const cau = new Cau();

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}   

(async() => {
    // Read options
    const type = argv.type || 'csv';
    if (type !== 'csv' && type !== 'json')
        throw new Error('Only csv and json types are supported!');
    const currentYear = await cau.getCurrentYear();
    const semester : Semester = argv.semester || currentYear.semester;
    const year : number = Number(argv.year) || Number(currentYear.year);
    const course: SchoolType = argv.graduateSchool ? SchoolType.GraduateSchool : SchoolType.Undergraduate;
    const collegesOnly = Boolean(argv.onlyColleges), departmentsOnly = Boolean(argv.onlyDepartments);
    const query : string = argv.query || null;
    const path : string= argv.outFile || 'courses.csv';
    const delay : number= Number(argv.delay) || 100;
    const retries : number = Number(argv.retries) || 3;
 
    // get writer option
    let writerOption: FileWriterPrepareOption = FileWriterPrepareOption.Full;
    if (collegesOnly) writerOption = FileWriterPrepareOption.CollegesOnly;
    else if (departmentsOnly) writerOption = FileWriterPrepareOption.DepartmentsOnly;

    // Initialize writer
    const writer = type == 'csv' ? new CsvWriter() : new JsonWriter();
    await writer.prepare(path, writerOption);

    // Crawl
    for (let campus of [Campus.Seoul, Campus.Anseong]) {
        console.log('Crawlling campus : ' + campus);
        const collegeFilter: CauCollegeFilter = {
            year,
            semester,
            campus,
            course
        }
        const colleges = await withRetries(async () => await cau.getColleges(collegeFilter), retries);
        if (collegesOnly) {
            for(let i of colleges)
                await writer.write(campus, i);
        } else {
            let departments : CauDepartment[] = [];
            for (let college of colleges) {
                console.log(`Crawlling departments of ${college.name}(${college.code})`);
                departments = departments.concat(await withRetries(async () => await cau.getDepartments({
                    year,
                    semester,
                    campus,
                    course,
                    college
                }), retries));
            }
            if (departmentsOnly) {
                for (let i of departments)
                    await writer.write(campus, i.college, i);
            } else {
                for (let department of departments) {
                    console.log(`Crawlling subjects of ${department.name}(${department.code})`);
                    let subjects = await withRetries(async () => await cau.search('', {campus, course, college: department.college, year, department, semester}), retries);
                    console.log(`Found ${subjects.length} subjects`);
                    for (let i of subjects)
                        await writer.write(department.college.campus, department.college, department, i);
                    if (delay > 0)
                        await sleep(delay);
                }
            }
        }
    }

    await writer.finish();
})();