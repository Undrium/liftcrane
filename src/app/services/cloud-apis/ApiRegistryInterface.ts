import { Observable } from 'rxjs';

export interface ApiRegistryInterface {

    getHeaders(): any;
    getProjects(): Observable<any>;
    getTags(repository: string): Observable<any>;
    getAllTags(): Observable<any>;
    testAccess(): Promise<boolean>;
}
