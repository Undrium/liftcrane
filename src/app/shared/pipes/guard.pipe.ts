import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../services/auth.service';
/*
* Determines if a role is allowed to use function
*/
@Pipe({name: 'roleGuard'})
export class RoleGuardPipe implements PipeTransform {
    constructor(private authService: AuthService){}
    async transform(user: any, projectId: string, allowedRoles: string[]): Promise<boolean> {
        return this.authService.hasCorrectRoleInProject(user, projectId, allowedRoles);
    }
}