import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
    console.log(lastModified);
    return response.body;
  }
}
