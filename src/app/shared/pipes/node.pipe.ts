import { Pipe, PipeTransform } from '@angular/core';

/*
* Defines if a node is in trouble
*/
@Pipe({name: 'nodeConditionSummary'})
export class NodeConditionSummaryPipe implements PipeTransform {
    transform(node: any): string {
        if(!node.status || !node.status.conditions || !node.status.conditions.length){
            return "unknown";
        }
        var warnings = ["MemoryPressure", "DiskPressure", "PIDPressure", "NetworkUnavailable"];
        var overallStatusIsGood = false;
        for(var condition of node.status.conditions){
            if(warnings.includes(condition.type) && condition.status == 'True'){
                return "warning";
            }
            if(condition.type == 'Ready' && condition.status == 'True'){
                overallStatusIsGood = true;
            }
        }
        return overallStatusIsGood ? "ready": "error";
    }
}

/*
* Get a better name of a node
*/
@Pipe({name: 'nodeNameSummary'})
export class NodeNameSummaryPipe implements PipeTransform {
    transform(node: any): string {
        var name = "";
        if(node.metadata && node.metadata.name){
            name += " " + node.metadata.name;
        }
        if(node.status && node.status.addresses){
            for(var address of node.status.addresses){
                if(address.type == 'InternalIP'){
                    name += " (Internal: "+address.address+")"
                }
                if(address.type == 'ExternalIP'){
                    name += " (External: "+address.address+")"
                }
            }
        }

        return name;
    }
}


