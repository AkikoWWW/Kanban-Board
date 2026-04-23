import React, { useState, useMemo, useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from './store';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { Button } from './components/Button';
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

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useKeyPress('i', () => {
    setEditingTask(null);
    setTargetColumnId(null);
    setTaskModalOpen(true);
  });

  useKeyPress('t', () => handleThemeToggle());

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

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type === 'Task') {
      const overColId = over.data.current?.type === 'Column' ? over.id : over.data.current?.task?.columnId;
      if (overColId && active.data.current.task.columnId !== overColId) {
        moveTaskToColumn(active.id, overColId);
      }
    }
  };

  const handleDragEnd = (event) => {
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
  };

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
        <div className="board">
          <DndContext
            sensors={useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))}
            collisionDetection={closestCorners}
            onDragStart={(e) => setActiveId(e.active.id)}
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
                    onAddTask={(id) => { 
                      setEditingTask(null); 
                      setTargetColumnId(id);
                      setTaskModalOpen(true); 
                    }}
                    onEditTask={(task) => { setEditingTask(task); setTaskModalOpen(true); }}
                    onDeleteTask={deleteTask}
                    onDeleteColumn={deleteColumn}
                    onUpdateColumn={updateColumn}
                  />
                ))}
              </SortableContext>
              <Button variant="add" className="add-col-btn" onClick={() => addColumn('New Section')}>
                + Add Section
              </Button>
            </div>

            <DragOverlay>
              {activeId && tasks.find(t => t.id === activeId) ? (
                <TaskCard task={tasks.find(t => t.id === activeId)} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <aside className="stats-sidebar">
          <div className="stats-card">
            <h3>Board Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Tasks</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${stats.progress}%` }} />
            </div>
            <div className="shortcuts-info" style={{ marginTop: '20px', fontSize: '11px', opacity: 0.6 }}>
              <p>⌨️ <kbd>Ctrl</kbd>+<kbd>I</kbd> New Task</p>
            </div>
            <Button 
              className="btn-danger"
              onClick={() => { if(window.confirm('Delete all?')) clearTasks(); }}
            >
              Reset All Stats
            </Button>
          </div>
        </aside>
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