import { Injectable }                 from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
import {webSocket, WebSocketSubject}  from 'rxjs/webSocket';
import { map, share }                 from 'rxjs/operators';
import { Observable }                 from 'rxjs';

import { ProfileService }                from '../profile.service';
import { SseService }              from '../sse.service';

import { environment } from './../../../environments/environment';



/*
* The bridge to the MASP API, to be used for websockets, httprequests and
* token negotiation
*/
@Injectable({
  providedIn: 'root'
})
export class HarborApiService{

  private credentials: any;
  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private sseService: SseService
  ) {

  }

  public getProjects(): Observable<any>{
    return this.get("/projects");
  }
  public getRepositories(projectId:any): Observable<any>{
    return this.get("/repositories");
  }

  public async testAccess(): Promise<boolean>{
    await this.get("/").subscribe();
    return true;
  }

  public get(uri:string): Observable<any>{
    return this.http.get(environment.harborUrl + uri, {headers: this.getHeaders()});
  }

  public post(uri:string, data = {}): Observable<any>{
    return this.http.post(environment.harborUrl + uri, data, {headers: this.getHeaders()});
  }

  public getHeaders():any{
    var headers = {};
    headers['authorization'] = "Basic " + btoa(this.credentials.username + ':' + this.credentials.password);
    return headers;
  }
  public getParams():any{
    return "";
  }

  public withCredentials(credentials:any):HarborApiService{
    this.credentials = credentials;
    return this;
  }

}
