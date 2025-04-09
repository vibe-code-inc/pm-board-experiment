import React, { useState } from 'react';
import { Project, Task, TaskStatus } from '@/types';
import { TaskColumn } from './task_column';
import { useDragAndDropManager } from '@/lib/drag_drop/drag_drop_manager';
import { DropPlaceholder } from '@/ui/features/project_board/drop_placeholder';
import { TaskModal } from '@/ui/features/task_modal/task_modal';

type ProjectBoardProps = {
  project: Project;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
};

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  project,
  onTaskUpdate,
  onTaskEdit
}) => {
  // Task state management
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the drag and drop manager
  const {
    draggedItemId,
    draggedOverContainerId,
    dropPlaceholderPosition,
    draggedElement,
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDragLeave,
    handleContainerDrop
  } = useDragAndDropManager();

  // Task filtering by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Task status change handler
  const handleStatusChange = (taskId: string, status: Task['status']) => {
    onTaskUpdate(taskId, { status });
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString().split('T')[0] }
          : task
      )
    );
  };

  // Task editing handler
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    // For now, just log to console per specification
    console.log(`Edit ${task.id} ${task.title}`);
    onTaskEdit(task);
  };

  // Handle saving the task after editing in modal
  const handleSaveTask = (updatedTask: Task) => {
    onTaskEdit(updatedTask);
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id ? { ...updatedTask } : task
      )
    );
    setIsModalOpen(false);
  };

  // Container drop handler
  const onContainerDrop = (e: React.DragEvent<HTMLDivElement>, columnId: TaskStatus) => {
    const result = handleContainerDrop(e, columnId);
    if (result) {
      const { itemId } = result;

      // Update task status when dropped in a different column
      handleStatusChange(itemId, columnId);
    }
  };

  // Create the drop placeholder element
  const placeholderElement = (
    <DropPlaceholder
      isActive={!!dropPlaceholderPosition}
      draggedElement={draggedElement}
    />
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Todo Column */}
      <TaskColumn
        status="todo"
        title="Todo"
        tasks={todoTasks}
        isDraggedOver={draggedOverContainerId === 'todo'}
        dropPlaceholderPosition={dropPlaceholderPosition}
        placeholderComponent={placeholderElement}
        onDragOver={(e) => {
          const columnElement = e.currentTarget;
          const taskElements = Array.from(columnElement.querySelectorAll('[data-task-id]'));
          handleContainerDragOver(e, 'todo', taskElements);
        }}
        onDrop={(e) => onContainerDrop(e, 'todo')}
        onDragLeave={handleContainerDragLeave}
        onTaskStatusChange={handleStatusChange}
        onTaskEdit={handleEditTask}
        onTaskDragStart={(taskId, element) => handleDragStart(taskId, 'todo', element)}
        onTaskDragEnd={handleDragEnd}
      />

      {/* In Progress Column */}
      <TaskColumn
        status="in-progress"
        title="In Progress"
        tasks={inProgressTasks}
        isDraggedOver={draggedOverContainerId === 'in-progress'}
        dropPlaceholderPosition={dropPlaceholderPosition}
        placeholderComponent={placeholderElement}
        onDragOver={(e) => {
          const columnElement = e.currentTarget;
          const taskElements = Array.from(columnElement.querySelectorAll('[data-task-id]'));
          handleContainerDragOver(e, 'in-progress', taskElements);
        }}
        onDrop={(e) => onContainerDrop(e, 'in-progress')}
        onDragLeave={handleContainerDragLeave}
        onTaskStatusChange={handleStatusChange}
        onTaskEdit={handleEditTask}
        onTaskDragStart={(taskId, element) => handleDragStart(taskId, 'in-progress', element)}
        onTaskDragEnd={handleDragEnd}
      />

      {/* Done Column */}
      <TaskColumn
        status="done"
        title="Done"
        tasks={doneTasks}
        isDraggedOver={draggedOverContainerId === 'done'}
        dropPlaceholderPosition={dropPlaceholderPosition}
        placeholderComponent={placeholderElement}
        onDragOver={(e) => {
          const columnElement = e.currentTarget;
          const taskElements = Array.from(columnElement.querySelectorAll('[data-task-id]'));
          handleContainerDragOver(e, 'done', taskElements);
        }}
        onDrop={(e) => onContainerDrop(e, 'done')}
        onDragLeave={handleContainerDragLeave}
        onTaskStatusChange={handleStatusChange}
        onTaskEdit={handleEditTask}
        onTaskDragStart={(taskId, element) => handleDragStart(taskId, 'done', element)}
        onTaskDragEnd={handleDragEnd}
      />

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};
