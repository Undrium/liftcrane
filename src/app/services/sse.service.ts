import { Injectable }       from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class SseService {
  constructor(public http: HttpClient) {}

  async CreateEventMachine(url, init): Promise<EventTarget> {
    const eventTarget = new EventTarget()
    eventTarget['abortController'] = new AbortController();
    if(init && !init.signal){
      init.signal = eventTarget['abortController'].signal;
    }
    
    this.fetcher(url, init, eventTarget)
    return eventTarget
  }

  async fetcher(url, init, eventTarget){

    const self = this;
    var fetchUrl = url;
    if(init.resourceVersion){
      fetchUrl = url + "&resourceVersion=" + init.resourceVersion;
    }

    fetch(fetchUrl, init).then(async function(response) {
      var streamReader = response.body.getReader();
      let result;
      while (!result || !result.done) {
        result = await streamReader.read();
        var objectEvents = self.getEventObjectsFromStream(result.value);
        for(var objectEvent of objectEvents){
          eventTarget.dispatchEvent(new MessageEvent(objectEvent.type, { data: objectEvent.object }));
          if(objectEvent && objectEvent.object && objectEvent.object.metadata && objectEvent.object.metadata.resourceVersion){
            init.resourceVersion = objectEvent.object.metadata.resourceVersion;
          }
        }        
      }
      eventTarget.dispatchEvent(new CloseEvent('close'));
    }).catch(error => {
      if(error.name == 'AbortError'){
        eventTarget.dispatchEvent(new CloseEvent('close'));
      }else{
        self.fetcher(url, init, eventTarget)
      }
    });

  }

  getEventObjectsFromStream(streamArray: any): Array<any> {
    let str = "", objectStrings = [], eventObjects = [];
    for (var i=0; i<streamArray.byteLength; i++) {
      var letter = String.fromCharCode(streamArray[i]);
      if(letter == '\n'){
        objectStrings.push(str);
        str = "";
      }else{
        str += letter;
      }
    }
    // Finally, if there is a str left, add it to the array
    if(str){
      objectStrings.push(str);
    }
    // Process the array
    for(var objectString of objectStrings){
      try{
        let eventObject = JSON.parse(objectString);
        eventObjects.push(eventObject);
      }catch(err){
        console.log(err);
        console.log("derp", objectString);
      }
    }
    return eventObjects;

  }

}