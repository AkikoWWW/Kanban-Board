import React from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import { Button } from '../UI/Button';

export default function Board({ 
  columns, 
  tasks, 
  activeId, 
  sensors, 
  handleDragStart, 
  handleDragOver, 
  handleDragEnd,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
  onUpdateColumn,
  onAddColumn
}) {
  
  const handleAddSectionClick = () => {
    onAddColumn('New Section');
  };

  return (
    <div className="board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="columns-container">
          <SortableContext 
            items={columns.map(c => c.id)} 
            strategy={horizontalListSortingStrategy}
          >
            {columns.map(col => (
              <Column
                key={col.id}
                column={col}
                tasks={tasks.filter(t => t.columnId === col.id)}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onDeleteColumn={onDeleteColumn}
                onUpdateColumn={onUpdateColumn}
              />
            ))}
          </SortableContext>
          
          <Button 
            variant="add" 
            className="add-col-btn" 
            onClick={handleAddSectionClick}
          >
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
  );
}