// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

contract Structs {
    struct Todo {
        string title;
        bool completed;
    }

    Todo[] todos;

    function get(uint _id) public view returns (string memory, bool) {
        Todo storage getTodo = todos[_id];
        return(getTodo.title, getTodo.completed);
    }

    function updateTodo(uint _id, string calldata _title) public {
        Todo storage getTodo = todos[_id];

        getTodo.title = _title;
    }

    function toggleCompleted(uint _id) public {
        Todo storage getTodo = todos[_id];

        getTodo.completed = !getTodo.completed;
    }
}