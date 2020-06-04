/// <reference types="node" />
import fs from 'fs';
declare type JsonResultItem = {
    campus: '서울' | '안성';
    subject?: CauSubject;
    department?: CauDepartment;
    college: CauCollege;
};
export default class JsonWriter implements FileWriter {
    _file: fs.WriteStream;
    _result: JsonResultItem[];
    prepare(filename: string, option: FileWriterPrepareOption): Promise<void>;
    write(campus: Campus, college: CauCollege, department?: CauDepartment, subject?: CauSubject): Promise<void>;
    finish(): Promise<void>;
}
export {};
