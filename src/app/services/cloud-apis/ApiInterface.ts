import { Observable } from 'rxjs';

export interface ApiInterface {

    getHeaders(): any;
    getDeployments(namespace: string): Promise<any>;
    deleteNamespace(namespace: string): Promise<any>;
    createDeployment(namespace: string, deploymentSpec: any): Promise<any>;
    createNamespace(namespace: string, projectIdentifier: string): Promise<any>;
    createSecret(namespace: string, spec: any): Promise<any>;
    scaleDeployment(namespace: string, deploymentName: string, numberOfReplicas: number): Promise<any>;
    startDeployment(namespace: string, deploymentName: string): Promise<any>;
    stopDeployment(namespace: string, deploymentName: string): Promise<any>;
    testAccess(): Promise<boolean>;
}
