import { Component ,OnInit} from '@angular/core';
import { Task } from '../task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  TaskDialogComponent,
  TaskDialogResult,
} from '../task-dialog/task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../service/authService.service';
const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-entry',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class EntryComponent implements OnInit {
  uniqueUserId = null ;
  constructor(private dialog: MatDialog, private store: AngularFirestore, private auth:AuthService) {
   
  }
  UserId = this.getId();
  todo = getObservable(this.store.collection("users").doc(this.UserId).collection('todo')) as Observable<Task[]>;
  inProgress = getObservable(this.store.collection("users").doc(this.UserId).collection('inProgress')) as Observable<Task[]>;
  done = getObservable(this.store.collection("users").doc(this.UserId).collection('done')) as Observable<Task[]>;

  getId(){
    this.auth.getUniqueId().subscribe(id => {
      this.uniqueUserId = id 
    })
    return this.uniqueUserId;
  }

  ngOnInit(){
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
          .collection("users").doc(this.uniqueUserId)
          .collection(event.previousContainer?.id)
          .doc(item?.id)
          .delete(),
        this.store.collection("users").doc(this.uniqueUserId).collection(event.container?.id).add(item)
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
        this.store.collection("users").doc(this.uniqueUserId).collection('todo').add(result.task);
      });
  }
}
