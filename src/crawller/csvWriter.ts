import csvStringify from 'csv-stringify';
import fs from 'fs';

export default class CsvWriter implements FileWriter {
    _stringifier: csvStringify.Stringifier = csvStringify({delimiter: ','});
    _file!: fs.WriteStream;
    async prepare (filename: string, option: FileWriterPrepareOption){
        this._file = fs.createWriteStream(filename, {encoding: 'utf8'});
        this._stringifier.on('readable', () => {
            let row;
            while (row = this._stringifier.read()) {
                this._file.write(row);
            }
        });
        this._stringifier.on('error', (err: Error) => {
            console.error(err);
        })
        this._stringifier.on('finish', () => {
            this._file.end();
        });
        switch(option) {
            case FileWriterPrepareOption.Full:
                this._stringifier.write(['캠퍼스', '대학/교양', '학과/전공/영역', '개설대학','개설학과','학년','과정','이수구분','과목번호','분반','과목명','학점','시간','담당교수','폐강','강의시간','유연학기','비고','수업유형'])
                break;
            case FileWriterPrepareOption.DepartmentsOnly:
                this._stringifier.write(['캠퍼스', '대학코드', '대학/교양', '학과코드', '학과/전공/영역']);
                break;
            case FileWriterPrepareOption.CollegesOnly:
                this._stringifier.write(['캠퍼스', '대학코드', '대학/교양']);
                break;
        }
    }
    async write(campus: Campus, college: CauCollege, department?: CauDepartment, subject?: CauSubject): Promise<void> {
        if (subject && department) {
            this._stringifier.write([
                campus == Campus.Seoul ? '서울' : '안성',
                college.name,
                department.name,
                subject.collegeName,
                subject.departmentName,
                subject.schoolYear,
                subject.courseName,
                subject.classification,
                subject.code,
                subject.class,
                subject.name,
                subject.points,
                subject.time,
                subject.professor,
                subject.closed,
                subject.schedule,
                subject.flexible,
                subject.remarks,
                subject.classType
            ]);
        } else if (department) {
            this._stringifier.write([
                campus == Campus.Seoul ? '서울' : '안성',
                college.code,
                college.name,
                department.code,
                department.name
            ]);
        } else {
            this._stringifier.write([
                campus == Campus.Seoul ? '서울' : '안성',
                college.code,
                college.name
            ])
        }
    }
    async finish(): Promise<void> {
        this._stringifier.end();
    }
}