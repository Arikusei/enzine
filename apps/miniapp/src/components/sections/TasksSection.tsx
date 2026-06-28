import type { Task } from "@/types/home";

interface TasksSectionProps {
  tasks: Task[];
}

export function TasksSection({ tasks }: TasksSectionProps) {
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <section className="section card tasks">
      <div className="section__head">
        <h2 className="section__title">Задачи</h2>
        <span className="section__meta">
          {doneCount}/{tasks.length}
        </span>
      </div>
      <ul className="tasks__list">
        {tasks.map((task) => (
          <li key={task.id} className={`tasks__item${task.done ? " tasks__item--done" : ""}`}>
            <span className="tasks__check" aria-hidden="true">
              {task.done ? "✓" : ""}
            </span>
            <span className="tasks__name">{task.title}</span>
            <span className="tasks__points">+{task.points}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
