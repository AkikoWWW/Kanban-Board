import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';

export const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      columns: [
        { id: 'col-1', title: 'To Do' },
        { id: 'col-2', title: 'In Progress' },
        { id: 'col-3', title: 'Done' },
      ],
      tasks: [],

      addColumn: (title) =>
        set((state) => ({
          columns: [...state.columns, { id: uuidv4(), title }],
        })),

      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
          tasks: state.tasks.filter((task) => task.columnId !== id),
        })),

      updateColumn: (id, title) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title } : col
          ),
        })),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: uuidv4(), createdAt: new Date() }],
        })),

      updateTask: (id, updatedData) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedData } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (activeId, overId) =>
        set((state) => {
          const activeIndex = state.tasks.findIndex((t) => t.id === activeId);
          const overIndex = state.tasks.findIndex((t) => t.id === overId);
          if (activeIndex !== -1 && overIndex !== -1) {
            return {
              tasks: arrayMove(state.tasks, activeIndex, overIndex),
            };
          }
          return state;
        }),

      moveTaskToColumn: (taskId, columnId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, columnId } : t
          ),
        })),
    }),
    {
      name: 'task-tracker-storage',
    }
  )
);