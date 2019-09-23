import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadrService {

  constructor(private http: HttpClient) { }

  public uploadImages(file){
    return this.http.post('http://localhost:3000/api/upload', file, {
      reportProgress: true,
      observe: 'events'
    });
  }


  public getImages(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/load');

  }

  public deleteImage(address: string) {
    return this.http.delete('http://localhost:3000/api/delete/' + address);
  }
}
