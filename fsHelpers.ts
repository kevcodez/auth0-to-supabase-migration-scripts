import fs from 'fs';
import { unary } from 'lodash';
import path from 'path';

export function filename(...subdirs: string[]): string {
  return path.join(process.cwd(), ...subdirs);
}

export function readLinesOfFile(src: string): string[] {
  return fs.readFileSync(filename(src)).toString().split('\n').filter(Boolean);
}

export function writeStream(src: string): (id: string) => Promise<void> {
  const stream = fs.createWriteStream(filename(src), { flags: 'a' });

  return function (id) {
    return new Promise<void>((res, rej) => {
      stream.write(id + '\n', (err) => {
        if (err) rej(err);
        else res();
      });
    });
  };
}

export function sleep(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

export function readJSON(src: string): any {
  return [fs.readFileSync(filename(src)).toString()].map(unary(JSON.parse)).pop();
}

export function writeJSON(file: string, data: any) {
  fs.writeFileSync(filename(file), JSON.stringify(data, null, 2));
}

export interface User {
  created_at: string;
  email: string;
  last_login: string;
  updated_at: string;
  user_id: string;
}

export interface UserWithInfo {
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  holdings: number;
  activities: number;
  portfolios: number;
  subplan: string;
  unlock: boolean;
}
