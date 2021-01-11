import { Injectable }       from '@angular/core';
import { Subject }          from 'rxjs';

@Injectable({providedIn: 'root'})
export class LogService {
    errors: Array<any> = [];
    public errorSubject = new Subject<any>();

    constructor() {}

    public handleError(error: any, verbose = true){
      this.errors.push(error);
      if(verbose){
        // Send to components which might be interested
        this.errorSubject.next(error);
      }
    }

    public getMessageFromError(error: any){
      var message = "";
      // Prioritize deeper error as higher ones tend to be more general
      if(error.error && error.error.message){
        message =  error.error.message;
      }
      if(!message && error.message){
        message = error.message;
      }
      let customizedError = this.findSpecialError(message); 
      if(customizedError){
        return customizedError;
      }
      return message || "Could not find error message in error object.";
    }

    // Some errors are just known troublemakers
    public findSpecialError(error: string){
      if(error.includes("0 Unknown Error")){
        return "Problem with cluster, certificate most likely not trusted.";
      }
      return false;
    }
}
