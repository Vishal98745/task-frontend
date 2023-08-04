import React, { useEffect, useState } from 'react'
import './taskmanager.css'
// import fetchJSON from './api';
const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // const data = await fetchJSON('/')
      const response = await fetch('https://task-backend-9z6q.onrender.com/');
      const data = await response.json();
      console.log(data);
      // const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const addTask = async () => {
    try {
      const response = await fetch('https://task-backend-9z6q.onrender.com/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      setTasks([...tasks, newTask]);
      setNewTask({ title: '', description: '', status: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    
    try {
      const response = await fetch(`https://task-backend-9z6q.onrender.com/update/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
     
      const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`https://task-backend-9z6q.onrender.com/delete/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="task-manager container-fluid">
    <h1>Task Manager</h1>
    <div className="container">
    <form>
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={newTask.title}
        onChange={handleInputChange}
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={newTask.description}
        onChange={handleInputChange}
      />
      <button type="button" className='button' onClick={addTask}>
        Add Task
      </button>
    </form>
    </div>
    <div className="task-list container-fluid">
      <div className="row">
      {tasks.map((task,index) => (
        <div key={index} className="task col-4 m-2">
          <h2 style={{fontWeight:"bold"}}>title:{task.title}</h2>
          <h4>description:{task.description}</h4>
          <h3>Status:{task.status}</h3>
          <button className='btn1' onClick={() => updateTaskStatus(task._id, 'Completed')}>Mark as Completed</button>
          <button className='btn2' onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}
      </div>
     
    </div>
  </div>
  )
}

export default TaskManager
