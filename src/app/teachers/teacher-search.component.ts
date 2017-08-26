
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Teacher } from './../_models/teacher';
import { TeacherSearchService } from './../_services/teacher-search.service';


@Component({
  selector: 'app-teacher-search',
  templateUrl: './teacher-search.component.html',
  styleUrls: [ './teacher-search.component.css' ],
  providers: [TeacherSearchService]
})

export class TeacherSearchComponent implements OnInit {
  teachers: Observable<Teacher[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private teacherSearchService: TeacherSearchService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.teachers = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.teacherSearchService.search(term)
        // or the observable of empty teacheres if there was no search term
        : Observable.of<Teacher[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Teacher[]>([]);
      });
  }

  gotoDetail(teacher: Teacher): void {
    let link = ['teachers/detail', teacher.id];
    this.router.navigate(link);
  }
}
