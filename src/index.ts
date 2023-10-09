import * as ko from "knockout";

class Todo {
    title: KnockoutObservable<string>;
    newTitle: KnockoutObservable<string>;
    completed: KnockoutObservable<boolean>;    
    isEditing: KnockoutObservable<boolean>;

    constructor(title: string, completed: boolean, newTitle: string) {
        this.title = ko.observable(title);
        this.newTitle = ko.observable(newTitle);
        this.completed = ko.observable(completed);
        this.isEditing = ko.observable(false);
    }
   
}

export class TodoApp {
    public allItems: KnockoutObservableArray<Todo> = ko.observableArray([]);
    public newTodo: KnockoutObservable<string> = ko.observable(""); 
    public title: KnockoutObservable<string> = ko.observable("");   
    public completed: KnockoutObservable<boolean> = ko.observable(false); 
    public completedItems: KnockoutObservableArray<Todo> = ko.observableArray([]);
    public expanded: KnockoutObservable<boolean> = ko.observable(false); 
    public numberOfCompletedItems: KnockoutObservableArray<number> = ko.observableArray([]);

    constructor() {
        const self = this;
        this.newTodo = ko.observable('');
        this.allItems = ko.observableArray([]);
        const storedData = localStorage.getItem("todos");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.allItems) {
                parsedData.allItems.forEach((todo: any) => {
                    self.allItems.push(new Todo(todo.title, todo.completed, todo.newTitle));
                });
            }
            if (parsedData.completedItems) {
                parsedData.completedItems.forEach((todo: any) => {
                    self.completedItems.push(new Todo(todo.title, todo.completed, todo.newTitle));
                });
            }
        }
    }
    
    public addTodo() {
        const title = this.newTodo().trim();
        if (title) {
            this.allItems.push(new Todo(title, false, ""));
            this.newTodo('');
            this.saveToLocalStorage();
        }
    }

    public completeTodo = (todo: Todo) => {
        this.allItems.remove(todo);
        this.completedItems.push(todo);
        this.expanded(false);
        this.saveToLocalStorage();
    }

    public removeTodo = (todo: Todo) => {
        this.allItems.remove(todo);
        this.completedItems.remove(todo);
        this.saveToLocalStorage();
    }

    public toggleEditing = (todo: Todo) => {
        todo.isEditing(!todo.isEditing());    
        this.allItems().forEach((item) => {
            if (item !== todo) {
                item.isEditing(false);
            }
        });
    };
   
    public saveEdit = (todo: Todo) => {
        todo.isEditing(false);
        this.saveToLocalStorage();
    }

    public toggleCompleted = (todo: Todo) => {
        todo.completed(!todo.completed());
        this.saveToLocalStorage();
    }

    public toggleAccordion() {
        this.expanded(!this.expanded());
    }

    private saveToLocalStorage() {
        const dataToSave = {
            allItems: ko.toJS(this.allItems),
            completedItems: ko.toJS(this.completedItems)
        };    
        localStorage.setItem("todos", JSON.stringify(dataToSave));
    }       
}

const viewModel = new TodoApp();
ko.applyBindings(viewModel);
