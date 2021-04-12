import { Component, Input, Output, EventEmitter }    from '@angular/core';


@Component({
  selector: 'search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  @Input('filterText') filterText;
  @Output() filterTextChange = new EventEmitter<string>();

  constructor() {

  }

  filterTextChanged(){
    this.filterTextChange.emit(this.filterText);
  }

  ngOnChanges(changes) {

  } 

  ngAfterViewInit(){

  }

}
