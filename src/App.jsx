import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useStore } from './store';

import Board from "./components/Board/Board";
import StatsSidebar from "./components/StatsSlidebar/StatsSidebar";
import TaskModal from "./components/UI/TaskModal";
import { Button } from "./components/UI/Button";

import useKeyPress from './hooks/useKeyPress';
import './App.css';

export default function App() {
  const {
    columns,
    tasks,
    addColumn,
    deleteColumn,
    updateColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    moveTaskToColumn,
    moveColumn,
    theme,
    toggleTheme,
    clearTasks
  } = useStore();

  const [activeId, setActiveId] = useState(null);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetColumnId, setTargetColumnId] = useState(null);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [filterByWeek, setFilterByWeek] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAddTask = useCallback((columnId) => {
    setEditingTask(null);
    setTargetColumnId(columnId);
    setTaskModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  }, []);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type === 'Task') {
      const overColId = over.data.current?.type === 'Column' 
        ? over.id 
        : over.data.current?.task?.columnId;

      if (overColId && active.data.current.task.columnId !== overColId) {
        moveTaskToColumn(active.id, overColId);
      }
    }
  }, [moveTaskToColumn]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.data.current?.type === 'Column') {
      if (active.id !== over.id) moveColumn(active.id, over.id);
    } else {
      if (active.id !== over.id) moveTask(active.id, over.id);
    }
    setActiveId(null);
  }, [moveColumn, moveTask]);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  useKeyPress('i', handleAddTask, true);
  useKeyPress('t', handleThemeToggle);

  const filteredTasks = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchWeek = !filterByWeek || new Date(t.createdAt) >= oneWeekAgo;
      return matchSearch && matchPriority && matchWeek && !t.archived;
    });
  }, [tasks, search, priorityFilter, filterByWeek]);

  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const done = filteredTasks.filter(t => t.columnId === 'col-3').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, progress };
  }, [filteredTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-icon">⚡</span>
          <h1>AkiTask</h1>
        </div>

        <div className="filters-wrapper">
          <Button variant="theme" onClick={handleThemeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
          <input 
            className="search-input" 
            placeholder="Search tasks..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
          <select 
            className="filter-select" 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <Button className="reset-btn" onClick={() => setFilterByWeek(!filterByWeek)}>
            {filterByWeek ? 'Last 7 Days' : 'All Time'}
          </Button>
        </div>
      </header>

      <div className="main-layout">
        <Board 
          columns={columns}
          tasks={filteredTasks}
          activeId={activeId}
          sensors={sensors}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={deleteTask}
          onDeleteColumn={deleteColumn}
          onUpdateColumn={updateColumn}
          onAddColumn={addColumn}
        />

        <StatsSidebar 
          stats={stats} 
          onClearTasks={clearTasks} 
        />
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        columns={columns}
        targetColumnId={targetColumnId}
        onSubmit={(data) => {
          editingTask ? updateTask(editingTask.id, data) : addTask(data);
          setTaskModalOpen(false);
        }}
        defaultValues={editingTask}
      />
    </div>
  );
}