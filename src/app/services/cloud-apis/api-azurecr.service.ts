import { Injectable }                 from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
import {webSocket, WebSocketSubject}  from 'rxjs/webSocket';
import { map, share }                 from 'rxjs/operators';
import { Observable }                 from 'rxjs';

import { ProfileService }                from '../profile.service';
import { SseService }              from '../sse.service';
import { LocalStorageService }          from '../localstorage.service';
import { ApiRegistryInterface }               from './ApiRegistryInterface';



/*
* The bridge to the MASP API, to be used for websockets, httprequests and
* token negotiation
*/
@Injectable({
  providedIn: 'root'
})
export class AzurecrApiService implements ApiRegistryInterface{

  private credentials: any;
  public tags:any = [];
  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private localStorageService: LocalStorageService, 
    private sseService: SseService
  ) {

  }

  public getProjects(): Observable<any>{
    return this.get("/v2/_catalog");
  }

  public getTags(repository:string): Observable<any>{
    return this.get("/acr/v1/"+repository+"/_tags");
  }

  public getAllTags(): Observable<any>{
    return this.getProjects().pipe(map((res:any) => {
     var projects = res.repositories || [];
     var tags = [];
     projects.forEach(repo => {
      this.getTags(repo).subscribe((res:any) => {
        var info = res || [];
        info.tags.forEach(tag => {
          tag.repo = repo;
          tags.push(tag);
        });
      });
     });
     return tags;
    }));
  }

  public async testAccess(): Promise<boolean>{
    await this.get("/").subscribe();
    return true;
  }

  public get(uri:string): Observable<any>{
    return this.http.get(this.credentials.url + uri, {headers: this.getHeaders()});
  }

  public post(uri:string, data = {}): Observable<any>{
    return this.http.post(this.credentials.url + uri, data, {headers: this.getHeaders()});
  }

  public getHeaders():any{
    var headers = {};
    headers['authorization'] = "Basic " + btoa(this.credentials.username + ':' + this.credentials.password);
    return headers;
  }
  public getParams():any{
    return "";
  }

  public withCredentials(credentials:any):AzurecrApiService{
    this.credentials = credentials;
    return this;
  }

}
