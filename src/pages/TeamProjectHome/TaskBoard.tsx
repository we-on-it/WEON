import { useId, useState } from 'react';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Icon } from '../../components/Icon/Icon';
import { Popup } from '../../components/Popup/Popup';
import { TempPriorityIcon } from '../../components/PriorityMenu/PriorityMenu';
import { STATUS_LABEL, TASK_STATUSES, TempStatusChip } from '../../components/StatusMenu/StatusMenu';
import { TextInputField } from '../../components/TextInputField/TextInputField';
import { deadline, type BoardTask } from './projectData';
import styles from './TeamProjectHome.module.css';

type Props = {
  tasks: BoardTask[];
  today: string;
  initialView?: 'board' | 'list';
  onSave: (task: BoardTask) => void;
};

function TaskCard({ task, today, onEdit }: { task: BoardTask; today: string; onEdit: () => void }) {
  const due = deadline(task.dueAt, today);
  return (
    <article className={styles.task}>
      <div className={styles.row}>
        <strong className={styles.inline}><TempPriorityIcon level={due.level} />{due.day}</strong>
        <button className={styles.iconButton} aria-label={task.title + ' 편집'} onClick={onEdit}><Icon name="more" /></button>
      </div>
      <div>
        <h4 className="typo-title">{task.title}</h4>
        <div className={styles.taskMeta}><span>마감 {due.date}</span><strong>담당자 {task.assignee}</strong></div>
      </div>
      <div className={styles.progressRow}>
        <progress aria-label={task.title + ' 진행률'} value={task.progress} max={100} data-done={task.status === 'done'} />
        <span>{task.progress}%</span>
      </div>
      <footer className={styles.taskFooter}>
        <span aria-label={'댓글 ' + task.comments + '개'}><Icon name="chat-text" size={16} />{task.comments}</span>
        <span aria-label={'첨부파일 ' + task.files + '개'}><Icon name="link" size={16} />{task.files}</span>
      </footer>
    </article>
  );
}

export function TaskEditor({ task, onSave, onClose }: { task: BoardTask; onSave: Props['onSave']; onClose: () => void }) {
  const [title, setTitle] = useState(task.title);
  const [attempted, setAttempted] = useState(false);
  const formId = useId();
  return (
    <Popup open onClose={onClose} title={task.id ? '태스크 편집' : '새 태스크'} actions={<>
      <Button variant="neutral-weak" onClick={onClose}>취소</Button>
      <Button type="submit" form={formId}>저장</Button>
    </>}>
      <form id={formId} onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim()) { setAttempted(true); return; }
        onSave({ ...task, id: task.id || crypto.randomUUID(), title: title.trim() });
        onClose();
      }}>
        <TextInputField label="태스크 이름" indicator="required" value={title} placeholder="태스크 이름을 입력하세요"
          status={attempted && !title.trim() ? 'error' : 'default'} error="이름을 입력해 주세요."
          onChange={(event) => setTitle(event.target.value)} />
      </form>
    </Popup>
  );
}

export function TaskBoard({ tasks, today, initialView = 'board', onSave }: Props) {
  const [view, setView] = useState(initialView);
  const [editing, setEditing] = useState<BoardTask | null>(null);
  return (
    <section className={styles.board} aria-label="팀 태스크 현황">
      <header className={styles.boardHeader}>
        <h2 className={styles.boardTitle}>전체 <Badge shape="pill">{tasks.length}</Badge></h2>
        <div className={styles.boardActions}>
          <div className={styles.toggle} role="group" aria-label="태스크 보기">
            {(['board', 'list'] as const).map((mode) => (
              <button key={mode} aria-pressed={mode === view} aria-label={mode === 'board' ? '칸반 보기' : '목록 보기'}
                onClick={() => setView(mode)}>{mode === 'board'
                  ? <Icon name="kanban" fill={mode === view} size={24} />
                  : <Icon name="list-bullet" size={24} />}</button>
            ))}
          </div>
          <Button size="small" icon="plus" onClick={() => setEditing({
            id: '', title: '', status: 'todo', assignee: '', dueAt: null, progress: 0, comments: 0, files: 0,
          })}>새 태스크</Button>
        </div>
      </header>
      <div className={styles.columns} data-view={view}>
        {TASK_STATUSES.map((status) => {
          const group = tasks.filter((task) => task.status === status);
          return (
            <section key={status} className={styles.column} aria-label={STATUS_LABEL[status]}>
              <h3 aria-label={STATUS_LABEL[status] + ' ' + group.length + '개'}>
                <TempStatusChip status={status} /><span>{group.length}</span>
              </h3>
              {group.map((task) => <TaskCard key={task.id} task={task} today={today} onEdit={() => setEditing(task)} />)}
              {group.length === 0 && <p className={styles.muted}>태스크가 없습니다.</p>}
            </section>
          );
        })}
      </div>
      {editing && <TaskEditor task={editing} onClose={() => setEditing(null)} onSave={onSave} />}
    </section>
  );
}
