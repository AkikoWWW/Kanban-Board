import React, { useState, useMemo, useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from './store';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
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
    theme,
    toggleTheme
  } = useStore();
  
  const [activeId, setActiveId] = useState(null);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetColumnId, setTargetColumnId] = useState(null);

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deadlineFilter, setDeadlineFilter] = useState('All');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const today = new Date().toISOString().split('T')[0];
      let matchDeadline = true;
      
      if (deadlineFilter === 'Overdue') matchDeadline = t.deadline && t.deadline < today;
      if (deadlineFilter === 'Today') matchDeadline = t.deadline === today;
      if (deadlineFilter === 'Future') matchDeadline = t.deadline > today;

      return matchSearch && matchPriority && matchDeadline;
    });
  }, [tasks, search, priorityFilter, deadlineFilter]);

  const handleDragStart = (event) => setActiveId(event.active.id);
  
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (isActiveTask && isOverTask) {
      const t1 = tasks.find(t => t.id === activeId);
      const t2 = tasks.find(t => t.id === overId);
      if (t1 && t2 && t1.columnId !== t2.columnId) {
        moveTaskToColumn(activeId, t2.columnId);
      }
    }
    
    if (isActiveTask && isOverColumn) {
      const t1 = tasks.find(t => t.id === activeId);
      if (t1 && t1.columnId !== overId) {
        moveTaskToColumn(activeId, overId);
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }
    if (active.id !== over.id) { moveTask(active.id, over.id); }
    setActiveId(null);
  };

  const openNewTaskModal = (colId) => {
    setEditingTask(null);
    setTargetColumnId(colId);
    setTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = (data) => {
    if (editingTask) { 
      updateTask(editingTask.id, data); 
    } else { 
      addTask({ ...data, columnId: targetColumnId }); 
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-icon">⚡</span>
          <h1>AkiTask</h1>
        </div>
        
        <div className="filters-wrapper">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <input 
            className="search-input" 
            placeholder="Search tasks..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
          
          <select className="filter-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          
          <select className="filter-select" value={deadlineFilter} onChange={e => setDeadlineFilter(e.target.value)}>
            <option value="All">All Deadlines</option>
            <option value="Overdue">Overdue</option>
            <option value="Today">Today</option>
            <option value="Future">Future</option>
          </select>
          
          <button className="reset-btn" onClick={() => { setSearch(''); setPriorityFilter('All'); setDeadlineFilter('All'); }}>
            Reset
          </button>
        </div>
      </header>

      <div className="board">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver} 
          onDragEnd={handleDragEnd}
        >
          <div className="columns-container">
            <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
              {columns.map(col => (
                <Column
                  key={col.id}
                  column={col}
                  tasks={filteredTasks.filter(t => t.columnId === col.id)}
                  onAddTask={openNewTaskModal}
                  onEditTask={openEditTaskModal}
                  onDeleteTask={deleteTask}
                  onDeleteColumn={deleteColumn}
                  onUpdateColumn={updateColumn}
                />
              ))}
            </SortableContext>
            <button className="add-col-btn" onClick={() => addColumn('New Section')}>
              + Add Section
            </button>
          </div>
          
          <DragOverlay>
            {activeId ? (
              tasks.find(t => t.id === activeId) ? 
              <TaskCard task={tasks.find(t => t.id === activeId)} /> : null
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        defaultValues={editingTask}
      />
    </div>
  );
}