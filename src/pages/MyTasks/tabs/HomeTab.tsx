import type { ReactNode } from 'react';
import { Badge, type BadgeType } from '../../../components/Badge/Badge';
import { Icon } from '../../../components/Icon/Icon';
import { MilestoneChip, MILESTONE_TYPE_LABEL } from '../../../components/MilestoneChip/MilestoneChip';
import { getTeam } from '../../../mocks/queries';
import type { ID, Milestone, Notification, TeamAccent } from '../../../mocks/types';
import {
  formatDDay,
  formatMonthDay,
  formatRelativeTime,
  type MyTasksOverview,
  type TaskItem,
} from '../myTasksOverview';
import styles from './HomeTab.module.css';

/** 팀 accent → Badge 팀 타입. Badge에 purple 팀 타입이 없어서 purple은 회색으로 보여요 */
const TEAM_BADGE: Record<TeamAccent, BadgeType> = {
  pink: 'team1',
  orange: 'team2',
  teal: 'team3',
  purple: 'neutral-weak',
};

function TeamBadge({ teamId }: { teamId: ID | null }) {
  const team = teamId ? getTeam(teamId) : undefined;
  return (
    <Badge size="large" type={team ? TEAM_BADGE[team.accent] : 'neutral-weak'}>
      {team?.name ?? '개인'}
    </Badge>
  );
}

/** 핸들러가 있으면 버튼(hover 배경), 없으면 그냥 줄 */
function Row({ onClick, className, children }: { onClick?: () => void; className: string; children: ReactNode }) {
  if (!onClick) return <div className={className}>{children}</div>;
  return (
    <button type="button" className={[className, styles.clickable].join(' ')} onClick={onClick}>
      {children}
    </button>
  );
}

function Panel({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <section className={styles.panel} aria-label={title}>
      <h2 className={styles.panelHead}>
        {title}
        {count !== undefined && count > 0 && <span className={styles.panelCount}>{count}</span>}
      </h2>
      {children}
    </section>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'critical' | 'brand' }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statLabel}>{label}</dt>
      <dd className={[styles.statValue, tone && styles[tone]].filter(Boolean).join(' ')}>{value}</dd>
    </div>
  );
}

/* ── 마감일이 다가오는 태스크 ─────────────────────────────── */

