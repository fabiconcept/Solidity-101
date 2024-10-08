// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.3;

contract TodoContract {
    struct Todo {
        string title;
        string description;
        uint256 dueDate;
        bool completed;
    }

    mapping(uint => Todo) todoList;
    uint[] private todoIds;
    uint public completedTodos;
    uint public unfinishedTodos;
    
    modifier onlyExistingTask (uint _taskId) {
        Todo storage getTodo = todoList[_taskId];
        require(bytes(getTodo.title).length != 0, "Task ID does not exist in todo list!");
        _;
    }

    function addTodo(string memory _title, string memory _description, uint _dueDate) public {
        uint id = block.number;
        Todo storage newTodo = todoList[id];

        require(bytes(newTodo.title).length == 0, "Task ID already exist in todo list!)");

        newTodo.title = _title;
        newTodo.description = _description;
        uint dueDate = _dueDate * 60 * 60;
        newTodo.dueDate = block.timestamp + dueDate;

        todoIds.push(id);

        unfinishedTodos++;
    }

    function removeTodo(uint _taskId) public onlyExistingTask(_taskId) returns (bool) {
        Todo storage getTodo = todoList[_taskId];
        delete todoList[_taskId];

        for (uint256 i = 0; i < todoIds.length; i++) {
            if (todoIds[i] == _taskId) {
                todoIds[i] = todoIds[todoIds.length - 1];
                todoIds.pop();
                break;
            }
        }
        
        if (getTodo.completed) {
            completedTodos--;
            return true;
        }

        unfinishedTodos--;
        return true;        
    }

    function completeTask (uint _taskId) public onlyExistingTask(_taskId) {
        Todo storage getTodo = todoList[_taskId];
        getTodo.completed = true;

        completedTodos++;
        unfinishedTodos--;
    }

    function getTodoIds() public view returns (uint[] memory) {
        return todoIds;
    }

    function getAllTodo() public view returns (Todo[] memory){
        Todo[] memory result = new Todo[](todoIds.length);
        for(uint i; i < todoIds.length; i++) {
            uint id = todoIds[i];
            Todo storage getTodo = todoList[id];
            result[i] = getTodo;
        }

        return result;
    }
    
    function getCompletedTodo() public view returns (Todo[] memory){
        Todo[] memory result = new Todo[](todoIds.length);
        for(uint i; i < todoIds.length; i++) {
            uint id = todoIds[i];
            Todo storage getTodo = todoList[id];

            if(getTodo.completed) {
                result[i] = getTodo;
            }
            continue;
        }

        return result;
    }

    function getUncompletedTodo() public view returns (Todo[] memory){
        Todo[] memory result = new Todo[](todoIds.length);
        for(uint i; i < todoIds.length; i++) {
            uint id = todoIds[i];
            Todo storage getTodo = todoList[id];

            if(!getTodo.completed) {
                result[i] = getTodo;
            }
            continue;
        }

        return result;
    }
}