import fs from 'fs';

type JsonResultItem = {
    campus: '서울' | '안성',
    subject?: CauSubject,
    department?: CauDepartment,
    college: CauCollege
};

export default class JsonWriter implements FileWriter {
    _file!: fs.WriteStream;
    _result: JsonResultItem[] = [];
    async prepare (filename: string, option: FileWriterPrepareOption){
        this._file = fs.createWriteStream(filename, {encoding: 'utf8'});
    }
    async write(campus: Campus, college: CauCollege, department?: CauDepartment, subject?: CauSubject): Promise<void> {
        if (subject && department) {
            this._result.push({
                campus: campus == Campus.Seoul ? '서울' : '안성',
                subject,
                department,
                college
            })
        } else if (department) {
            this._result.push({
                campus: campus == Campus.Seoul ? '서울' : '안성',
                department,
                college
            })
        } else {
            this._result.push({
                campus: campus == Campus.Seoul ? '서울' : '안성',
                college
            })
        }
    }
    async finish(): Promise<void> {
        this._file.write(JSON.stringify(this._result));
        this._file.end();
    }
}