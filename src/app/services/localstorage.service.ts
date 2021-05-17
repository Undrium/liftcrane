import { Injectable }       from '@angular/core';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import * as _                               from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  /**
   * Set key with a object in storage
   * @param {string} name
   * @param {object} data
 	 */
  setItem(name: string, data: any): any {
    localStorage.setItem(name, JSON.stringify(data));
    return data;
  }

  /**
   * Set key with a object in storage
   * @param {string} name
 	 */
  getItem(name: string, defaultReturn = null): any {
    if(this.isExist(name)) {
      try{
        let obj = JSON.parse(localStorage.getItem(name));
        return obj;
      }catch(err){}
  		
  	}
  	return defaultReturn;
  }

  /**
   * Removes key from storage
   * @param {string} name
   */
  removeItem(name: string): void {
  	localStorage.removeItem(name);
  }

  /*
  * Completely removes the object, from pointer to content
  */
  removeObject(name: string): void{
    this.removeItem(name);
    if(this[name]){
      delete this[name];
    }
  }

  /**
   * Add to an array, create if not existing
   * @param {string} name
   * @param {object} data
 	 */
   addToArray(name: string, data: any): any {
    var list = this.getItem(name, []);
    list.push(data);
    this.setItem(name, list);
    return list;
  }

  /*
  * Removes properties of object but keeps pointer, also removes object from
  * localstorage
  */
  emptyObject(name: string): void{
    this.removeItem(name);
    if(this[name]){
      for (const prop of Object.getOwnPropertyNames(this[name])) {
        delete this[name][prop];
      }
    }
  }

  /*
  * Removes elements of array but keeps pointer, also removes object from
  * localstorage
  */
  emptyArray(name: string): void{
    this.removeItem(name);
    if(this[name] && this[name].length){
      this[name].length = 0;
    }
  }

  /**
   * Clear entire storage
   */
  clear(): void {
  	localStorage.clear();
  }

  /**
   * Checks if key exists in storage
   * @param {String} name
   * @return {Boolean} result
   */
  isExist(name: string): boolean {
    var item = localStorage.getItem(name);
  	return !(item == null || typeof item == 'undefined');
  }

}
