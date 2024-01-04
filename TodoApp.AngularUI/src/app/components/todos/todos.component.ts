import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Todo = {
    id: '',
    description: '',
    createdDate: new Date(),
    isCompleted: false,
    completedDate: new Date(),
    isDeleted:false,
    deletedDate: new Date(),
  };
  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
   this.getAllTodos();
  }

  getAllTodos(){
    this.todoService.getAllTodos().subscribe({
      next:(todos) => {
        this.todos = todos;
      }
    });
  }

  addTodo(){
    this.todoService.addTodo(this.newTodo).subscribe({
      next:(todo) => {
        this.getAllTodos(); // refresh table
      }
    });
  }

  onCompletedChange(id:string, todo: Todo){
    todo.isCompleted = !todo.isCompleted;
    this.todoService.updateTodo(id, todo).subscribe({
      next:(res) => {
        this.getAllTodos(); // refresh table
      }
    });
  }

  deleteTodo(id: string){
    this.todoService.deleteTodo(id).subscribe({
      next: (res) => {
        this.getAllTodos(); // refresh table
      }
    });
  }
}
