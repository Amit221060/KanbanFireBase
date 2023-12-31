import { Component, OnInit } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  TaskDialogComponent,
  TaskDialogResult,
} from './task-dialog/task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { BaseService } from './service/base.service';
const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'kanban-fire';
  isLoggedIn = false;

  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
    private router: Router,
    private basicService: BaseService
  ) {}

  todo = getObservable(this.store.collection('todo')) as Observable<Task[]>;
  inProgress = getObservable(this.store.collection('inProgress')) as Observable<
    Task[]
  >;
  done = getObservable(this.store.collection('done')) as Observable<Task[]>;

  ngOnInit() {
    console.log(this.router.routerState.snapshot.url);
    this.basicService.getisLoggedIn().subscribe(value=>{
      this.isLoggedIn = value
    })

  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        if (result.delete) {
          this.store.collection(list).doc(task.id).delete();
        } else {
          this.store.collection(list).doc(task.id).update(task);
        }
      });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    let item;
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
    const check: any = event?.previousContainer.data;
    check.subscribe((data) => {
      item = data[event.previousIndex];
    });

    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store
          .collection(event.previousContainer?.id)
          .doc(item?.id)
          .delete(),
        this.store.collection(event.container?.id).add(item),
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        this.store.collection('todo').add(result.task);
      });
  }

  logout() {
    this.basicService.setisLoggedIn(false);
    this.router.navigate(['/']);
  }
}
