import { HttpClient } from '@angular/common/http'; // phải import bên app.module.ts
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  baseApiUrl: string = 'https://localhost:7057';

  constructor(private http: HttpClient) { }

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseApiUrl + '/api/todo');
  }

  addTodo(newTodo: Todo): Observable<Todo> {
    newTodo.id = '00000000-0000-0000-0000-000000000000'; // empty guid
    return this.http.post<Todo>(this.baseApiUrl + '/api/todo', newTodo);
  }

  updateTodo(id: string, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(this.baseApiUrl + '/api/todo/' + id, todo);
  }

  deleteTodo(id: string): Observable<Todo> {
    return this.http.delete<Todo>(this.baseApiUrl + '/api/todo/' + id);
  }

  getAllDeletedTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseApiUrl + '/api/todo/get-deleted-todos');
  }

  undoDeleteTodo(id:string, todo: Todo): Observable<Todo>{
    return this.http.put<Todo>(this.baseApiUrl + '/api/todo/undo-deleted-todo/' + id, todo);
  }
}
