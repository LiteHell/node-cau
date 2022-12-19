import fs from 'fs';

type JsonResultItem = {
    campus: '서울' | '안성',
    subject?: CauSubject,
    department?: CauDepartment,
    college: CauCollege
};

export default class JsonWriter implements FileWriter {
    _file!: fs.WriteStream;
    _firstItem: boolean = true;
    async prepare (filename: string, option: FileWriterPrepareOption){
        this._file = fs.createWriteStream(filename, {encoding: 'utf8'});
        this._file.write('[');
    }
    async write(campus: Campus, college: CauCollege, department?: CauDepartment, subject?: CauSubject): Promise<void> {
        let item;
        if (!this._firstItem) {
            this._file.write(',');
        }
        if (subject && department) {
            item = {
                campus: campus == Campus.Seoul ? '서울' : '안성',
                subject,
                department,
                college
            };
        } else if (department) {
            item = {
                campus: campus == Campus.Seoul ? '서울' : '안성',
                department,
                college
            };
        } else {
            item = {
                campus: campus == Campus.Seoul ? '서울' : '안성',
                college
            };
        }

        if (this._firstItem)
            this._firstItem = false;

        this._file.write(JSON.stringify(item));
    }
    async finish(): Promise<void> {
        this._file.write(']');
        this._file.end();
    }
}