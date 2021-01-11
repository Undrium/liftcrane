import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class User{
  constructor(
    public username: string,
    public email: string,
    public firstname: string,
    public lastname: string,
    public usertype: string,
    public token: string,
    public projectRoles: any[],
    public preferences: any[]
  ){}

}

@Injectable({ providedIn: 'root' })
export class UserAdapter implements Adapter<User> {
  public adapt(item: any): User {
    return new User(
      item.username,
      item.email,
      item.firstname,
      item.lastname,
      item.usertype,
      item.token,
      item.projectRoles,
      item.preferences
    );
  }
}