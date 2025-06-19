// types/multiparty.d.ts
declare module 'multiparty' {
    export interface Fields {
      [key: string]: string | string[];
    }
  
    export interface Files {
      [key: string]: File | File[];
    }
  
    export interface File {
      filepath: string;
      originalFilename: string;
      size: number;
      name: string;
    }
  
    export class Form {
      parse(req: any, callback: (err: any, fields: Fields, files: Files) => void): void;
      uploadDir: string;
      keepExtensions: boolean;
    }
  
    export function Form(): Form;
  }
  