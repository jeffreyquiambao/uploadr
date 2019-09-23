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
  filename: string;
  state: boolean;
  progress: number;

  constructor(private imgService: UploadrService, private http: HttpClient) { }
  // Upon image selection, display the image name
  fileSelected(event) {
    this.selected = event.target.files[0] as File;
    this.filename = this.selected.name;
  }

  // When the image is uploaded, ask service to make a POST request
  upload() {
    this.state = true;
    const fd = new FormData();
    fd.append('myFile', this.selected, this.selected.name);

    this.imgService.uploadImages(fd).subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = event.loaded / event.total * 100;
        console.log('Progress: ' + Math.round(this.progress) + '%');
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
      this.imgService.getImages().subscribe(imgAddresses => {
        this.images = imgAddresses;
      });
    });
  }

  clear() {
    this.state = false;
    this.progress = 0;
    this.filename = '';
  }

  delete(address) {
    this.imgService.deleteImage(address).subscribe( () => {
      // update image array
      this.imgService.getImages().subscribe(imgAddresses => {
        this.images = imgAddresses;
      });
    });
  }


// load all the images so we can display them
  ngOnInit() {
    this.imgService.getImages().subscribe(imgAddresses => {
      this.images = imgAddresses;
    });
    }
}
