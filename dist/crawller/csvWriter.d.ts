/// <reference types="node" />
import csvStringify from 'csv-stringify';
import fs from 'fs';
export default class CsvWriter implements FileWriter {
    _stringifier: csvStringify.Stringifier;
    _file: fs.WriteStream;
    prepare(filename: string, option: FileWriterPrepareOption): Promise<void>;
    write(campus: Campus, college: CauCollege, department?: CauDepartment, subject?: CauSubject): Promise<void>;
    finish(): Promise<void>;
}