function UpcomingGroup({
  label,
  tasks,
  critical = false,
  onTaskSelect,
}: {
  label: string;
  tasks: TaskItem[];
  critical?: boolean;
  onTaskSelect?: (taskId: ID) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <div className={styles.group}>
      <h3 className={[styles.groupLabel, critical && styles.critical].filter(Boolean).join(' ')}>{label}</h3>
      <ul className={styles.list}>
        {tasks.map((t) => {
          const meta = [
            t.milestone && MILESTONE_TYPE_LABEL[t.milestone.type],
            t.milestone?.name,
            `${t.progress}%`,
          ].filter(Boolean);
          return (
            <li key={t.id}>
              <Row className={styles.taskRow} onClick={onTaskSelect && (() => onTaskSelect(t.id))}>
                <span className={[styles.dDay, t.days < 0 && styles.critical].filter(Boolean).join(' ')}>
                  {formatDDay(t.days)}
                </span>
                <TeamBadge teamId={t.teamId} />
                <span className={styles.taskText}>
                  <span className={styles.taskTitle}>{t.title}</span>
                  <span className={styles.taskMeta}>{meta.join(' · ')}</span>
                </span>
              </Row>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── 중요한 태스크 ─────────────────────────────────────── */

function ImportantList({ tasks, onTaskSelect }: { tasks: TaskItem[]; onTaskSelect?: (taskId: ID) => void }) {
  return (
    <ul className={styles.list}>
      {tasks.map((t) => (
        <li key={t.id}>
          <Row className={styles.taskRow} onClick={onTaskSelect && (() => onTaskSelect(t.id))}>
            {/* 우선순위 최상(마감 지남·D-1 이내)은 빨강 */}
            <span
              className={[styles.dDay, styles.dDayFixed, t.effectivePriority === 'highest' ? styles.critical : styles.muted].join(' ')}
            >
              {formatDDay(t.days)}
            </span>
            <TeamBadge teamId={t.teamId} />
            <span className={styles.taskTitleRow}>
              {t.nudged && <Icon name="siren" size={16} className={styles.siren} title="찌르기 받음" />}
              <span className={styles.taskTitle}>{t.title}</span>
            </span>
          </Row>
        </li>
      ))}
    </ul>
  );
}

/* ── 안 읽은 요청 ──────────────────────────────────────── */

function RequestList({
  requests,
  onRequestSelect,
}: {
  requests: Notification[];
  onRequestSelect?: (notificationId: ID) => void;
}) {
  return (
    <ul className={styles.list}>
      {requests.map((n) => (
        <li key={n.id}>
          <Row className={styles.requestRow} onClick={onRequestSelect && (() => onRequestSelect(n.id))}>
            <TeamBadge teamId={n.teamId} />
            <span className={styles.requestMessage}>{n.message}</span>
            <time className={styles.requestTime} dateTime={n.createdAt}>
              {formatRelativeTime(n.createdAt)}
            </time>
          </Row>
        </li>
      ))}
    </ul>
  );
}

/* ── 진행 중인 마일스톤 ─────────────────────────────────── */

function MilestoneList({ milestones }: { milestones: Milestone[] }) {
  return (
    <ul className={styles.list}>
      {milestones.map((m) => (
        <li key={m.id} className={styles.milestone}>
          <div className={styles.milestoneHead}>
            <TeamBadge teamId={m.teamId} />
            <MilestoneChip type={m.type} name={m.name} />
            <span className={styles.milestonePeriod}>
              {formatMonthDay(m.startAt)} – {formatMonthDay(m.endAt)}
            </span>
          </div>
          <div className={styles.progressRow}>
            <div
              className={styles.progress}
              role="progressbar"
              aria-label={`${m.name} 진행률`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={m.progress}
            >
              <div className={styles.progressFill} style={{ width: `${m.progress}%` }} />
            </div>
            <span className={styles.progressValue}>{m.progress}%</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

/* ── HomeTab ───────────────────────────────────────────── */

export type HomeTabProps = {
  overview: MyTasksOverview;
  /** 태스크 줄을 눌렀을 때. 없으면 줄이 버튼이 아니에요 */
  onTaskSelect?: (taskId: ID) => void;
  /** 요청 줄을 눌렀을 때. 없으면 줄이 버튼이 아니에요 */
  onRequestSelect?: (notificationId: ID) => void;
};

/**
 * 나의 태스크 > 홈 탭 (Figma 454:18251).
 * 요약 카드 5개 + 2열 패널 4개 (마감 임박 · 중요 / 안 읽은 요청 · 진행 중인 마일스톤)
 */
export function HomeTab({ overview, onTaskSelect, onRequestSelect }: HomeTabProps) {
  const { overdue, dueToday, dueLaterThisWeek, inProgressCount, important, unreadRequests, activeMilestones } =
    overview;
  const hasUpcoming = overdue.length + dueToday.length + dueLaterThisWeek.length > 0;

  return (
    <div className={styles.home}>
      <dl className={styles.summary}>
        <Stat label="마감 지남" value={overdue.length} tone={overdue.length > 0 ? 'critical' : undefined} />
        <Stat label="오늘 마감" value={dueToday.length} />
        <Stat label="이번 주 마감 (남은)" value={dueToday.length + dueLaterThisWeek.length} />
        <Stat label="진행 중" value={inProgressCount} tone="brand" />
        <Stat label="안 읽은 요청" value={unreadRequests.length} />
      </dl>

      <div className={styles.grid}>
        <div className={styles.column}>
          <Panel title="마감일이 다가오는 태스크">
            {hasUpcoming ? (
              <>
                <UpcomingGroup label="마감 지남" tasks={overdue} critical onTaskSelect={onTaskSelect} />
                <UpcomingGroup label="오늘" tasks={dueToday} onTaskSelect={onTaskSelect} />
                <UpcomingGroup label="이번 주" tasks={dueLaterThisWeek} onTaskSelect={onTaskSelect} />
              </>
            ) : (
              <Empty>이번 주에 마감되는 태스크가 없어요.</Empty>
            )}
          </Panel>
          <Panel title="중요한 태스크">
            {important.length > 0 ? (
              <ImportantList tasks={important} onTaskSelect={onTaskSelect} />
            ) : (
              <Empty>중요한 태스크가 없어요.</Empty>
            )}
          </Panel>
        </div>

        <div className={styles.column}>
          <Panel title="안 읽은 요청" count={unreadRequests.length}>
            {unreadRequests.length > 0 ? (
              <RequestList requests={unreadRequests} onRequestSelect={onRequestSelect} />
            ) : (
              <Empty>새로운 요청이 없어요.</Empty>
            )}
          </Panel>
          <Panel title="진행 중인 마일스톤">
            {activeMilestones.length > 0 ? (
              <MilestoneList milestones={activeMilestones} />
            ) : (
              <Empty>진행 중인 마일스톤이 없어요.</Empty>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default HomeTab;
