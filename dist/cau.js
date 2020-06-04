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
// use strict;
var axios_1 = __importDefault(require("axios"));
var html_entities_1 = require("html-entities");
var entities = new html_entities_1.AllHtmlEntities();
/**
 * @class
 * @exports
 * class used to search courses from cau
 */
var Cau = /** @class */ (function () {
    function Cau() {
    }
    /**
     * Get current year and semeter
     */
    Cau.prototype.getCurrentYear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, year, shtm;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post('https://mportal.cau.ac.kr/std/usk/sUskSif001/selectCurYear.ajax', {}, { headers: { 'Content-Type': 'application/json' } })];
                    case 1:
                        response = _b.sent();
                        _a = response.data.year[0], year = _a.year, shtm = _a.shtm;
                        return [2 /*return*/, {
                                year: Number(year),
                                semester: shtm
                            }];
                }
            });
        });
    };
    /**
     * Get possible college options
     */
    Cau.prototype.getColleges = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            "year": filter.year,
                            "campfg": filter.campus,
                            "course": filter.course,
                            "gb": filter.course,
                            "colgcd": "00000",
                            "shtm": filter.semester
                        };
                        return [4 /*yield*/, axios_1.default.post('https://mportal.cau.ac.kr/std/usk/sUskSif001/selectParam.ajax', payload, { headers: { 'Content-Type': 'application/json' } })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.selectColg.map(function (i) {
                                return {
                                    code: i.deptcd,
                                    name: i.deptkornm,
                                    campus: filter.campus
                                };
                            })];
                }
            });
        });
    };
    /**
     * Get possible department options
     */
    Cau.prototype.getDepartments = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            "year": filter.year,
                            "campfg": filter.campus,
                            "course": filter.course,
                            "gb": filter.course,
                            "colgcd": filter.college.code,
                            "shtm": filter.semester
                        };
                        return [4 /*yield*/, axios_1.default.post('https://mportal.cau.ac.kr/std/usk/sUskSif001/selectSust.ajax', payload, { headers: { 'Content-Type': 'application/json' } })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.selectSust.map(function (i) {
                                return {
                                    campus: i.camp,
                                    name: i.nm,
                                    code: i.deptcd,
                                    college: filter.college
                                };
                            })];
                }
            });
        });
    };
    /**
     * Search subjects
     */
    Cau.prototype.search = function (title, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, i, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            "year": filter.year,
                            "campfg": filter.campus,
                            "course": filter.course,
                            "gb": filter.course,
                            "colgcd": filter.college.code,
                            "shtm": filter.semester,
                            "sust": filter.department.code,
                            "search_gb": "nm",
                            "kornm": title
                        };
                        if (title == null || title == "") {
                            if (filter.college.code == "00000" || filter.college.code == "LNK" || filter.college.code == "FSN")
                                payload.search_gb = filter.college.code;
                            else
                                payload.search_gb = "ELSE";
                        }
                        if (filter.college.code == "LNK" || filter.college.code == "FSN") {
                            payload.campfg = "";
                            payload.course = "";
                        }
                        for (i in payload) {
                            payload[i] = String(payload[i]);
                        }
                        return [4 /*yield*/, axios_1.default.post('https://mportal.cau.ac.kr/std/usk/sUskSif001/selectSbjt.ajax', payload, { headers: { 'Content-Type': 'application/json' } })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.selectSust.map(function (i) {
                                var points = i.pnt.split('-')[0].trim(), time = i.pnt.split('-')[1].trim();
                                if (points.startsWith('.'))
                                    points = '0' + points;
                                if (time.startsWith('.'))
                                    time = '0' + time;
                                points = Number(points);
                                time = Number(time);
                                return {
                                    collegeName: i.colgnm,
                                    departmentName: i.sustnm,
                                    schoolYear: i.shyr,
                                    courseName: i.corscd,
                                    classification: i.pobtnm,
                                    code: parseInt(i.sbjtclss.split('-')[0].trim()),
                                    class: parseInt(i.sbjtclss.split('-')[1].trim()),
                                    name: i.clssnm,
                                    points: points,
                                    time: time,
                                    professor: i.profnm,
                                    closed: i.clsefg,
                                    schedule: entities.decode(i.ltbdrm),
                                    flexible: i.flx,
                                    remarks: entities.decode(i.remk)
                                };
                            })];
                }
            });
        });
    };
    return Cau;
}());
exports.default = Cau;
