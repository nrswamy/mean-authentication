import { Injectable } from '@angular/core'; 
import {HttpClient, HttpHeaders} from '@angular/common/http'; 
import {Observable} from 'rxjs'; 
@Injectable({ 
  providedIn: 'root'
}) 
export class FileUploadService { 
    
  // API url 
  baseApiUrl = "/api/upload"
    
  constructor(private http:HttpClient) { } 
  
  // Returns an observable 
  upload(file, uid):Observable<any> { 
  
      // Create form data 
      const formData = new FormData();  
        
      // Store form name as "file" with file data 
      formData.append("file", file); 
        
      // Make http post request over api 
      // with formData as req 
      return this.http.post(this.baseApiUrl, formData, {
        headers: new HttpHeaders({
          'userId' : uid
          })
      }) 
  } 
} 