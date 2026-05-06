import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  CalendarDays,
  Trophy,
  Coins,
  Star,
  AlertTriangle,
  FileText,
  X,
} from 'lucide-react';

interface RuleData {
  id: string;
  number: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

const rulesData: RuleData[] = [
  {
    id: 'rule1',
    number: '01',
    icon: <Shield size={20} />,
    title: '赛事 BP 规则',
    subtitle: '禁用流程与特殊解禁',
    content: (
      <>
        <div className="detail-section">BP 流程（全程 4 分钟）</div>
        ① 监管者先禁用 2 名求生者（30 秒）<br />
        ② 求生者再禁用 1 名监管者、1 张地图（1 分钟）<br />
        ③ 监管者再禁用 2 名求生者（30 秒）<br />
        ④ 求生者再禁用 1 名监管、1 张地图（1 分钟）<br />
        ⑤ 监管者最后禁用 1 名求生者、1 张地图（1 分钟）<br />
        <br />
        监管方总计禁用 5 名求生者、1 张地图；求生方禁用 2 名监管者、2 张地图。
        <br /><br />
        <div className="detail-section">特殊解禁规则</div>
        若监管者选手希望使用的 1 名监管者角色被求生方禁用，可向管理组提交解禁申请对其进行解禁。解禁后监管者只能禁用 3 位求生者，求生者可以禁用 3 张地图。解禁对全角色生效，同一选手赛程内只能使用 1 次。
      </>
    ),
  },
  {
    id: 'rule2',
    number: '02',
    icon: <CalendarDays size={20} />,
    title: '报名规则及时间安排',
    subtitle: '选手报名与管理组招募',
    content: (
      <>
        <div className="detail-section">选手报名</div>
        6 月 1 日开始报名。参赛选手总人数原则上不超过 25 人，选手可同时报名求生者阵营与监管者阵营。
        <br /><br />
        <div className="detail-section">管理组招募</div>
        6 月 1 日开始报名。当前账号或历史账号拥有某一阵营巅峰七阶 50 星及以上段位的选手可报名管理组。管理组负责赛事组织、BP 核对、违规判定、奖项评选、现场秩序维护等工作，人数不超过 5 人，不得兼任参赛选手。
        <br /><br />
        <div className="detail-section">报名要求</div>
        所有参赛选手及管理组人员需在 <strong>7 月 20 日前</strong> 完成报名。报名信息需真实有效，虚报段位、身份等一经发现取消参与资格。
        <br /><br />
        <div className="detail-section">时间安排</div>
        比赛时间：<strong>7 月 25 日至 7 月 29 日</strong>，共 5 天。<br />
        每日对战表于比赛当天 15:00 发布。<br />
        每日比赛时段：21:20 — 23:50（两个半小时）。<br />
        主播提前 20 分钟开播暖场。
      </>
    ),
  },
  {
    id: 'rule3',
    number: '03',
    icon: <Trophy size={20} />,
    title: '积分与演绎评选规则及奖励',
    subtitle: '排名奖励与淘汰机制',
    content: (
      <>
        <div className="detail-section">【监管者积分淘汰规则】</div>
        <strong>竞技型监管者</strong>：参与积分排名、可获得排名奖金，每日至少参赛 1 场，不超过 6 位。<br />
        <strong>娱乐型监管者</strong>：不参与积分排名，赛程内至少参赛 1 场、最多 2 场，不超过 5 位。<br />
        <br />
        <strong>积分计算：</strong>四抓 5 分 / 三抓 3 分 / 二抓 2 分 / 一抓 1 分 / 零抓 0 分<br />
        <br />
        <strong>淘汰机制：</strong><br />
        7 月 25 日开场赛，不产生淘汰；<br />
        7 月 26 日至 7 月 28 日淘汰赛，每日淘汰积分排名末尾 1 名；<br />
        剩余竞技型监管者晋级 7 月 29 日决赛。<br />
        <br />
        积分相同则加赛，均胜则用时短者晋级，均负或平局则用时长者晋级。<br />
        <br />
        <strong>监管者排名奖励：</strong>第一名 125 元 / 第二名 72 元 / 第三名 58 元<br />
        <br />
        <div className="detail-section">【求生者演绎能手评选规则】</div>
        <strong>正式型求生者</strong>：全程参与 5 天，不超过 12 位。<br />
        <strong>预备型求生者</strong>：可随时以替补身份上场，不超过 4 位。<br />
        <br />
        每场比赛结束后，管理组从 4 名求生者中评选 1 名演绎能手。评选存在争议时，由当场比赛监管者选择对其影响最大的求生者当选。<br />
        <br />
        赛程结束后统计获评次数排名，次数相同由管理组综合评定。<br />
        <br />
        <strong>求生者排名奖励：</strong>第一名 95 元 / 第二名 68 元 / 第三名 45 元
      </>
    ),
  },
  {
    id: 'rule4',
    number: '04',
    icon: <Coins size={20} />,
    title: '基础参与奖励、替补补贴',
    subtitle: '全程档与单日档',
    content: (
      <>
        <div className="detail-section">基础参与奖（二选一，不叠加）</div>
        <strong>全程档：</strong>成功报名、按赛程全程参赛且无缺席迟到早退，且无任何一天参赛≥5 场。<br />
        · 娱乐型监管者与预备型求生者（无论是否上场）：6 元<br />
        · 竞技型监管者与正式型求生者：12 元<br />
        <br />
        <strong>单日档：</strong>任意选手单日参赛场次≥5 场，对应全程奖作废，按达标天数结算。每有 1 天参赛≥5 场，发放 15 元；多日达标可累加。<br />
        <br />
        <div className="detail-section">替补补贴</div>
        以替补身份上场的选手，每日可获得 10 元基础补贴，可与基础参与奖叠加。<br />
        <br />
        单个选手通过上述两个规则获得的总奖金不超过 40 元。
      </>
    ),
  },
  {
    id: 'rule5',
    number: '05',
    icon: <Star size={20} />,
    title: '额外奖励规则',
    subtitle: '特殊成就奖励与奖池限制',
    content: (
      <>
        1、监管者选手在赛程内每场比赛均完成四抓的，奖励 25 元；<br />
        2、单场比赛中，监管者在四人开门战条件下获胜的，奖励 15 元；<br />
        3、单场比赛中，某位求生者发挥重大作用成功扭转败局的，奖励 15 元；<br />
        4、单场比赛中，四位求生者通过紧密配合成功扭转败局的，每位奖励 10 元；<br />
        5、选手完全按赛程安排表参赛、无特殊原因请假的，奖励 6 元；<br />
        6、其他管理组认为可给予额外奖励的，原则上不超过 15 元，可与其他奖项叠加。<br />
        <br />
        <div className="detail-section">奖池限制</div>
        单个选手通过额外奖励规则获得的总奖金不超过 50 元。<br />
        总奖池为 200 元，若应得总额超过 200 元，则所有获奖选手按原定奖金比例缩减。<br />
        <br />
        <strong>公式：</strong>个人最终所得 = 个人原定奖金 × (200 元 ÷ 所有选手原定奖金总额)
      </>
    ),
  },
  {
    id: 'rule6',
    number: '06',
    icon: <AlertTriangle size={20} />,
    title: '违规行为判定及处罚',
    subtitle: '违规界定与处罚措施',
    content: (
      <>
        <div className="detail-section">违规操作界定</div>
        严格禁用以下行为：脱离卡点、正义惩戒、利用游戏 BUG、恶意挂机、恶意送分、言语辱骂、消极比赛等一切违规及不文明行为。<br />
        <br />
        粉丝群作为水友赛赛事关联群，若参赛选手在粉丝群中违规导致被移出，则同步取消赛事参赛资格。<br />
        <br />
        <div className="detail-section">违规处罚措施</div>
        一经管理组核实，直接将违规选手所属阵营本场比赛判负，且本场比赛取消所有选手的演绎能手与额外奖励评选资格。<br />
        <br />
        情节严重者，直接取消本次赛事全部参与资格及所有奖励。
      </>
    ),
  },
  {
    id: 'rule7',
    number: '07',
    icon: <FileText size={20} />,
    title: '请假规则',
    subtitle: '请假时间与缺席处罚',
    content: (
      <>
        选手若因故无法按原定赛程表参赛，或需要临时调整个人比赛时间，必须在当天第一场比赛开赛时间前至少 30 分钟，向赛事管理组提出申请。<br />
        <br />
        未在规定时间内报备，视为无故缺席或迟到。<br />
        <br />
        除非选手能证明存在紧急的不可抗力特殊情况，否则将扣除第四大点"基础参与奖励、替补补贴规则"获得的全部奖金与补贴。
      </>
    ),
  },
];

/* ========== Glow layers - pure HTML divs with JS transform ========== */
function GlowLayers() {
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const glow3Ref = useRef<HTMLDivElement>(null);
  const glow4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouse = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    let raf = 0;

    const handleMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      smooth.x = lerp(smooth.x, mouse.x, 0.035);
      smooth.y = lerp(smooth.y, mouse.y, 0.035);

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Different parallax speeds for each glow layer
      if (glow1Ref.current) {
        const x = (smooth.x - 0.5) * vw * 0.6;
        const y = (smooth.y - 0.5) * vh * 0.6;
        glow1Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (glow2Ref.current) {
        const x = (smooth.x - 0.5) * vw * 0.4;
        const y = (smooth.y - 0.5) * vh * 0.4;
        glow2Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (glow3Ref.current) {
        const x = (smooth.x - 0.5) * vw * -0.2;
        const y = (smooth.y - 0.5) * vh * -0.2;
        glow3Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (glow4Ref.current) {
        const x = (smooth.x - 0.5) * vw * 0.15;
        const y = (smooth.y - 0.5) * vh * 0.1;
        glow4Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={glow1Ref}
        className="glow-layer"
        style={{
          width: '900px',
          height: '900px',
          top: '-200px',
          left: '-200px',
          background: 'radial-gradient(circle, rgba(120, 80, 220, 0.22) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        ref={glow2Ref}
        className="glow-layer"
        style={{
          width: '1100px',
          height: '1100px',
          bottom: '-300px',
          right: '-300px',
          background: 'radial-gradient(circle, rgba(60, 140, 220, 0.18) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        ref={glow3Ref}
        className="glow-layer"
        style={{
          width: '700px',
          height: '700px',
          top: '30%',
          left: '40%',
          background: 'radial-gradient(circle, rgba(80, 180, 200, 0.12) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        ref={glow4Ref}
        className="glow-layer"
        style={{
          width: '600px',
          height: '600px',
          top: '10%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(180, 120, 220, 0.12) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />
    </>
  );
}

/* ========== Card Component ========== */
function Card({ rule, onClick }: { rule: RuleData; onClick: () => void }) {
  return (
    <div className="liquid-card" onClick={onClick}>
      <div className="card-shine" />
      <div className="card-tint" />
      <div className="card-header">
        <div className="card-icon-box">{rule.icon}</div>
        <span className="card-num">{rule.number}</span>
      </div>
      <div className="card-body">
        <div className="card-title">{rule.title}</div>
        <div className="card-subtitle">{rule.subtitle}</div>
      </div>
    </div>
  );
}

/* ========== Main Component ========== */
export default function Home() {
  const [activeRule, setActiveRule] = useState<RuleData | null>(null);

  useEffect(() => {
    if (activeRule) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeRule]);

  return (
    <>
      {/* Background glow layers */}
      <GlowLayers />

      {/* Page content */}
      <div className="page-content">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h1
            style={{
              fontWeight: 700,
              fontSize: 'clamp(26px, 4.5vw, 38px)',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '8px',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            冬冬杯第二届·暑期版
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '10px', letterSpacing: '4px' }}>
            赛事细则
          </p>
          <div
            style={{
              width: '50px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)',
              margin: '18px auto 0',
            }}
          />
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            width: '100%',
            maxWidth: '960px',
          }}
        >
          {rulesData.map((rule) => (
            <Card key={rule.id} rule={rule} onClick={() => setActiveRule(rule)} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', maxWidth: '680px', textAlign: 'center' }}>
          <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 auto 14px' }} />
          <p className="liquid-footer">
            八、附则：本细则自发布之日起生效，所有报名参与本次暑期水友赛的选手、管理组成员，均视为已阅读并同意本细则全部条款，自愿遵守各项规定。
            <br />
            Copyright &copy; 冬冬Soyona
          </p>
        </div>
      </div>

      {/* Detail Overlay - CSS class toggle only */}
      <div
        className={`detail-overlay ${activeRule ? 'open' : ''}`}
        onClick={() => setActiveRule(null)}
      >
        <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
          <div className="panel-shine" />

          <div className="detail-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="detail-num">{activeRule?.number}</span>
              <span className="detail-title-text">{activeRule?.title}</span>
            </div>
            <button className="close-btn" onClick={() => setActiveRule(null)}>
              <X size={22} />
            </button>
          </div>

          <div className="detail-content">
            <div className="detail-text">{activeRule?.content}</div>
          </div>
        </div>
      </div>
    </>
  );
}
