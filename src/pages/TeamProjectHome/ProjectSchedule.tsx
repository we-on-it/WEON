import { useState, type CSSProperties } from 'react';
import { Button } from '../../components/Button/Button';
import { Icon } from '../../components/Icon/Icon';
import { Popup } from '../../components/Popup/Popup';
import { TaskEditor } from './TaskBoard';
import type { BoardTask, ProjectEvent } from './projectData';
import styles from './ProjectSchedule.module.css';

const DAY = 86400000;
const dayNumber = (iso: string) => Date.parse(iso.slice(0, 10)) / DAY;
const date = (day: number) => new Date(day * DAY);
const isoDate = (day: number) => date(day).toISOString().slice(0, 10);
const monthStart = (day: number, offset = 0) => Date.UTC(date(day).getUTCFullYear(), date(day).getUTCMonth() + offset, 1) / DAY;
const range = (length: number) => Array.from({ length }, (_, i) => i);

function inPeriod(events: ProjectEvent[], first: number, length: number) {
  return events.flatMap(event => {
    const start = dayNumber(event.startAt);
    const end = dayNumber(event.endAt ?? event.startAt);
    if (end < first || start >= first + length) return [];
    return [{ event, start, end, columns: {
      gridColumn: (Math.max(start, first) - first + 1) + ' / ' + (Math.min(end, first + length - 1) - first + 2),
    } }];
  }).sort((a, b) => a.start - b.start || Number(b.event.kind === 'milestone') - Number(a.event.kind === 'milestone'));
}

function eventStyle(event: ProjectEvent): CSSProperties {
  const color = event.color ?? 'purple';
  return event.kind === 'milestone' ? {
    color: 'var(--accent-foreground-' + color + ')', background: 'var(--accent-background-' + color + ')',
  } : {};
}

function Calendar({ month, today, events }: { month: number; today: number; events: ProjectEvent[] }) {
  const first = month - date(month).getUTCDay();
  const weeks = Math.ceil((monthStart(month, 1) - first) / 7);
  return <div aria-label="월간 캘린더">
    <div className={styles.weekdays}>{Array.from('일월화수목금토', day => <span key={day}>{day}</span>)}</div>
    {range(weeks).map(week => {
      const start = first + week * 7;
      return <div key={start} className={styles.week}>
        <div className={styles.dates}>{range(7).map(i => {
          const day = start + i;
          return <time key={day} dateTime={isoDate(day)} data-outside={monthStart(day) !== month}
            aria-current={day === today ? 'date' : undefined}>{day === today && '오늘 '}{date(day).getUTCDate()}</time>;
        })}</div>
        <div className={styles.bars}>{inPeriod(events, start, 7).map(({ event, columns }, i) =>
          <span className={styles.bar} key={i} title={event.title} style={{ ...columns, ...eventStyle(event) }}>{event.title}</span>)}</div>
      </div>;
    })}
  </div>;
}

function Timeline({ first, today, events, onCreate, onJump }: { first: number; today: number; events: ProjectEvent[]; onCreate: () => void; onJump: (day: number) => void }) {
  return <div className={styles.timeline} aria-label="10일 타임라인">
    <div className={styles.days}>{range(10).map(i => <time key={i} dateTime={isoDate(first + i)}
      aria-current={first + i === today ? 'date' : undefined}>{date(first + i).getUTCDate()}</time>)}</div>
    {today >= first && today < first + 10 && <div className={styles.marker} style={{ left: ((today - first + .5) * 10) + '%' }} />}
    <div className={styles.tracks}>{inPeriod(events, first, 10).map(({ event, start, end, columns }, i) => {
      const milestone = event.kind === 'milestone';
      return <div className={styles.track} key={i}><div className={milestone ? styles.milestone : styles.event} style={columns} title={event.title}>
        {milestone && start < first && <button className={styles.edge} aria-label={event.title + ' 시작일로 이동'} onClick={() => onJump(start)}><Icon name="arrow-left" size={16} /></button>}
        {milestone && <Icon name="flag" fill size={18} />}
        <span>{!milestone && !event.allDay && event.startAt.includes('T') && event.startAt.slice(11, 16) + ' '}{event.title}</span>
        {milestone && <small>● {today < start ? '시작 전' : today > end ? '완료' : '진행 중'}</small>}
        {milestone && end >= first + 10 && <button className={styles.edge} aria-label={event.title + ' 종료일로 이동'} onClick={() => onJump(end)}><Icon name="chevron-right" size={16} /></button>}
      </div></div>;
    })}</div>
    <Button size="large" variant="neutral-ghost" icon="plus" onClick={onCreate}>새로 만들기</Button>
  </div>;
}

