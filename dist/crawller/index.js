"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cau_js_1 = __importDefault(require("../cau.js"));
var csvWriter_1 = __importDefault(require("./csvWriter"));
var commander_1 = __importDefault(require("commander"));
var jsonWriter_js_1 = __importDefault(require("./jsonWriter.js"));
commander_1.default.version('1.0.0')
    .description('Crawlls courses, deparmtent list, college list from CAU')
    .option('--year <year>', 'Set year to search for courses, default value is current year')
    .option('--semester <semester>', 'Set semester to search for courses, default value is current semester')
    .option('--graduate-school', 'Find courses of graduate school')
    .option('--undergraduate', 'Find courses of undergraduate school, default option')
    .option('--only-colleges', 'Find for colleges only')
    .option('--only-departments', 'Find for departments only')
    .option('--query <query>', 'Course query')
    .option('--delay <delay>', 'Crawlling delay in milliseconds, default value is 100', '100')
    .option('--out <outFile>', 'Path to save, default is courses.csv')
    .option('--type <type>', 'Sets output type, csv and json are supported. automatically set by output filename if not specified');
var argv = commander_1.default.parse(process.argv);
var cau = new cau_js_1.default();
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var type, currentYear, semester, year, course, collegesOnly, departmentsOnly, query, path, delay, writerOption, writer, _i, _a, campus, collegeFilter, colleges, _b, colleges_1, i, departments, _c, colleges_2, college, _d, _e, _f, departments_1, i, _g, departments_2, department, subjects, _h, subjects_1, i;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                type = argv.type || 'csv';
                if (type !== 'csv' && type !== 'json')
                    throw new Error('Only csv and json types are supported!');
                return [4 /*yield*/, cau.getCurrentYear()];
            case 1:
                currentYear = _j.sent();
                semester = argv.semester || currentYear.semester;
                year = Number(argv.year) || Number(currentYear.year);
                course = argv.graduateSchool ? 2 /* GraduateSchool */ : 3 /* Undergraduate */;
                collegesOnly = Boolean(argv.onlyColleges), departmentsOnly = Boolean(argv.onlyDepartments);
                query = argv.query || null;
                path = argv.outFile || 'courses.csv';
                delay = Number(argv.delay) || 100;
                writerOption = 0 /* Full */;
                if (collegesOnly)
                    writerOption = 2 /* CollegesOnly */;
                else if (departmentsOnly)
                    writerOption = 1 /* DepartmentsOnly */;
                writer = type == 'csv' ? new csvWriter_1.default() : new jsonWriter_js_1.default();
                return [4 /*yield*/, writer.prepare(path, writerOption)];
            case 2:
                _j.sent();
                _i = 0, _a = [1 /* Seoul */, 2 /* Anseong */];
                _j.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 28];
                campus = _a[_i];
                console.log('Crawlling campus : ' + campus);
                collegeFilter = {
                    year: year,
                    semester: semester,
                    campus: campus,
                    course: course
                };
                return [4 /*yield*/, cau.getColleges(collegeFilter)];
            case 4:
                colleges = _j.sent();
                if (!collegesOnly) return [3 /*break*/, 9];
                _b = 0, colleges_1 = colleges;
                _j.label = 5;
            case 5:
                if (!(_b < colleges_1.length)) return [3 /*break*/, 8];
                i = colleges_1[_b];
                return [4 /*yield*/, writer.write(campus, i)];
            case 6:
                _j.sent();
                _j.label = 7;
            case 7:
                _b++;
                return [3 /*break*/, 5];
            case 8: return [3 /*break*/, 27];
            case 9:
                departments = [];
                _c = 0, colleges_2 = colleges;
                _j.label = 10;
            case 10:
                if (!(_c < colleges_2.length)) return [3 /*break*/, 13];
                college = colleges_2[_c];
                console.log("Crawlling departments of " + college.name + "(" + college.code + ")");
                _e = (_d = departments).concat;
                return [4 /*yield*/, cau.getDepartments({
                        year: year,
                        semester: semester,
                        campus: campus,
                        course: course,
                        college: college
                    })];
            case 11:
                departments = _e.apply(_d, [_j.sent()]);
                _j.label = 12;
            case 12:
                _c++;
                return [3 /*break*/, 10];
            case 13:
                if (!departmentsOnly) return [3 /*break*/, 18];
                _f = 0, departments_1 = departments;
                _j.label = 14;
            case 14:
                if (!(_f < departments_1.length)) return [3 /*break*/, 17];
                i = departments_1[_f];
                return [4 /*yield*/, writer.write(campus, i.college, i)];
            case 15:
                _j.sent();
                _j.label = 16;
            case 16:
                _f++;
                return [3 /*break*/, 14];
            case 17: return [3 /*break*/, 27];
            case 18:
                _g = 0, departments_2 = departments;
                _j.label = 19;
            case 19:
                if (!(_g < departments_2.length)) return [3 /*break*/, 27];
                department = departments_2[_g];
                console.log("Crawlling subjects of " + department.name + "(" + department.code + ")");
                return [4 /*yield*/, cau.search('', { campus: campus, course: course, college: department.college, year: year, department: department, semester: semester })];
            case 20:
                subjects = _j.sent();
                console.log("Found " + subjects.length + " subjects");
                _h = 0, subjects_1 = subjects;
                _j.label = 21;
            case 21:
                if (!(_h < subjects_1.length)) return [3 /*break*/, 24];
                i = subjects_1[_h];
                return [4 /*yield*/, writer.write(department.college.campus, department.college, department, i)];
            case 22:
                _j.sent();
                _j.label = 23;
            case 23:
                _h++;
                return [3 /*break*/, 21];
            case 24:
                if (!(delay > 0)) return [3 /*break*/, 26];
                return [4 /*yield*/, sleep(delay)];
            case 25:
                _j.sent();
                _j.label = 26;
            case 26:
                _g++;
                return [3 /*break*/, 19];
            case 27:
                _i++;
                return [3 /*break*/, 3];
            case 28: return [4 /*yield*/, writer.finish()];
            case 29:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); })();
