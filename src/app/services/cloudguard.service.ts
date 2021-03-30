import { Injectable }                 from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
import { share, map, switchMap, first, take }      from 'rxjs/operators';
import { Observable }                 from 'rxjs';

import { ProfileService }                from './profile.service'

import { environment } from './../../environments/environment';


@Injectable({providedIn: 'root'})
export class CloudGuardService {

  constructor(private http: HttpClient, private profileService: ProfileService) {}

  public heartbeat(user): any{
    return this.post("/auth/refresh", user);
  }

  public login(username: string, password: string): any{
    return this.post("/auth/login", {username: username, password: password});
  }

  public logout(user): Observable<any>{
    return this.post("/users/logout/", user);
  }

  public countClusters(): Observable<any>{
    return this.get("/clusters/count").pipe(take(1));
  }

  public getProjectsClusters(projectFormatName: string): Observable<any>{
    return this.get("/projects/"+projectFormatName+"/clusters/");
  }

  public getClusters(): Observable<any>{
    return this.get("/clusters");
  }

  public getProjectsCluster(projectFormatName: string, clusterFormatName: string): any{
    return this.get("/projects/"+projectFormatName+"/clusters/" + clusterFormatName).pipe(map((cluster: any) =>{
      // This is always packaged as base64 till the end client
      cluster.personalToken = atob(cluster.personalToken);
      return cluster;
    })).pipe(share());
  }

  public getProjectsClustersNamespaces(projectFormatName: string, clusterFormatName: string): any{
    return this.get("/projects/"+projectFormatName+"/clusters/" + clusterFormatName+"/namespaces").pipe(share());
  }

  public getCluster(formatName: string): any{
    return this.get("/clusters/" + formatName);
  }
  
  public getClusterNamespaces(formatName: string): any{
    return this.get("/clusters/" + formatName + "/namespaces");
  }

  public getAKSCluster(name): any{
    return this.get("/clusters/aks/"+name);
  }

  public createAKSCluster(post): any{
    return this.post("/clusters/aks", post);
  }

  public cloneNamespace(projectFormatName: string, namespaceName: string, cloneData: any): Observable<any> {
    return this.post("/projects/"+projectFormatName+"/clusters/" + cloneData.sourceClusterFormatName + "/namespaces/" + namespaceName + "/clone", cloneData);
  }

  public deleteAKSCluster(name): any{
    return this.delete("/clusters/aks/"+name);
  }

  public addCluster(post): any{
    return this.post("/clusters", post);
  }

  public updateCluster(cluster): any{
    return this.patch("/clusters/"+cluster.formatName, cluster);
  }

  public updatePreferences(preferences: any[]): any{
    return this.patch("/users/preferences/", preferences);
  }
  
  public deleteCluster(clusterFormatName): any{
    return this.delete("/clusters/" + clusterFormatName);
  }

  public countRegistries(): Observable<any>{
    return this.get("/registries/count").pipe(take(1));
  }

  public getRegistries(): Observable<any>{
    return this.get("/registries");
  }

  public getRegistry(registryName: string): any{
    return this.get("/registries/" + registryName);
  }

  public createRegistry(post): any{
    return this.post("/registries", post);
  }

  public deleteRegistry(registryId): any{
    return this.delete("/registries/" + registryId);
  }

  public countUsers(): Observable<any>{
    return this.get("/users/count").pipe(take(1));
  }

  public getProject(formatName): any{
    return this.get("/projects/" + formatName);
  }
  public getProjects(): Observable<any>{
    return this.get("/projects");
  }

  public createProjectRole(post): any{
    return this.post("/project-roles", post);
  }
  public deleteProjectRole(projectRoleId): any{
    return this.delete("/project-roles/"+projectRoleId);
  }
  public createProject(post): any{
    return this.post("/projects", post);
  }

  public deleteProject(formatName): any{
    return this.delete("/projects/" + formatName);
  }

  public countProjects(): Observable<any>{
    return this.get("/projects/count").pipe(take(1));
  }

  public updateProject(post): any{
    return this.patch("/projects/" + post.formatName, post);
  }

  public getRoles(): Observable<any>{
    return this.get("/roles");
  }
  
  public getUsers(): Observable<any>{
    return this.get("/users");
  }

  public createUser(post): any{
    return this.post("/users", post);
  }

  public updateUser(username: string, specification: any): Observable<any> {
    return this.patch("/users/" + username, specification);
  }

  public deleteUser(username: string): Observable<any> {
    return this.delete("/users/" + username);
  }

  public getUser(username: string): Observable<any> {
    return this.get("/users/" + username);
  }

  public get(uri: string): Observable<any> {
    return this.getHeaders().pipe(switchMap(headers => {
      return this.http.get(environment.cloudguardUrl + uri, { headers: headers }).pipe(map((resp: any) =>{
        return this.handleCloudGuardResponse(resp);
      })).pipe(share());
    }));
  }

  public delete(uri: string, data = {}): Observable<any> {
    return this.getHeaders().pipe(switchMap(headers => {
      return this.http.delete(environment.cloudguardUrl + uri, { headers: headers }).pipe(map((resp: any) =>{
        return this.handleCloudGuardResponse(resp);
      })).pipe(share());
    }));
  }

  public post(uri: string, data = {}): Observable<any> {
    return this.getHeaders().pipe(switchMap(headers => {
      return this.http.post(environment.cloudguardUrl + uri, data, { headers: headers }).pipe(map((resp: any) =>{
        return this.handleCloudGuardResponse(resp);
      })).pipe(share());
    }));
  }

  public patch(uri: string, data = {}): Observable<any> {
    return this.getHeaders("patch").pipe(switchMap(headers => {
      return this.http.patch(environment.cloudguardUrl + uri, data, { headers: headers }).pipe(map((resp: any) =>{
        return this.handleCloudGuardResponse(resp);
      })).pipe(share());
    }));
  }

  public handleCloudGuardResponse(response: any){
    return response.result || response;
  }

  public getHeaders(type?: string): Observable<any> {
    return this.profileService.user$.pipe(map((user: any) => {
      var headers = {};
      if (user && user.token) {
        headers['authorization'] = "Bearer " + user.token;
      }

      return headers;
    },
      (error: any) => { return ["", {}] })).pipe(first());
  }

}
