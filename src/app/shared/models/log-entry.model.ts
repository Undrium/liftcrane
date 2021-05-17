import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class LogEntry{

  public timestamp: number;
  public id: string;
  public message: string;
  public type: string;
  public data: any;

  constructor(){}

  public static create(
    message: string,
    type: string,
    data: any
  ){
    var logEntry = new this();
    logEntry.timestamp = Date.now();
    logEntry.id = logEntry.timestamp + "uniqueid" + Math.random();
    logEntry.message = message;
    logEntry.type = type;
    logEntry.data = data;
    return logEntry;
  }

  public static load(data: any){
    var logEntry = new this();
    logEntry.id = data.id;
    logEntry.message = data.message;
    logEntry.type = data.type;
    logEntry.data = data.data;
    logEntry.timestamp = data.timestamp;
    return logEntry;
  }

 
}
