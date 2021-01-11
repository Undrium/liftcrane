import { Component, OnInit, Input, ViewEncapsulation }     from '@angular/core';

@Component({
  selector: 'replicas',
  templateUrl: './replicas.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./replicas.component.scss']
})
export class ReplicasComponent implements OnInit {
  @Input() deployment: any;
  replicas: Array<any> = [];

  constructor() {}

  ngOnChanges(changes) {
    this.replicas = [];
    for (var i = 0; i < this.deployment.status.readyReplicas; i++) {
      this.replicas.push({status: "ready"})
    }
    for (var i = 0; i < this.deployment.status.unavailableReplicas; i++) {
      this.replicas.push({status: "unavailable"})
    }
    // Fill up with rest
    for (var i = 0; i < (this.deployment.replicas - this.replicas.length); i++) {
      this.replicas.push({status: "unknown"})
    }
  }
  ngOnInit() {

  }

}