// use strict;
import axios from 'axios';
import { AllHtmlEntities } from 'html-entities';

let entities = new AllHtmlEntities();
/**
 * @class
 * @exports
 * class used to search courses from cau
 */
export default class Cau {
    /**
     * Get current year and semeter
     */
    async getCurrentYear(): Promise<CauYear> {
        const  response = await axios.post('https://mportal.cau.ac.kr/std/usk/sUskSif001/selectCurYear.ajax', {}, {headers: {'Content-Type': 'application/json'}});
        const {year, shtm} = response.data.year[0];
        return {
            year: Number(year),
            semester: shtm
        };
    }

    /**
     * Get possible college options
     */
    async getColleges(filter: CauCollegeFilter): Promise<CauCollege[]> {
        let payload = {
            "year": filter.year,
            "campfg":filter.campus,
            "course":filter.course,
            "gb":filter.course,
            "colgcd":"00000",
            "shtm":filter.semester
        };
        let response = await axios.post('https://mportal.cau.ac.kr/std/usk/sUskSif001/selectParam.ajax', payload, {headers: {'Content-Type': 'application/json'}});
        return response.data.selectColg.map((i: any) => {
            return {
                code: i.deptcd,
                name: i.deptkornm,
                campus: filter.campus
            };
        });
    }

    /**
     * Get possible department options
     */
    async getDepartments(filter: CauDepartmentFilter): Promise<CauDepartment[]> {
        let payload = {
            "year": filter.year,
            "campfg":filter.campus,
            "course":filter.course,
            "gb":filter.course,
            "colgcd":filter.college.code,
            "shtm":filter.semester
        };
        let response = await axios.post('https://mportal.cau.ac.kr/std/usk/sUskSif001/selectSust.ajax', payload, {headers: {'Content-Type': 'application/json'}});
        return response.data.selectSust.map((i: any) => {
            return {
                campus: i.camp,
                name: i.nm,
                code: i.deptcd,
                college: filter.college
            };
        });

    }

    /**
     * Search subjects
     */
    async search(title: string, filter: CauSubjectFilter): Promise<CauSubject[]> {
        let payload : any = {
            "year": filter.year,
            "campfg":filter.campus,
            "course":filter.course,
            "gb":filter.course,
            "colgcd":filter.college.code,
            "shtm":filter.semester,
            "sust": filter.department.code,
            "search_gb": "nm",
            "kornm": title
        };

        if(title == null || title == "") {
            if (filter.college.code == "00000" || filter.college.code == "LNK" || filter.college.code == "FSN")
                payload.search_gb = filter.college.code;
            else
                payload.search_gb = "ELSE";
        }
        if(filter.college.code == "LNK" || filter.college.code == "FSN") {
            payload.campfg = "";
            payload.course = "";
        }

        for (let i in payload){
            payload[i] = String(payload[i]);
        }

        let response = await axios.post('https://mportal.cau.ac.kr/std/usk/sUskSif001/selectSbjt.ajax', payload, {headers: {'Content-Type': 'application/json'}});
        return response.data.selectSust.map((i: any) => {
            let points = i.pnt.split('-')[0].trim(),
                time = i.pnt.split('-')[1].trim();
            if (points.startsWith('.')) points = '0' + points;
            if (time.startsWith('.')) time = '0' + time;
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
                points,
                time,
                professor: i.profnm,
                closed: i.clsefg,
                schedule: entities.decode(i.ltbdrm),
                flexible: i.flx,
                remarks: entities.decode(i.remk),
                classType: i.usktp
            };
        });

    }
}