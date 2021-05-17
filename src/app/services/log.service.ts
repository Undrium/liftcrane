import { Injectable }       from '@angular/core';
import { Subject }          from 'rxjs';

import { LogEntry }         from '../shared/models/log-entry.model';
import { LocalStorageService } from './localstorage.service';

@Injectable({providedIn: 'root'})
export class LogService {
    
    logEntries: Array<LogEntry> = [];
    public messageSubject = new Subject<any>();

    constructor(public localStorageService: LocalStorageService) {
      this.loadLogEntriesFromStorage();
      
    }

    public loadLogEntriesFromStorage(){
      var localObjects = this.localStorageService.getItem("logEntries", []);
      for(var localObject of localObjects){
        this.logEntries.push(LogEntry.load(localObject));
      }
    }

    public silentError(error: any){
      this.handleError(error, false);
    }

    public log(message, type, data, verbose = true){

      if(type == "error"){
        message = this.getMessageFromError(data);
      }

      if(verbose){
        this.messageSubject.next(message);
      }

      var logEntry = LogEntry.create(message, type, data)

      this.addLogEntry(logEntry);
    }

    public handleError(error: any, verbose = true){
      this.log("An error occured", "error", error, verbose);
    }

    public addLogEntry(logEntry){
      this.logEntries.push(logEntry);
      var response = this.localStorageService.addToArray("logEntries", logEntry);
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

    public removeAll(){
      this.logEntries = [];
      this.localStorageService.removeItem("logEntries");
      return this.logEntries;
    }
}
