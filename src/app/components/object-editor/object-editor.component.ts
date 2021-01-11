import { Component, Input, ViewChild }    from '@angular/core';

import 'brace';
import 'brace/mode/html';
import 'brace/mode/json';
import 'brace/theme/clouds';
import 'brace/theme/github';

@Component({
  selector: 'object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.scss']
})
export class ObjectEditorComponent {
  @ViewChild('editor') editor;
  @Input('dataObject') dataObject = {};
  @Input() readOnly: boolean;
  @Input() height: string;
  @Input() minHeight: string;
  dataString: string;
  constructor() {
  }

  ngOnChanges(changes) {
    this.dataString = JSON.stringify(this.dataObject, null, '\t');
  }

  ngAfterViewInit(){
    this.editor.getEditor().renderer.on('afterRender', function() {

    });
  }

  onEditorTextChange(event){
    var jsonData = this.tryParseJSON(this.dataString);
    if(jsonData){
      // Wipe old data, but keep reference
      Object.keys(this.dataObject).forEach((key) => {
        delete this.dataObject[key];
      });
      Object.keys(jsonData).forEach((key) => {
        this.dataObject[key] = jsonData[key];
      });
    }
  }

  tryParseJSON(jsonString){
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
  }
}
