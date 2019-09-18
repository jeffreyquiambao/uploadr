import { Component, OnInit } from '@angular/core';
// service we created to make requests
import { UploadrService } from '../uploadr.service';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-uploadr',
  templateUrl: './uploadr.component.html',
  styleUrls: ['./uploadr.component.css']
})
export class UploadrComponent implements OnInit {
  images: string[];
  selected: File = null;

  constructor(private imgService: UploadrService, private http: HttpClient) { }
  // Upon image selection, display the image name
  fileSelected(event) {
    this.selected = event.target.files[0] as File;
    const display = document.getElementById('displayImgTxt');
    display.innerHTML = this.selected.name;
    display.classList.replace('hidden', 'show');
  }

  // When the image is uploaded, ask service to make a POST request
  upload() {
    const fd = new FormData();
    fd.append('myFile', this.selected, this.selected.name);
    return this.http.post('http://localhost:3000/api/upload', fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('Progress: ' + Math.round(event.loaded / event.total * 100) + '%');
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

  delete(address) {
    this.imgService.deleteImage(address).subscribe();
  }


// load all the images so we can display them
  ngOnInit() {
    this.imgService.getImages().subscribe(imgAddresses => {
      this.images = imgAddresses;
    });
    }
}
