import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';

const createColumnSlice = (set) => ({
  columns: [
    { id: 'col-1', title: 'To Do' },
    { id: 'col-2', title: 'In Progress' },
    { id: 'col-3', title: 'Done' },
  ],
  addColumn: (title) => set((state) => ({
    columns: [...state.columns, { id: uuidv4(), title }]
  })),
  deleteColumn: (id) => set((state) => ({
    columns: state.columns.filter((col) => col.id !== id),
    tasks: state.tasks.filter((task) => task.columnId !== id),
  })),
  updateColumn: (id, title) => set((state) => ({
    columns: state.columns.map((col) => col.id === id ? { ...col, title } : col),
  })),
  moveColumn: (activeId, overId) => set((state) => {
    const activeIndex = state.columns.findIndex((c) => c.id === activeId);
    const overIndex = state.columns.findIndex((c) => c.id === overId);
    return { columns: arrayMove(state.columns, activeIndex, overIndex) };
  }),
});

const createTaskSlice = (set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { 
      ...task, 
      id: uuidv4(), 
      createdAt: new Date().toISOString(),
      archived: false 
    }]
  })),
  toggleTaskDone: (id) => set((state) => ({
    tasks: state.tasks.map((task) => {
      if (task.id === id) {
        const isDone = task.columnId === 'col-3';
        return { ...task, columnId: isDone ? 'col-1' : 'col-3' };
      }
      return task;
    }),
  })),
  archiveTask: (id) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === id ? { ...task, archived: true } : task)
  })),
  restoreTask: (id) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === id ? { ...task, archived: false } : task)
  })),
  updateTask: (id, updatedData) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === id ? { ...task, ...updatedData } : task),
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  clearTasks: () => set({ tasks: [] }),
  moveTask: (activeId, overId) => set((state) => {
    const activeIndex = state.tasks.findIndex((t) => t.id === activeId);
    const overIndex = state.tasks.findIndex((t) => t.id === overId);
    return activeIndex !== -1 && overIndex !== -1 
      ? { tasks: arrayMove(state.tasks, activeIndex, overIndex) } 
      : state;
  }),
  moveTaskToColumn: (taskId, columnId) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, columnId } : t),
  })),
});

export const useStore = create(
  persist(
    (set, get, ...a) => ({
      ...createColumnSlice(set, get, ...a),
      ...createTaskSlice(set, get, ...a),
      theme: 'light',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    { name: 'task-tracker-storage' }
  )
);