type Props = {
  today: string;
  events: ProjectEvent[];
  initialView?: 'timeline' | 'calendar';
  onAdd: (event: ProjectEvent) => void;
  onSaveTask: (task: BoardTask) => void;
};

export function ProjectSchedule({ today, events, initialView = 'timeline', onAdd, onSaveTask }: Props) {
  const current = dayNumber(today);
  const [view, setView] = useState(initialView);
  const [anchor, setAnchor] = useState(current);
  const [milestones, setMilestones] = useState(true);
  const [appointments, setAppointments] = useState(true);
  const [editor, setEditor] = useState<'event' | 'task' | null>(null);
  const month = monthStart(anchor);
  const calendar = view === 'calendar';
  const visible = events.filter(event => event.kind === 'milestone' ? milestones : appointments);
  const shift = (step: number) => setAnchor(calendar ? monthStart(anchor, step) : anchor + step * 10);
  return <section className={styles.schedule} aria-label="전체 일정">
    <header className={styles.heading}><div><h2>전체 일정</h2><p>마일스톤을 포함한 전체일정을 확인하세요</p></div>
      <Button size="small" icon="plus" onClick={() => setEditor('task')}>새 태스크</Button></header>
    <div className={styles.panel}><div className={styles.tools}>
      <strong>{date(anchor).getUTCFullYear()}년 {date(anchor).getUTCMonth() + 1}월</strong>
      <div className={styles.navigation}>{([-1, 1] as const).map(step => <button key={step}
        aria-label={(step < 0 ? '이전 ' : '다음 ') + (calendar ? '달' : '10일')} onClick={() => shift(step)}>
        <Icon size={16} name={step < 0 ? 'chevron-left' : 'chevron-right'} /></button>)}</div>
      {calendar && <Button size="small" variant="neutral-weak" onClick={() => setAnchor(current)}>오늘</Button>}
      <div className={styles.filters}><label><input type="checkbox" checked={milestones} onChange={e => setMilestones(e.target.checked)} />마일스톤</label>
        <label><input type="checkbox" checked={appointments} onChange={e => setAppointments(e.target.checked)} />일정</label></div>
      <div className={styles.toggle} role="group" aria-label="일정 보기">{(['calendar', 'timeline'] as const).map(mode =>
        <button key={mode} aria-pressed={view === mode} onClick={() => setView(mode)}>
          <Icon name={mode === 'calendar' ? 'calendar' : 'list-rectangle'} size={22} />{mode === 'calendar' ? '캘린더' : '타임라인'}</button>)}</div>
    </div>
    {calendar ? <Calendar month={month} today={current} events={visible} /> :
      <Timeline first={anchor - 5} today={current} events={visible} onJump={setAnchor} onCreate={() => setEditor('event')} />}
    </div>
    {editor === 'task' && <TaskEditor task={{ id: '', title: '', status: 'todo', assignee: '', dueAt: null, progress: 0, comments: 0, files: 0 }}
      onSave={onSaveTask} onClose={() => setEditor(null)} />}
    {editor === 'event' && <Popup open title="새로 만들기" onClose={() => setEditor(null)}>
      <form className={styles.form} onSubmit={e => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const start = String(data.get('start')), end = String(data.get('end'));
        const title = String(data.get('title')).trim();
        if (!title || end < start) return;
        onAdd({ title, kind: data.get('kind') === 'milestone' ? 'milestone' : 'event', startAt: start, endAt: end, allDay: true });
        setAnchor(dayNumber(start)); setEditor(null);
      }}>
        <label>종류<select name="kind"><option value="event">일정</option><option value="milestone">마일스톤</option></select></label>
        <label>이름<input name="title" required pattern=".*\S.*" /></label>
        <label>시작일<input type="date" name="start" required defaultValue={isoDate(anchor)} onChange={e => {
          const end = e.currentTarget.form?.elements.namedItem('end') as HTMLInputElement;
          end.min = e.target.value;
          if (end.value < end.min) end.value = end.min;
        }} /></label>
        <label>종료일<input type="date" name="end" required defaultValue={isoDate(anchor)} min={isoDate(anchor)} /></label>
        <Button type="submit">저장</Button>
      </form></Popup>}
  </section>;
}
