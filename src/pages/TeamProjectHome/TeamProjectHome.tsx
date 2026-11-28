import { useId, useState, type ReactNode } from 'react';
import { getMyNotifications, getMyTasks } from '../../mocks/queries';
import { Avatar } from '../../components/Avatar/Avatar';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { DropdownMenu, MenuItem } from '../../components/Dropdown/Dropdown';
import { Icon } from '../../components/Icon/Icon';
import { Popup } from '../../components/Popup/Popup';
import { ALL_PROJECTS_ID, Sidebar, type SidebarMenu } from '../../components/Sidebar/Sidebar';
import { TabItem, Tabs } from '../../components/Tab/Tab';
import { ProjectSchedule } from './ProjectSchedule';
import { TaskBoard } from './TaskBoard';
import { demoToday, getHomeProjects, homeUser, type BoardTask, type Project, type ProjectEvent } from './projectData';
import styles from './TeamProjectHome.module.css';

const defaultProjects = getHomeProjects();
const tabs = ['홈', '전체 일정', '팀 태스크 관리', '히스토리', '첨부파일'];

function Templates({ project }: { project: Project }) {
  return <ul className={styles.templates}>
    {project.templates.map((file) => <li key={file.name}>
      <a href={file.url} download={file.filename}>{file.name}<Icon name="download" size={16} /></a>
    </li>)}
  </ul>;
}

