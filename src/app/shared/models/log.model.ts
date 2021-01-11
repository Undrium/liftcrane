import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class Log{
  constructor(
    public id: string,
    public message: string
  ){}

}
