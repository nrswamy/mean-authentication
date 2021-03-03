import { Component, OnInit } from "@angular/core";
import { AuthenticationService, UserDetails } from "../services/authentication.service";
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from '../services/file-upload.service'; 
import {Observable} from 'rxjs'; 

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  details: UserDetails;
  token = "";
  uploadedFiles = [];

  shortLink: string = ""; 
    loading: boolean = false; // Flag variable 
    file: File = null; // Variable to store file 

  constructor(private auth: AuthenticationService,
    private http: HttpClient,
    private fileUploadService: FileUploadService) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.details = user;
      },
      err => {
        console.error(err);
      }
    );
  }

  
  getToken() {
    console.log("calling get token")
    this.token = this.auth.getToken();
    console.log(this.token)
    console.log("-----")

  }

  fileChange(element) {
    console.log(element.target.files)
    this.uploadedFiles = element.target.files;
  }

  // On file Select 
  onChange(event) { 
    this.file = event.target.files[0]; 
    this.file["userid"] = "dsbfjkgbsd";
} 

// OnClick of button Upload 
onUpload() { 
    this.loading = !this.loading; 
    console.log(this.file); 
    this.fileUploadService.upload(this.file, this.details._id).subscribe( 
        (event: any) => { 
            if (typeof (event) === 'object') { 

                // Short link via api response 
                this.shortLink = event.link; 

                this.loading = false; // Flag variable  
            } 
        } 
    ); 
} 

  // upload() {
  //   let formData = new FormData();
  //   console.log(this.uploadedFiles)
  //   for (var i = 0; i < this.uploadedFiles.length; i++) {
  //       formData.append("files", this.uploadedFiles[i], this.uploadedFiles[i].name);
  //   }
  //   console.log(formData)
  //   this.http.post('/api/upload', formData)
  //   .subscribe((response) => {
  //       console.log('response received is ', response);
  //   })
  // }
}