function ProjectSummary({ project, show, onFiles }: {
  project: Project;
  show: (title: string, content: ReactNode) => void;
  onFiles: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const settingsId = useId();
  const rules = <ul className={styles.rules}>{project.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>;
  return <>
    {project.notice && <button className={styles.notice} onClick={() => show('팀 공지', project.notice)}>
      <Badge shape="pill" type="neutral-weak">공지</Badge><strong>{project.notice}</strong><Icon name="chevron-right" />
    </button>}
    {(project.rules.length > 0 || project.templates.length > 0) && <section>
      <h2><button className={styles.fold} aria-expanded={expanded} aria-controls={settingsId} onClick={() => setExpanded(!expanded)}>
        <Icon name={expanded ? 'chevron-down' : 'chevron-right'} />프로젝트 설정
      </button></h2>
      <div className={styles.settingsGrid} id={settingsId} hidden={!expanded}>
        <article>
          <button className={styles.sectionLink} onClick={() => show('그라운드 룰', rules)}>그라운드 룰<Icon name="chevron-right" /></button>
          {rules}
        </article>
        <article>
          <button className={styles.sectionLink} onClick={onFiles}>팀 프로젝트 양식<Icon name="chevron-right" /></button>
          <Templates project={project} />
        </article>
      </div>
    </section>}
    {project.milestone && <section className={styles.milestone} aria-label="프로젝트 마일스톤">
      <h2 className="typo-heading4">{project.milestone.title}</h2>
      <ol>{project.milestone.steps.map((step, index) => <li key={step}
        data-complete={index < project.milestone!.current}
        aria-current={index === project.milestone!.current ? 'step' : undefined}>{step}</li>)}</ol>
    </section>}
  </>;
}

export type TeamProjectHomeProps = {
  projects?: Project[];
  profile?: { name: string; avatarUrl?: string | null };
  today?: string;
  initialView?: 'board' | 'list';
};

export function TeamProjectHome({ projects = defaultProjects, profile = homeUser, today = demoToday, initialView }: TeamProjectHomeProps) {
  const [projectId, setProjectId] = useState(projects[0]?.id);
  const [tab, setTab] = useState('홈');
  const [changedTasks, setChangedTasks] = useState<Record<string, BoardTask[]>>({});
  const [addedEvents, setAddedEvents] = useState<Record<string, ProjectEvent[]>>({});
  const [changes, setChanges] = useState<Record<string, string[]>>({});
  const [dialog, setDialog] = useState<{ title: string; content: ReactNode } | null>(null);
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const tasks = project ? changedTasks[project.id] ?? project.tasks : [];
  const show = (title: string, content: ReactNode) => setDialog({ title, content });

  function selectProject(id: string) {
    if (id === ALL_PROJECTS_ID) {
      show('팀 프로젝트', <div className={styles.projectPicker}>{projects.map((item) =>
        <Button key={item.id} variant="neutral-weak" onClick={() => selectProject(item.id)}>{item.name}</Button>
      )}</div>);
      return;
    }
    setProjectId(id);
    setTab('홈');
    setDialog(null);
  }

  function selectMenu(menu: SidebarMenu) {
    switch (menu) {
      case 'home': setTab('홈'); break;
      case 'team-project': selectProject(ALL_PROJECTS_ID); break;
      case 'my-tasks': show('나의 태스크', <ul>{getMyTasks().map((task) => <li key={task.id}>{task.title}</li>)}</ul>); break;
      case 'notifications': show('알림', <ul>{getMyNotifications().map((item) => <li key={item.id}>{item.message}</li>)}</ul>); break;
      case 'settings': show('계정 정보', profile.name); break;
    }
  }

  function saveTask(task: BoardTask) {
    if (!project) return;
    const exists = tasks.some((item) => item.id === task.id);
    const next = exists ? tasks.map((item) => item.id === task.id ? task : item) : [...tasks, task];
    setChangedTasks((previous) => ({ ...previous, [project.id]: next }));
    setChanges((previous) => ({ ...previous, [project.id]: [task.title + (exists ? ' · 수정' : ' · 추가'), ...(previous[project.id] ?? [])] }));
  }

  return (
    <div className={styles.page}>
      <aside className={styles.rail}>
        <Sidebar className={styles.sidebar} activeMenu="team-project" projects={projects} activeProjectId={project?.id}
          userName={profile.name} avatar={<Avatar initial={profile.name.charAt(0)} src={profile.avatarUrl ?? undefined} />}
          onMenuSelect={selectMenu} onProjectSelect={selectProject} onUserMenuClick={() => show('계정 정보', profile.name)} />
      </aside>
      {project ? <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.heading}><h1 className="typo-heading1">{project.name}</h1>
            <DropdownMenu width={180} sideOffset={12} className={styles.projectMenu} trigger={
              <button type="button" className={styles.iconButton} aria-label={project.name + ' 더보기'}><Icon name="more" /></button>
            }>
              <MenuItem label="초대 링크 생성" leading={<Icon name="link" size={16} />}
                onSelect={() => show('초대 링크 생성', '데모에서는 초대 링크를 발급할 수 없습니다.')} />
              <div role="separator" className={styles.menuDivider} />
              <MenuItem label="프로젝트 설정" leading={<Icon name="settings" size={16} fill />}
                onSelect={() => show('프로젝트 설정', <><strong>{project.name}</strong><p>{project.description}</p></>)} />
            </DropdownMenu>
          </div>
          <div className={styles.tabScroll}>
            <Tabs value={tab} onValueChange={setTab} aria-label="프로젝트 메뉴" className={styles.tabs}>
              {tabs.map((name) => <TabItem value={name} key={name} className={styles.tab}>{name}</TabItem>)}
            </Tabs>
          </div>
        </header>
        {tab === '홈' && <ProjectSummary key={'summary-' + project.id} project={project} show={show} onFiles={() => setTab('첨부파일')} />}
        {(tab === '홈' || tab === '팀 태스크 관리') && <TaskBoard key={'tasks-' + project.id} tasks={tasks} today={today}
          initialView={initialView} onSave={saveTask} />}
        {tab === '전체 일정' && <ProjectSchedule key={project.id} today={today}
          events={[...project.schedule, ...(addedEvents[project.id] ?? [])]} onSaveTask={saveTask}
          onAdd={(event) => setAddedEvents(previous => ({
            ...previous, [project.id]: [...(previous[project.id] ?? []), event],
          }))} />}
        {tab === '히스토리' && <section className={styles.panel}><h2>히스토리</h2>
          {changes[project.id]?.length ? <ul>{changes[project.id].map((label, i) => <li key={i}>{label}</li>)}</ul> : <p>이번 세션의 태스크 변경 내역이 없습니다.</p>}
        </section>}
        {tab === '첨부파일' && <section className={styles.panel}><h2>팀 프로젝트 양식</h2>
          {project.templates.length ? <Templates project={project} /> : <p>등록된 양식이 없습니다.</p>}
        </section>}
      </main> : <main className={styles.main}><h1>팀 프로젝트</h1><p>참여 중인 프로젝트가 없습니다.</p></main>}
      {dialog && <Popup open title={dialog.title} onClose={() => setDialog(null)}>{dialog.content}</Popup>}
    </div>
  );
}
