import { createRoot } from 'react-dom/client';
import { Avatar } from '../src/components/Avatar/Avatar';
import { Sidebar } from '../src/components/Sidebar/Sidebar';
import { getCurrentUser, getMyTeams } from '../src/mocks/queries';
import { MyTasks } from '../src/pages/MyTasks/MyTasks';
import '../src/styles/global.css';

const user = getCurrentUser();
const projects = getMyTeams().map((t) => ({ id: t.id, name: t.name, color: t.accent }));

// 앱 레이아웃이 생기기 전까지 쓰는 임시 껍데기: 사이드바(바깥 여백 20) + 본문 (Storybook Pages/MyTasks와 같은 배치)
function App() {
  return (
    <div style={{ display: 'flex', minWidth: 1280, minHeight: '100vh', background: 'var(--background-default)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', padding: '20px 0 20px 20px', boxSizing: 'border-box', flexShrink: 0 }}>
        <Sidebar
          activeMenu="my-tasks"
          projects={projects}
          userName={user.name}
          avatar={<Avatar initial={user.name[0]} src={user.avatarUrl ?? undefined} />}
          onMenuSelect={(menu) => {
            if (menu === 'team-project') window.location.href = '../team-project-home/';
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: '53px 31px 40px 45px' }}>
        <MyTasks />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
