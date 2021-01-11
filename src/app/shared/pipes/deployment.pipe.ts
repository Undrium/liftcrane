import { Pipe, PipeTransform } from '@angular/core';

/*
* Defines when a deployment is paused
*/
@Pipe({name: 'deploymentIsPaused'})
export class DeploymentIsPausedPipe implements PipeTransform {
    transform(deployment: any): boolean {
        return deployment.spec.replicas == 0;
    }
}

/*
* Defines when a deployment is running
*/
@Pipe({name: 'deploymentIsRunning'})
export class DeploymentIsRunningPipe implements PipeTransform {
    transform(deployment: any): boolean {
        return deployment.spec.replicas > 0;
    }
}