import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface IReadFileResult {
  text: string;
  lastModified: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  constructor(private _httpClient: HttpClient) {}

  async readFile(filename: string) {
    const response = await firstValueFrom(
      this._httpClient.get(`${filename}`, {
        responseType: 'text',
        observe: 'response',
      }),
    );
    const lastModified = response.headers.get('Last-Modified');

    return { text: response.body, lastModified } as IReadFileResult;
  }
}
