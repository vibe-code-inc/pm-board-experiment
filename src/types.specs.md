---
description: Core Types Specification
type: types
---

<specification>
  <meta>
    <title>Types Specification</title>
    <description>The types.ts file contains core type definitions used throughout the application. It defines the fundamental data structures that represent the domain model of the PM Board application.</description>
    <created-at utc-timestamp="1712678400">April 9, 2024, 10:00 AM EDT</created-at>
    <applies-to>
      <file-matcher glob="src/types.ts">Core Types Definition</file-matcher>
    </applies-to>
  </meta>

  <overview>
    <description>The types.ts file contains core type definitions used throughout the application. It defines the fundamental data structures that represent the domain model of the PM Board application.</description>
    <responsibility>Provide consistent data structure definitions for the application</responsibility>
  </overview>

  <requirements>
    <functional-requirements>
      <requirement priority="high">
        <description>Provide consistent data structure definitions for the application</description>
      </requirement>
      <requirement priority="high">
        <description>Support typed operations across the application</description>
      </requirement>
      <requirement priority="high">
        <description>Enable compile-time type checking for domain operations</description>
      </requirement>
      <requirement priority="medium">
        <description>Define clear boundaries for data structure properties</description>
      </requirement>
    </functional-requirements>

    <technical-requirements>
      <requirement priority="high">
        <description>Define the Task type with required and optional properties</description>
      </requirement>
      <requirement priority="high">
        <description>Define the Project type</description>
      </requirement>
      <requirement priority="high">
        <description>Use string literal types for enum-like values (TaskStatus, TaskPriority)</description>
      </requirement>
      <requirement priority="high">
        <description>Ensure type safety with precise definitions</description>
      </requirement>
      <requirement priority="high">
        <description>Export all types for use in other modules</description>
      </requirement>
      <requirement priority="medium">
        <description>Document types with JSDoc comments</description>
      </requirement>
      <requirement priority="high">
        <description>Follow TypeScript best practices</description>
      </requirement>
      <requirement priority="high">
        <description>Use types instead of interfaces as per project conventions</description>
      </requirement>
      <requirement priority="medium">
        <description>Keep types focused on data structures without behavioral implementations</description>
      </requirement>
    </technical-requirements>

    <behavioral-expectations>
      <expectation priority="high">
        <description>Types should be usable across the application without circular dependencies</description>
      </expectation>
      <expectation priority="high">
        <description>Type definitions should prevent inconsistent data structures</description>
      </expectation>
      <expectation priority="medium">
        <description>Optional properties should be clearly marked with optional operators</description>
      </expectation>
      <expectation priority="medium">
        <description>Types should focus on the minimal interface needed (follow Interface Segregation Principle)</description>
      </expectation>
      <expectation priority="medium">
        <description>Types should support extension through composition rather than inheritance</description>
      </expectation>
    </behavioral-expectations>
  </requirements>

  <interfaces>
    <interface type="types">
      <definition><![CDATA[/**
 * Task status options
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Represents a task in the PM Board application
 */
export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Represents a project containing multiple tasks
 */
export type Project = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
};]]></definition>
    </interface>
  </interfaces>

  <implementation>
    <files>
      <file path="src/types.ts" action="create">
        <changes>Create the core types file with all necessary type definitions</changes>
      </file>
    </files>

    <dependencies>
      <dependency type="external">TypeScript</dependency>
    </dependencies>
  </implementation>

  <references>
    <reference href="./app.specs.md">App Component</reference>
    <reference href="./features/project_board/project_board.package_specs.md">Project Board Feature</reference>
    <reference href="./features/task_management/task_management.package_specs.md">Task Management Feature</reference>
  </references>
</specification>
