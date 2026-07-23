import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  Bot,
  Building2,
  CalendarClock,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  FileCheck2,
  FilePlus2,
  HeartPulse,
  Home,
  House,
  Info,
  LifeBuoy,
  LockKeyhole,
  MapPin,
  MessageCircleMore,
  PhoneCall,
  Plane,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  User,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import heroImage from "./assets/protection-hero.png";

const STORAGE_KEY = "indie-protect-capstone-v1";

type MainTab = "home" | "explore" | "vault" | "claims";
type Screen =
  | MainTab
  | "compare"
  | "plan"
  | "checkout"
  | "policy"
  | "claim-start"
  | "claim-evidence"
  | "claim-submitted"
  | "claim-track"
  | "renewal"
  | "assistant"
  | "services"
  | "profile";
type ClaimStatus = "none" | "submitted" | "surveyor" | "assessment" | "approved";
type Category = "motor" | "health" | "travel" | "home";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

type AppState = {
  screen: Screen;
  lastMainTab: MainTab;
  category: Category;
  selectedPlans: string[];
  activePlanId: string;
  checkoutConsent: boolean;
  purchasedTopUp: boolean;
  importedPolicy: boolean;
  renewedMotor: boolean;
  renewalAutopay: boolean;
  incidentType: string;
  incidentLocation: string;
  uploadedEvidence: number;
  claimStatus: ClaimStatus;
  requestedService: string;
  personalization: boolean;
  notifications: boolean;
  chat: ChatMessage[];
};

type Plan = {
  id: string;
  name: string;
  insurer: string;
  category: Category;
  premium: number;
  cover: string;
  network: string;
  bestFor: string;
  score: number;
  zeroDep: boolean;
  roadside: boolean;
  cashless: boolean;
  highlights: string[];
  exclusions: string[];
};

const plans: Plan[] = [
  {
    id: "drive-smart",
    name: "Drive Smart",
    insurer: "IndusInd General Insurance",
    category: "motor",
    premium: 6840,
    cover: "Rs. 7.5 lakh IDV",
    network: "10,000+ cashless garages",
    bestFor: "Essential protection at a lower premium",
    score: 87,
    zeroDep: false,
    roadside: true,
    cashless: true,
    highlights: ["Own damage + third party", "24x7 roadside assistance", "Cashless repair network"],
    exclusions: ["Tyre wear", "Mechanical breakdown", "Driving without a valid licence"],
  },
  {
    id: "drive-total",
    name: "Drive Total",
    insurer: "IndusInd General Insurance",
    category: "motor",
    premium: 8990,
    cover: "Rs. 7.5 lakh IDV",
    network: "10,000+ cashless garages",
    bestFor: "Newer cars and lower out-of-pocket repair costs",
    score: 94,
    zeroDep: true,
    roadside: true,
    cashless: true,
    highlights: ["Zero depreciation included", "Engine protect add-on", "Key replacement cover"],
    exclusions: ["Consumables unless added", "Illegal use", "Consequential loss"],
  },
  {
    id: "motor-flex",
    name: "Motor Flex",
    insurer: "Partner insurer",
    category: "motor",
    premium: 7520,
    cover: "Rs. 7.2 lakh IDV",
    network: "8,500+ cashless garages",
    bestFor: "Low annual driving with flexible add-ons",
    score: 82,
    zeroDep: true,
    roadside: false,
    cashless: true,
    highlights: ["Pay-as-you-drive option", "Zero depreciation add-on", "Return-to-invoice option"],
    exclusions: ["Roadside assistance", "Daily commute above selected limit", "Wear and tear"],
  },
  {
    id: "health-topup",
    name: "Health Shield Top-up",
    insurer: "IndusInd General Insurance",
    category: "health",
    premium: 4680,
    cover: "Rs. 20 lakh cover",
    network: "10,000+ cashless hospitals",
    bestFor: "Protecting family savings above your base cover",
    score: 91,
    zeroDep: false,
    roadside: false,
    cashless: true,
    highlights: ["Rs. 5 lakh deductible", "No room-rent cap", "Pre and post-hospitalisation"],
    exclusions: ["First 30-day waiting period", "Non-medical consumables", "Undeclared conditions"],
  },
  {
    id: "travel-ready",
    name: "Travel Ready Asia",
    insurer: "IndusInd General Insurance",
    category: "travel",
    premium: 1199,
    cover: "USD 100,000 cover",
    network: "Worldwide assistance",
    bestFor: "Single-trip medical and baggage protection",
    score: 86,
    zeroDep: false,
    roadside: false,
    cashless: true,
    highlights: ["Emergency medical cover", "Trip delay benefit", "Lost baggage support"],
    exclusions: ["Adventure sports", "Known medical events", "Unattended baggage"],
  },
  {
    id: "home-secure",
    name: "Home Secure",
    insurer: "IndusInd General Insurance",
    category: "home",
    premium: 2490,
    cover: "Rs. 25 lakh cover",
    network: "Home assistance in 30 cities",
    bestFor: "Owned apartments and valuable contents",
    score: 84,
    zeroDep: false,
    roadside: false,
    cashless: false,
    highlights: ["Fire and natural calamity", "Contents protection", "Emergency home assistance"],
    exclusions: ["Routine maintenance", "Unoccupied home over 30 days", "Gradual damage"],
  },
];

const initialChat: ChatMessage[] = [
  {
    role: "assistant",
    text: "Hi Ananya. I can explain cover, check claim documents, or help with a renewal in plain language.",
  },
];

const initialState: AppState = {
  screen: "home",
  lastMainTab: "home",
  category: "motor",
  selectedPlans: ["drive-smart", "drive-total", "motor-flex"],
  activePlanId: "drive-total",
  checkoutConsent: false,
  purchasedTopUp: false,
  importedPolicy: false,
  renewedMotor: false,
  renewalAutopay: true,
  incidentType: "Minor collision",
  incidentLocation: "100 Feet Road, Indiranagar, Bengaluru",
  uploadedEvidence: 0,
  claimStatus: "none",
  requestedService: "",
  personalization: true,
  notifications: true,
  chat: initialChat,
};

const mainTabs: { id: MainTab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Search },
  { id: "vault", label: "Policies", icon: WalletCards },
  { id: "claims", label: "Claims", icon: FileCheck2 },
];

const categoryOptions: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: "motor", label: "Motor", icon: Car },
  { id: "health", label: "Health", icon: HeartPulse },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "home", label: "Home", icon: House },
];

function readStoredState(): AppState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState;
    const parsed = JSON.parse(stored) as Partial<AppState>;
    return {
      ...initialState,
      ...parsed,
      chat: Array.isArray(parsed.chat) ? parsed.chat : initialChat,
      selectedPlans: Array.isArray(parsed.selectedPlans)
        ? parsed.selectedPlans
        : initialState.selectedPlans,
    };
  } catch {
    return initialState;
  }
}

function currency(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function App() {
  const [state, setState] = useState<AppState>(readStoredState);
  const [toast, setToast] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const update = (patch: Partial<AppState>) => {
    setState((current) => ({ ...current, ...patch }));
  };

  const navigate = (screen: Screen) => {
    const mainTab = mainTabs.some((tab) => tab.id === screen) ? (screen as MainTab) : state.lastMainTab;
    update({ screen, lastMainTab: mainTab });
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    setToast("Demo reset to the starting state");
  };

  const activePlan = plans.find((plan) => plan.id === state.activePlanId) ?? plans[1];

  return (
    <main className="app-shell">
      <DesktopNavigation state={state} navigate={navigate} reset={reset} />

      <section className="app-canvas">
        <TopBar state={state} navigate={navigate} reset={reset} />

        <div className="screen-wrap">
          <ScreenRouter
            state={state}
            update={update}
            navigate={navigate}
            activePlan={activePlan}
            setToast={setToast}
          />
        </div>

        <MobileNavigation state={state} navigate={navigate} />
      </section>

      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
        </div>
      )}
    </main>
  );
}

function DesktopNavigation({
  state,
  navigate,
  reset,
}: {
  state: AppState;
  navigate: (screen: Screen) => void;
  reset: () => void;
}) {
  return (
    <aside className="desktop-nav">
      <Brand />
      <nav aria-label="Primary navigation">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              className={state.lastMainTab === tab.id ? "nav-item active" : "nav-item"}
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="nav-spacer" />

      <button className="nav-item" type="button" onClick={() => navigate("assistant")}>
        <Bot size={20} />
        <span>Ask Protect AI</span>
      </button>
      <button className="profile-row" type="button" onClick={() => navigate("profile")}>
        <span className="avatar">AR</span>
        <span>
          <strong>Ananya Rao</strong>
          <small>INDIE customer</small>
        </span>
        <ChevronRight size={18} />
      </button>
      <button className="reset-link" type="button" onClick={reset}>
        <RotateCcw size={16} />
        Reset demo
      </button>
    </aside>
  );
}

function TopBar({
  state,
  navigate,
  reset,
}: {
  state: AppState;
  navigate: (screen: Screen) => void;
  reset: () => void;
}) {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <Brand compact />
      </div>
      <div className="topbar-copy">
        <p>Good afternoon, Ananya</p>
        <strong>{screenTitle(state.screen)}</strong>
      </div>
      <div className="topbar-actions">
        <button className="icon-button mobile-reset" type="button" onClick={reset} aria-label="Reset demo">
          <RefreshCw size={19} />
        </button>
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>
        <button className="avatar-button" type="button" onClick={() => navigate("profile")} aria-label="Open profile">
          AR
        </button>
      </div>
    </header>
  );
}

function MobileNavigation({
  state,
  navigate,
}: {
  state: AppState;
  navigate: (screen: Screen) => void;
}) {
  return (
    <nav className="mobile-nav" aria-label="Primary navigation">
      {mainTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            className={state.lastMainTab === tab.id ? "active" : ""}
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.id)}
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "brand compact" : "brand"} aria-label="INDIE Protect">
      <span className="brand-mark">
        <ShieldCheck size={compact ? 19 : 23} />
      </span>
      <span>
        <strong>INDIE</strong>
        <small>Protect</small>
      </span>
    </div>
  );
}

function ScreenRouter({
  state,
  update,
  navigate,
  activePlan,
  setToast,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
  activePlan: Plan;
  setToast: (message: string) => void;
}) {
  switch (state.screen) {
    case "home":
      return <HomeScreen state={state} update={update} navigate={navigate} />;
    case "explore":
      return <ExploreScreen state={state} update={update} navigate={navigate} />;
    case "compare":
      return <CompareScreen state={state} update={update} navigate={navigate} />;
    case "plan":
      return <PlanScreen plan={activePlan} navigate={navigate} />;
    case "checkout":
      return (
        <CheckoutScreen
          state={state}
          update={update}
          plan={activePlan}
          navigate={navigate}
          setToast={setToast}
        />
      );
    case "vault":
      return <VaultScreen state={state} update={update} navigate={navigate} setToast={setToast} />;
    case "policy":
      return <PolicyScreen state={state} navigate={navigate} setToast={setToast} />;
    case "claims":
      return <ClaimsScreen state={state} navigate={navigate} />;
    case "claim-start":
      return <ClaimStartScreen state={state} update={update} navigate={navigate} />;
    case "claim-evidence":
      return <ClaimEvidenceScreen state={state} update={update} navigate={navigate} />;
    case "claim-submitted":
      return <ClaimSubmittedScreen navigate={navigate} />;
    case "claim-track":
      return <ClaimTrackScreen state={state} update={update} navigate={navigate} setToast={setToast} />;
    case "renewal":
      return (
        <RenewalScreen
          state={state}
          update={update}
          navigate={navigate}
          setToast={setToast}
        />
      );
    case "assistant":
      return <AssistantScreen state={state} update={update} navigate={navigate} />;
    case "services":
      return <ServicesScreen state={state} update={update} navigate={navigate} setToast={setToast} />;
    case "profile":
      return <ProfileScreen state={state} update={update} navigate={navigate} />;
    default:
      return <HomeScreen state={state} update={update} navigate={navigate} />;
  }
}

function HomeScreen({
  state,
  update,
  navigate,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
}) {
  const protectionScore = state.purchasedTopUp ? 78 : state.renewedMotor ? 70 : 64;
  const policyCount = 2 + Number(state.purchasedTopUp) + Number(state.importedPolicy);

  return (
    <div className="screen home-screen">
      <section className="protection-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light">Your protection today</p>
          <h1>Everything covered. One place to act.</h1>
          <p>See gaps, manage policies, and get help before a small problem becomes expensive.</p>
          <button className="light-button" type="button" onClick={() => navigate("explore")}>
            Improve my cover
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="score-panel">
          <span>Protection score</span>
          <strong>{protectionScore}</strong>
          <small>out of 100</small>
          <div className="score-track" aria-hidden="true">
            <span style={{ width: `${protectionScore}%` }} />
          </div>
        </div>
      </section>

      {!state.renewedMotor && (
        <section className="renewal-strip">
          <span className="strip-icon">
            <CalendarClock size={22} />
          </span>
          <div>
            <strong>Car policy renews in 10 days</strong>
            <span>Keep your no-claim bonus and avoid a coverage break.</span>
          </div>
          <button type="button" onClick={() => navigate("renewal")}>
            Review renewal
            <ChevronRight size={18} />
          </button>
        </section>
      )}

      {state.renewedMotor && (
        <section className="success-strip">
          <CheckCircle2 size={22} />
          <div>
            <strong>Motor policy renewed</strong>
            <span>Your cover is continuous through 2 August 2027.</span>
          </div>
        </section>
      )}

      <section className="content-section">
        <SectionHeading eyebrow="Act quickly" title="What do you need?" />
        <div className="quick-actions">
          <QuickAction
            icon={FilePlus2}
            label="Start a claim"
            detail="Guided in 3 steps"
            tone="red"
            onClick={() => navigate(state.claimStatus === "none" ? "claim-start" : "claim-track")}
          />
          <QuickAction
            icon={Sparkles}
            label="Find cover"
            detail="Matched to your life"
            tone="gold"
            onClick={() => navigate("explore")}
          />
          <QuickAction
            icon={Bot}
            label="Ask Protect AI"
            detail="Plain-language help"
            tone="blue"
            onClick={() => navigate("assistant")}
          />
          <QuickAction
            icon={LifeBuoy}
            label="Get assistance"
            detail="Road, health, home"
            tone="green"
            onClick={() => navigate("services")}
          />
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow={`${policyCount} policies in one vault`}
          title="Your protection"
          action="View all"
          onAction={() => navigate("vault")}
        />
        <div className="policy-summary-list">
          <button className="policy-summary" type="button" onClick={() => navigate("policy")}>
            <span className="policy-icon burgundy">
              <Car size={22} />
            </span>
            <span>
              <strong>Private Car Package</strong>
              <small>Honda City - KA 03 MW 4821</small>
            </span>
            <span className="policy-meta">
              <strong>{state.renewedMotor ? "2 Aug 2027" : "2 Aug 2026"}</strong>
              <small>{state.renewedMotor ? "Renewed" : "Renew in 10 days"}</small>
            </span>
            <ChevronRight size={18} />
          </button>
          <button className="policy-summary" type="button" onClick={() => navigate("vault")}>
            <span className="policy-icon green">
              <HeartPulse size={22} />
            </span>
            <span>
              <strong>Family Health Infinity</strong>
              <small>Ananya + 2 family members</small>
            </span>
            <span className="policy-meta">
              <strong>Rs. 5 lakh</strong>
              <small>Base cover</small>
            </span>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {!state.purchasedTopUp && (
        <section className="recommendation-band">
          <div className="recommendation-copy">
            <span className="section-icon">
              <Activity size={22} />
            </span>
            <div>
              <p className="eyebrow">Personalised insight</p>
              <h2>Your health buffer may be too small</h2>
              <p>
                Your Rs. 5 lakh family cover could leave a gap for a major hospitalisation. A top-up can add
                Rs. 20 lakh from Rs. 390/month.
              </p>
            </div>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={() => update({ activePlanId: "health-topup", screen: "plan", lastMainTab: "explore" })}
          >
            View recommendation
            <ArrowRight size={18} />
          </button>
        </section>
      )}
    </div>
  );
}

function ExploreScreen({
  state,
  update,
  navigate,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
}) {
  const visiblePlans = plans.filter((plan) => plan.category === state.category);

  const openPlan = (id: string) => {
    update({ activePlanId: id, screen: "plan" });
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const toggleCompare = (id: string) => {
    const selected = state.selectedPlans.includes(id)
      ? state.selectedPlans.filter((planId) => planId !== id)
      : [...state.selectedPlans, id].slice(-3);
    update({ selectedPlans: selected });
  };

  return (
    <div className="screen">
      <PageIntro
        title="Find protection that fits your life"
        body="Clear recommendations using information you choose to share. No jargon, no pressure."
      />

      <div className="category-tabs" role="tablist" aria-label="Insurance categories">
        {categoryOptions.map((category) => {
          const Icon = category.icon;
          return (
            <button
              className={state.category === category.id ? "active" : ""}
              key={category.id}
              type="button"
              onClick={() => update({ category: category.id })}
            >
              <Icon size={20} />
              {category.label}
            </button>
          );
        })}
      </div>

      {state.category === "motor" && (
        <section className="insight-strip">
          <Car size={22} />
          <div>
            <strong>Matched to your 2021 Honda City</strong>
            <span>Recommended IDV: Rs. 7.2-7.8 lakh - Bengaluru - 8,400 km/year</span>
          </div>
        </section>
      )}

      {state.category === "health" && (
        <section className="insight-strip green">
          <HeartPulse size={22} />
          <div>
            <strong>Built around your existing family cover</strong>
            <span>A top-up protects savings after your current Rs. 5 lakh base policy is used.</span>
          </div>
        </section>
      )}

      <div className="list-heading">
        <div>
          <p className="eyebrow">Recommended for Ananya</p>
          <h2>{visiblePlans.length} plans worth considering</h2>
        </div>
        {state.category === "motor" && (
          <span className="fit-note">
            <Sparkles size={16} />
            Ranked by fit, not commission
          </span>
        )}
      </div>

      <div className="plan-list">
        {visiblePlans.map((plan, index) => (
          <article className="plan-row" key={plan.id}>
            <div className="plan-rank">{index + 1}</div>
            <div className="plan-main">
              <div className="plan-title-row">
                <div>
                  <span className="match-badge">{plan.score}% match</span>
                  <h3>{plan.name}</h3>
                  <p>{plan.insurer}</p>
                </div>
                <div className="plan-price">
                  <strong>{currency(plan.premium)}</strong>
                  <span>per year</span>
                </div>
              </div>
              <div className="plan-facts">
                <span>
                  <Shield size={17} />
                  {plan.cover}
                </span>
                <span>
                  <Building2 size={17} />
                  {plan.network}
                </span>
                <span>
                  <BadgeCheck size={17} />
                  {plan.bestFor}
                </span>
              </div>
            </div>
            <div className="plan-actions">
              {state.category === "motor" && (
                <label className="compare-check">
                  <input
                    type="checkbox"
                    checked={state.selectedPlans.includes(plan.id)}
                    onChange={() => toggleCompare(plan.id)}
                  />
                  Compare
                </label>
              )}
              <button className="secondary-button" type="button" onClick={() => openPlan(plan.id)}>
                View plan
                <ChevronRight size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {state.category === "motor" && state.selectedPlans.length >= 2 && (
        <div className="sticky-action">
          <span>{state.selectedPlans.length} plans selected</span>
          <button className="primary-button" type="button" onClick={() => navigate("compare")}>
            Compare plans
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function CompareScreen({
  state,
  update,
  navigate,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
}) {
  const comparedPlans = plans.filter((plan) => state.selectedPlans.includes(plan.id));

  return (
    <div className="screen">
      <BackHeader label="Explore plans" onBack={() => navigate("explore")} />
      <PageIntro
        title="Compare without the fine-print fog"
        body="The differences that affect your claim payout and out-of-pocket cost, side by side."
      />

      <div className="compare-scroll" role="region" aria-label="Plan comparison" tabIndex={0}>
        <div className="compare-grid" style={{ gridTemplateColumns: `150px repeat(${comparedPlans.length}, minmax(210px, 1fr))` }}>
          <div className="compare-label header">Plan</div>
          {comparedPlans.map((plan) => (
            <div className="compare-plan-head" key={`head-${plan.id}`}>
              {plan.id === "drive-total" && <span className="recommended-tag">Best fit</span>}
              <h3>{plan.name}</h3>
              <strong>{currency(plan.premium)}</strong>
              <small>per year</small>
            </div>
          ))}

          <CompareLabel label="Fit score" />
          {comparedPlans.map((plan) => (
            <CompareValue key={`score-${plan.id}`} value={`${plan.score}%`} strong />
          ))}

          <CompareLabel label="Insured value" />
          {comparedPlans.map((plan) => (
            <CompareValue key={`cover-${plan.id}`} value={plan.cover} />
          ))}

          <CompareLabel label="Zero depreciation" />
          {comparedPlans.map((plan) => (
            <CompareBoolean key={`zero-${plan.id}`} value={plan.zeroDep} />
          ))}

          <CompareLabel label="Roadside assistance" />
          {comparedPlans.map((plan) => (
            <CompareBoolean key={`road-${plan.id}`} value={plan.roadside} />
          ))}

          <CompareLabel label="Cashless repair" />
          {comparedPlans.map((plan) => (
            <CompareBoolean key={`cash-${plan.id}`} value={plan.cashless} />
          ))}

          <div className="compare-label footer">Choose</div>
          {comparedPlans.map((plan) => (
            <div className="compare-cell footer" key={`action-${plan.id}`}>
              <button
                className={plan.id === "drive-total" ? "primary-button compact-button" : "secondary-button compact-button"}
                type="button"
                onClick={() => {
                  update({ activePlanId: plan.id });
                  navigate("plan");
                }}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>

      <section className="plain-language-note">
        <Info size={21} />
        <div>
          <strong>Why Drive Total ranks highest</strong>
          <p>
            Your car is under five years old, so zero depreciation can materially reduce what you pay during a
            parts-heavy claim. The higher premium is Rs. 179/month more than Drive Smart.
          </p>
        </div>
      </section>
    </div>
  );
}

function PlanScreen({ plan, navigate }: { plan: Plan; navigate: (screen: Screen) => void }) {
  return (
    <div className="screen">
      <BackHeader label="Back to plans" onBack={() => navigate("explore")} />
      <section className="plan-hero">
        <div>
          <span className="match-badge">{plan.score}% profile match</span>
          <p className="eyebrow">{plan.insurer}</p>
          <h1>{plan.name}</h1>
          <p>{plan.bestFor}</p>
        </div>
        <div className="plan-price-large">
          <span>Annual premium</span>
          <strong>{currency(plan.premium)}</strong>
          <small>{currency(Math.round(plan.premium / 12))}/month equivalent</small>
        </div>
      </section>

      <section className="plan-detail-grid">
        <div className="detail-column">
          <SectionHeading eyebrow="What you get" title="Coverage in plain language" />
          <div className="coverage-list">
            {plan.highlights.map((highlight) => (
              <div key={highlight}>
                <span className="check-icon">
                  <Check size={17} />
                </span>
                <span>
                  <strong>{highlight}</strong>
                  <small>Included in the quoted premium</small>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-column">
          <SectionHeading eyebrow="Know before buying" title="Important exclusions" />
          <div className="coverage-list exclusions">
            {plan.exclusions.map((exclusion) => (
              <div key={exclusion}>
                <span className="x-icon">
                  <X size={16} />
                </span>
                <span>
                  <strong>{exclusion}</strong>
                  <small>Not covered unless policy wording says otherwise</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-row">
        <span>
          <LockKeyhole size={20} />
          Secure bank-linked purchase
        </span>
        <span>
          <FileCheck2 size={20} />
          Policy issued digitally
        </span>
        <span>
          <MessageCircleMore size={20} />
          Claims concierge included
        </span>
      </section>

      <div className="sticky-action">
        <span>
          <strong>{currency(plan.premium)}</strong> per year
        </span>
        <button className="primary-button" type="button" onClick={() => navigate("checkout")}>
          Continue securely
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function CheckoutScreen({
  state,
  update,
  plan,
  navigate,
  setToast,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  plan: Plan;
  navigate: (screen: Screen) => void;
  setToast: (message: string) => void;
}) {
  const completePurchase = () => {
    if (!state.checkoutConsent) return;
    update({ purchasedTopUp: plan.id === "health-topup" || state.purchasedTopUp, screen: "vault", lastMainTab: "vault" });
    setToast(`${plan.name} added to your policy vault`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="screen narrow-screen">
      <BackHeader label="Plan details" onBack={() => navigate("plan")} />
      <PageIntro title="Review and confirm" body="This is a prototype. No payment will be collected." />

      <section className="checkout-section">
        <div className="checkout-line">
          <span>
            <strong>{plan.name}</strong>
            <small>{plan.cover} - 1 year</small>
          </span>
          <strong>{currency(plan.premium)}</strong>
        </div>
        <div className="checkout-line">
          <span>
            <strong>Taxes and fees</strong>
            <small>Included in this prototype quote</small>
          </span>
          <strong>Rs. 0</strong>
        </div>
        <div className="checkout-total">
          <span>Amount payable</span>
          <strong>{currency(plan.premium)}</strong>
        </div>
      </section>

      <section className="checkout-section">
        <SectionHeading eyebrow="Payment source" title="INDIE savings account" />
        <label className="payment-option">
          <input type="radio" checked readOnly />
          <span className="bank-icon">
            <Building2 size={21} />
          </span>
          <span>
            <strong>IndusInd Bank - 8842</strong>
            <small>Available balance: Rs. 84,250</small>
          </span>
          <BadgeCheck size={20} />
        </label>
      </section>

      <label className="consent-row">
        <input
          type="checkbox"
          checked={state.checkoutConsent}
          onChange={(event) => update({ checkoutConsent: event.target.checked })}
        />
        <span>
          I reviewed the key coverage, waiting periods, and exclusions. I consent to a simulated policy
          purchase for this prototype.
        </span>
      </label>

      <button
        className="primary-button full-button"
        type="button"
        disabled={!state.checkoutConsent}
        onClick={completePurchase}
      >
        <LockKeyhole size={18} />
        Confirm simulated purchase
      </button>
    </div>
  );
}

function VaultScreen({
  state,
  update,
  navigate,
  setToast,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
  setToast: (message: string) => void;
}) {
  const importPolicy = () => {
    update({ importedPolicy: true });
    setToast("External travel policy imported");
  };

  return (
    <div className="screen">
      <PageIntro
        title="Every policy, one clear view"
        body="IndusInd and external policies can live together, with one place for documents, renewals, and claims."
      />

      <div className="vault-toolbar">
        <div>
          <strong>{2 + Number(state.purchasedTopUp) + Number(state.importedPolicy)} active policies</strong>
          <span>Estimated total cover: Rs. {state.purchasedTopUp ? "32.5" : "12.5"} lakh</span>
        </div>
        <button className="secondary-button" type="button" onClick={importPolicy} disabled={state.importedPolicy}>
          <Upload size={18} />
          {state.importedPolicy ? "Policy imported" : "Import external policy"}
        </button>
      </div>

      <div className="vault-list">
        <PolicyRow
          icon={Car}
          tone="burgundy"
          title="Private Car Package"
          subtitle="Honda City - KA 03 MW 4821"
          status={state.renewedMotor ? "Renewed" : "Renews in 10 days"}
          value="Rs. 7.5 lakh IDV"
          onClick={() => navigate("policy")}
        />
        <PolicyRow
          icon={HeartPulse}
          tone="green"
          title="Family Health Infinity"
          subtitle="Ananya + 2 family members"
          status="Active"
          value="Rs. 5 lakh cover"
          onClick={() => navigate("policy")}
        />
        {state.purchasedTopUp && (
          <PolicyRow
            icon={ShieldCheck}
            tone="gold"
            title="Health Shield Top-up"
            subtitle="Linked to Family Health Infinity"
            status="Just added"
            value="Rs. 20 lakh cover"
            onClick={() => navigate("policy")}
          />
        )}
        {state.importedPolicy && (
          <PolicyRow
            icon={Plane}
            tone="blue"
            title="International Travel Protect"
            subtitle="Imported from another insurer"
            status="External"
            value="USD 100,000 cover"
            onClick={() => navigate("policy")}
          />
        )}
      </div>

      <section className="plain-language-note">
        <ShieldCheck size={21} />
        <div>
          <strong>Your documents stay under your control</strong>
          <p>
            Imported policy data is used only to show coverage gaps, renewal reminders, and the right claim
            path. You can remove access from Profile.
          </p>
        </div>
      </section>
    </div>
  );
}

function PolicyScreen({
  state,
  navigate,
  setToast,
}: {
  state: AppState;
  navigate: (screen: Screen) => void;
  setToast: (message: string) => void;
}) {
  return (
    <div className="screen">
      <BackHeader label="Policy vault" onBack={() => navigate("vault")} />
      <section className="policy-hero">
        <span className="policy-icon burgundy large">
          <Car size={28} />
        </span>
        <div>
          <p className="eyebrow">Active motor policy</p>
          <h1>Private Car Package</h1>
          <p>Policy IGI/MOT/2025/483920 - Honda City</p>
        </div>
        <span className="active-badge">
          <Check size={15} />
          Active
        </span>
      </section>

      <div className="policy-detail-layout">
        <section className="policy-facts">
          <SectionHeading eyebrow="At a glance" title="What this policy protects" />
          <div className="fact-grid">
            <Fact label="Insured value" value="Rs. 7.5 lakh" />
            <Fact label="Valid until" value={state.renewedMotor ? "2 Aug 2027" : "2 Aug 2026"} />
            <Fact label="No-claim bonus" value="35%" />
            <Fact label="Deductible" value="Rs. 1,000" />
          </div>
          <div className="coverage-list compact">
            {["Accident damage", "Theft and fire", "Third-party liability", "Roadside assistance"].map(
              (item) => (
                <div key={item}>
                  <span className="check-icon">
                    <Check size={16} />
                  </span>
                  <strong>{item}</strong>
                </div>
              ),
            )}
          </div>
        </section>

        <aside className="policy-actions">
          <button className="primary-button" type="button" onClick={() => navigate("claim-start")}>
            <FilePlus2 size={18} />
            Start a claim
          </button>
          {!state.renewedMotor && (
            <button className="secondary-button" type="button" onClick={() => navigate("renewal")}>
              <RefreshCw size={18} />
              Review renewal
            </button>
          )}
          <button className="secondary-button" type="button" onClick={() => setToast("Policy PDF prepared for download")}>
            <Download size={18} />
            Download policy
          </button>
          <button className="secondary-button" type="button" onClick={() => navigate("assistant")}>
            <CircleHelp size={18} />
            Explain my cover
          </button>
        </aside>
      </div>

      <section className="explain-band">
        <Bot size={23} />
        <div>
          <p className="eyebrow">Protect AI summary</p>
          <h2>Your likely out-of-pocket cost</h2>
          <p>
            For an eligible accidental repair, you pay the Rs. 1,000 deductible plus depreciation on replaced
            parts. Adding zero depreciation at renewal can reduce that second part.
          </p>
        </div>
        <button type="button" onClick={() => navigate("assistant")}>
          Ask a follow-up
          <ChevronRight size={18} />
        </button>
      </section>
    </div>
  );
}

function ClaimsScreen({ state, navigate }: { state: AppState; navigate: (screen: Screen) => void }) {
  return (
    <div className="screen">
      <PageIntro
        title="Claims without the guesswork"
        body="Know what to do, upload only what is needed, and see who owns the next step."
      />

      {state.claimStatus === "none" ? (
        <>
          <section className="claim-start-band">
            <div>
              <span className="section-icon">
                <FilePlus2 size={23} />
              </span>
              <p className="eyebrow">New claim</p>
              <h2>Something happened?</h2>
              <p>We will guide you through safety, evidence, and submission in about three minutes.</p>
            </div>
            <button className="primary-button" type="button" onClick={() => navigate("claim-start")}>
              Start guided claim
              <ArrowRight size={18} />
            </button>
          </section>

          <section className="content-section">
            <SectionHeading eyebrow="Before you begin" title="What you may need" />
            <div className="requirement-row">
              <span>
                <Camera size={21} />
                Photos of damage
              </span>
              <span>
                <MapPin size={21} />
                Incident location
              </span>
              <span>
                <FileCheck2 size={21} />
                Driver and vehicle details
              </span>
            </div>
          </section>
        </>
      ) : (
        <section className="active-claim-card">
          <div className="active-claim-top">
            <span className="policy-icon burgundy">
              <Car size={22} />
            </span>
            <div>
              <p className="eyebrow">Claim IGI-MT-48291</p>
              <h2>Honda City accident claim</h2>
              <p>Submitted 23 July 2026</p>
            </div>
            <span className="status-badge">{claimStatusLabel(state.claimStatus)}</span>
          </div>
          <ClaimTimeline status={state.claimStatus} />
          <button className="primary-button fit-button" type="button" onClick={() => navigate("claim-track")}>
            Track claim
            <ArrowRight size={18} />
          </button>
        </section>
      )}

      <section className="help-strip">
        <PhoneCall size={22} />
        <div>
          <strong>Emergency or unsafe location?</strong>
          <span>Call emergency support first. You can file the claim after you are safe.</span>
        </div>
        <button type="button" onClick={() => navigate("services")}>Get help</button>
      </section>
    </div>
  );
}

function ClaimStartScreen({
  state,
  update,
  navigate,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
}) {
  const incidentTypes = ["Minor collision", "Major accident", "Theft", "Flood or fire"];

  return (
    <div className="screen narrow-screen">
      <BackHeader label="Claims" onBack={() => navigate("claims")} />
      <FlowStepper current={1} labels={["Incident", "Evidence", "Submit"]} />
      <PageIntro title="Tell us what happened" body="Choose the closest option. You can add detail later." />

      <div className="option-grid">
        {incidentTypes.map((incident) => (
          <button
            className={state.incidentType === incident ? "option-button active" : "option-button"}
            key={incident}
            type="button"
            onClick={() => update({ incidentType: incident })}
          >
            <span>{incident === "Theft" ? <LockKeyhole size={21} /> : <Car size={21} />}</span>
            {incident}
            {state.incidentType === incident && <CheckCircle2 size={19} />}
          </button>
        ))}
      </div>

      <label className="field">
        <span>Incident location</span>
        <div className="field-control">
          <MapPin size={18} />
          <input
            value={state.incidentLocation}
            onChange={(event) => update({ incidentLocation: event.target.value })}
          />
        </div>
      </label>

      <section className="safety-note">
        <AlertCircle size={21} />
        <div>
          <strong>Safety first</strong>
          <p>Move to a safe place if possible. For injuries or danger, contact emergency services immediately.</p>
        </div>
      </section>

      <button
        className="primary-button full-button"
        type="button"
        onClick={() => navigate("claim-evidence")}
        disabled={!state.incidentLocation.trim()}
      >
        Continue to evidence
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

function ClaimEvidenceScreen({
  state,
  update,
  navigate,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
}) {
  const submitClaim = () => {
    update({ claimStatus: "submitted", screen: "claim-submitted", lastMainTab: "claims" });
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="screen narrow-screen">
      <BackHeader label="Incident details" onBack={() => navigate("claim-start")} />
      <FlowStepper current={2} labels={["Incident", "Evidence", "Submit"]} />
      <PageIntro
        title="Add the evidence you have"
        body="For this prototype, the upload is simulated. Two sample photos are enough to continue."
      />

      <button
        className={state.uploadedEvidence > 0 ? "upload-zone uploaded" : "upload-zone"}
        type="button"
        onClick={() => update({ uploadedEvidence: state.uploadedEvidence > 0 ? 0 : 2 })}
      >
        {state.uploadedEvidence > 0 ? <CheckCircle2 size={31} /> : <Camera size={31} />}
        <strong>{state.uploadedEvidence > 0 ? "2 damage photos added" : "Add photos or video"}</strong>
        <span>{state.uploadedEvidence > 0 ? "Tap to remove sample evidence" : "Tap to simulate an upload"}</span>
      </button>

      <section className="evidence-summary">
        <SectionHeading eyebrow="Claim summary" title="Review before submission" />
        <InfoRow label="Policy" value="Private Car Package" />
        <InfoRow label="Incident" value={state.incidentType} />
        <InfoRow label="Location" value={state.incidentLocation} />
        <InfoRow label="Evidence" value={`${state.uploadedEvidence} files`} />
      </section>

      <label className="consent-row">
        <input type="checkbox" checked readOnly />
        <span>I confirm the information is true to the best of my knowledge.</span>
      </label>

      <button
        className="primary-button full-button"
        type="button"
        onClick={submitClaim}
        disabled={state.uploadedEvidence === 0}
      >
        Submit simulated claim
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

function ClaimSubmittedScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <div className="screen narrow-screen">
      <div className="success-state">
        <span className="success-icon">
          <Check size={34} />
        </span>
        <p className="eyebrow">Claim submitted</p>
        <h1>You are done for now</h1>
        <p>
          Claim <strong>IGI-MT-48291</strong> is registered. A surveyor update is expected within two working
          hours.
        </p>
        <div className="next-owner">
          <Clock3 size={21} />
          <span>
            <strong>Next owner: IndusInd claims team</strong>
            <small>We will notify you when a surveyor is assigned.</small>
          </span>
        </div>
        <button className="primary-button full-button" type="button" onClick={() => navigate("claim-track")}>
          Track claim
          <ArrowRight size={18} />
        </button>
        <button className="text-button" type="button" onClick={() => navigate("home")}>
          Return home
        </button>
      </div>
    </div>
  );
}

function ClaimTrackScreen({
  state,
  update,
  navigate,
  setToast,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
  setToast: (message: string) => void;
}) {
  const nextStatus: Record<Exclude<ClaimStatus, "none" | "approved">, ClaimStatus> = {
    submitted: "surveyor",
    surveyor: "assessment",
    assessment: "approved",
  };

  const advance = () => {
    if (state.claimStatus === "none" || state.claimStatus === "approved") return;
    const next = nextStatus[state.claimStatus];
    update({ claimStatus: next });
    setToast(`Claim moved to: ${claimStatusLabel(next)}`);
  };

  return (
    <div className="screen">
      <BackHeader label="Claims" onBack={() => navigate("claims")} />
      <section className="claim-track-head">
        <div>
          <p className="eyebrow">Claim IGI-MT-48291</p>
          <h1>Honda City accident claim</h1>
          <p>Minor collision - Indiranagar, Bengaluru</p>
        </div>
        <span className="status-badge large">{claimStatusLabel(state.claimStatus)}</span>
      </section>

      <div className="claim-track-layout">
        <section className="timeline-panel">
          <SectionHeading eyebrow="Live status" title="What is happening now" />
          <ClaimTimeline status={state.claimStatus} detailed />
        </section>

        <aside className="owner-panel">
          <span className="section-icon">
            <User size={22} />
          </span>
          <p className="eyebrow">Current owner</p>
          <h2>
            {state.claimStatus === "submitted"
              ? "Claims intake team"
              : state.claimStatus === "surveyor"
                ? "S. Prakash, surveyor"
                : state.claimStatus === "assessment"
                  ? "Claims assessment team"
                  : "Settlement team"}
          </h2>
          <p>
            {state.claimStatus === "approved"
              ? "Your repair approval is ready. The garage can begin authorised work."
              : "No action is needed from you right now. We will ask only if another document is required."}
          </p>
          <button className="secondary-button" type="button" onClick={() => navigate("assistant")}>
            <MessageCircleMore size={18} />
            Ask about this claim
          </button>
        </aside>
      </div>

      {state.claimStatus !== "approved" && (
        <section className="demo-control">
          <div>
            <strong>Prototype control</strong>
            <span>Advance the claim to demonstrate the complete tracking journey.</span>
          </div>
          <button className="primary-button" type="button" onClick={advance}>
            Simulate next update
            <ArrowRight size={18} />
          </button>
        </section>
      )}
    </div>
  );
}

function RenewalScreen({
  state,
  update,
  navigate,
  setToast,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
  setToast: (message: string) => void;
}) {
  const renew = () => {
    update({ renewedMotor: true, screen: "home", lastMainTab: "home" });
    setToast("Motor policy renewed through 2 August 2027");
  };

  if (state.renewedMotor) {
    return (
      <div className="screen narrow-screen">
        <div className="success-state">
          <span className="success-icon">
            <Check size={34} />
          </span>
          <p className="eyebrow">Renewal complete</p>
          <h1>Your cover continues without a break</h1>
          <p>Private Car Package is active until 2 August 2027. The updated document is in your policy vault.</p>
          <button className="primary-button full-button" type="button" onClick={() => navigate("policy")}>
            View renewed policy
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen narrow-screen">
      <BackHeader label="Home" onBack={() => navigate("home")} />
      <PageIntro
        title="Renew with your benefits intact"
        body="Your current cover ends on 2 August 2026. The quote keeps your 35% no-claim bonus."
      />

      <section className="renewal-quote">
        <div className="renewal-price">
          <span>Renewal premium</span>
          <strong>Rs. 8,240</strong>
          <small>Rs. 687/month equivalent</small>
        </div>
        <div className="renewal-delta">
          <span>Last year</span>
          <strong>Rs. 8,490</strong>
          <small>Rs. 250 lower this year</small>
        </div>
      </section>

      <section className="checkout-section">
        <SectionHeading eyebrow="Included" title="Your renewal keeps" />
        <div className="coverage-list compact">
          {["Rs. 7.5 lakh IDV", "35% no-claim bonus", "Roadside assistance", "Cashless repairs"].map(
            (item) => (
              <div key={item}>
                <span className="check-icon">
                  <Check size={16} />
                </span>
                <strong>{item}</strong>
              </div>
            ),
          )}
        </div>
      </section>

      <label className="toggle-row">
        <span>
          <strong>Auto-renew next year</strong>
          <small>We will notify you before any debit.</small>
        </span>
        <input
          type="checkbox"
          checked={state.renewalAutopay}
          onChange={(event) => update({ renewalAutopay: event.target.checked })}
        />
      </label>

      <button className="primary-button full-button" type="button" onClick={renew}>
        <LockKeyhole size={18} />
        Confirm simulated renewal
      </button>
    </div>
  );
}

function AssistantScreen({
  state,
  update,
  navigate,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
}) {
  const suggestions: Record<string, string> = {
    "What does zero depreciation mean?":
      "Without zero depreciation, the insurer reduces the payout for replaced parts based on age. With it, eligible plastic, fibre, and metal parts are paid closer to their replacement cost, so you usually pay less during a claim.",
    "Is roadside assistance covered?":
      "Yes. Your motor policy includes 24x7 towing, battery jump-start, flat-tyre help, and fuel delivery within the service limits shown in your policy.",
    "What documents do I need for a claim?":
      "Start with damage photos, the incident location, your driving licence, and vehicle registration. The guided claim flow asks for more only when your incident requires it.",
  };

  const ask = (question: string) => {
    update({
      chat: [
        ...state.chat,
        { role: "user", text: question },
        { role: "assistant", text: suggestions[question] },
      ],
    });
  };

  return (
    <div className="screen assistant-screen">
      <BackHeader label={screenTitle(state.lastMainTab)} onBack={() => navigate(state.lastMainTab)} />
      <div className="assistant-head">
        <span className="assistant-mark">
          <Bot size={27} />
        </span>
        <div>
          <p className="eyebrow">Protect AI</p>
          <h1>Insurance, translated</h1>
          <p>Answers use your policy context. Important decisions still link back to the policy wording.</p>
        </div>
      </div>

      <div className="chat-window" aria-live="polite">
        {state.chat.map((message, index) => (
          <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            {message.role === "assistant" && (
              <span>
                <Bot size={17} />
              </span>
            )}
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="suggestion-chips">
        {Object.keys(suggestions).map((suggestion) => (
          <button type="button" key={suggestion} onClick={() => ask(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <input placeholder="Ask about cover, claims, or renewals..." aria-label="Ask Protect AI" />
        <button type="button" onClick={() => ask("What documents do I need for a claim?")} aria-label="Send question">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function ServicesScreen({
  state,
  update,
  navigate,
  setToast,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
  setToast: (message: string) => void;
}) {
  const services = [
    {
      id: "roadside",
      icon: Car,
      title: "Roadside assistance",
      detail: "Towing, battery, tyre, lockout, or fuel help",
      eta: "Average response: 35 min",
    },
    {
      id: "telemedicine",
      icon: Stethoscope,
      title: "Telemedicine",
      detail: "Speak to a general physician by video",
      eta: "Next slot: 4:20 PM",
    },
    {
      id: "home",
      icon: House,
      title: "Emergency home help",
      detail: "Electrician, plumber, locksmith, or appliance support",
      eta: "Available in Bengaluru",
    },
  ];

  const request = (id: string, title: string) => {
    update({ requestedService: id });
    setToast(`${title} request created`);
  };

  return (
    <div className="screen">
      <BackHeader label="Home" onBack={() => navigate("home")} />
      <PageIntro
        title="Help before it becomes a claim"
        body="Protection includes useful services for the moments around an incident, not only reimbursement after it."
      />

      <div className="service-list">
        {services.map((service) => {
          const Icon = service.icon;
          const requested = state.requestedService === service.id;
          return (
            <article className="service-row" key={service.id}>
              <span className="service-icon">
                <Icon size={24} />
              </span>
              <div>
                <h2>{service.title}</h2>
                <p>{service.detail}</p>
                <small>{service.eta}</small>
              </div>
              <button
                className={requested ? "secondary-button requested" : "primary-button"}
                type="button"
                onClick={() => request(service.id, service.title)}
              >
                {requested ? (
                  <>
                    <Check size={17} />
                    Requested
                  </>
                ) : (
                  "Request"
                )}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ProfileScreen({
  state,
  update,
  navigate,
}: {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  navigate: (screen: Screen) => void;
}) {
  return (
    <div className="screen">
      <BackHeader label={screenTitle(state.lastMainTab)} onBack={() => navigate(state.lastMainTab)} />
      <section className="profile-hero">
        <span className="profile-avatar">AR</span>
        <div>
          <p className="eyebrow">INDIE customer since 2021</p>
          <h1>Ananya Rao</h1>
          <p>Bengaluru - Salaried professional - Family of three</p>
        </div>
        <span className="verified-account">
          <BadgeCheck size={18} />
          Bank verified
        </span>
      </section>

      <div className="profile-layout">
        <section className="settings-section">
          <SectionHeading eyebrow="Personalisation" title="Your data, your choice" />
          <label className="toggle-row">
            <span>
              <strong>Personalised protection insights</strong>
              <small>Use consented profile and transaction signals to identify likely coverage gaps.</small>
            </span>
            <input
              type="checkbox"
              checked={state.personalization}
              onChange={(event) => update({ personalization: event.target.checked })}
            />
          </label>
          <label className="toggle-row">
            <span>
              <strong>Renewal and claim notifications</strong>
              <small>Receive app and WhatsApp updates for important policy actions.</small>
            </span>
            <input
              type="checkbox"
              checked={state.notifications}
              onChange={(event) => update({ notifications: event.target.checked })}
            />
          </label>
        </section>

        <section className="settings-section">
          <SectionHeading eyebrow="Connected data" title="Permissions" />
          <div className="permission-list">
            <InfoRow label="Bank profile" value="Connected" />
            <InfoRow label="Vehicle details" value="Connected" />
            <InfoRow label="Health information" value="Not connected" />
            <InfoRow label="External policies" value={state.importedPolicy ? "1 imported" : "None"} />
          </div>
        </section>
      </div>

      <section className="privacy-band">
        <LockKeyhole size={22} />
        <div>
          <strong>Purpose-limited by design</strong>
          <p>
            Financial signals suggest life events and protection needs; they do not change a claim decision.
            Underwriting and claims use only declared, authorised information.
          </p>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action && (
        <button type="button" onClick={onAction}>
          {action}
          <ChevronRight size={17} />
        </button>
      )}
    </div>
  );
}

function PageIntro({ title, body }: { title: string; body: string }) {
  return (
    <header className="page-intro">
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}

function BackHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button className="back-button" type="button" onClick={onBack}>
      <ArrowLeft size={18} />
      {label}
    </button>
  );
}

function QuickAction({
  icon: Icon,
  label,
  detail,
  tone,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  detail: string;
  tone: string;
  onClick: () => void;
}) {
  return (
    <button className="quick-action" type="button" onClick={onClick}>
      <span className={`quick-icon ${tone}`}>
        <Icon size={23} />
      </span>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight size={18} />
    </button>
  );
}

function PolicyRow({
  icon: Icon,
  tone,
  title,
  subtitle,
  status,
  value,
  onClick,
}: {
  icon: LucideIcon;
  tone: string;
  title: string;
  subtitle: string;
  status: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button className="vault-policy" type="button" onClick={onClick}>
      <span className={`policy-icon ${tone}`}>
        <Icon size={23} />
      </span>
      <span className="vault-policy-copy">
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className="vault-policy-value">
        <strong>{value}</strong>
        <small>{status}</small>
      </span>
      <ChevronRight size={19} />
    </button>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CompareLabel({ label }: { label: string }) {
  return <div className="compare-label">{label}</div>;
}

function CompareValue({ value, strong = false }: { value: string; strong?: boolean }) {
  return <div className={strong ? "compare-cell strong" : "compare-cell"}>{value}</div>;
}

function CompareBoolean({ value }: { value: boolean }) {
  return (
    <div className="compare-cell">
      {value ? (
        <span className="yes-value">
          <Check size={17} />
          Included
        </span>
      ) : (
        <span className="no-value">
          <X size={16} />
          Not included
        </span>
      )}
    </div>
  );
}

function FlowStepper({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="flow-stepper" aria-label={`Step ${current} of ${labels.length}`}>
      {labels.map((label, index) => {
        const step = index + 1;
        return (
          <div className={step <= current ? "flow-step active" : "flow-step"} key={label}>
            <span>{step < current ? <Check size={13} /> : step}</span>
            <strong>{label}</strong>
          </div>
        );
      })}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ClaimTimeline({ status, detailed = false }: { status: ClaimStatus; detailed?: boolean }) {
  const steps: { id: ClaimStatus; title: string; body: string }[] = [
    { id: "submitted", title: "Claim registered", body: "Evidence received and claim ID created." },
    { id: "surveyor", title: "Surveyor assigned", body: "Damage inspection and garage coordination." },
    { id: "assessment", title: "Assessment in progress", body: "Estimate checked against policy coverage." },
    { id: "approved", title: "Repair approved", body: "Authorisation shared with the cashless garage." },
  ];
  const order: ClaimStatus[] = ["none", "submitted", "surveyor", "assessment", "approved"];
  const currentIndex = order.indexOf(status);

  return (
    <div className={detailed ? "claim-timeline detailed" : "claim-timeline"}>
      {steps.map((step) => {
        const reached = order.indexOf(step.id) <= currentIndex;
        const active = step.id === status;
        return (
          <div className={reached ? "claim-step reached" : "claim-step"} key={step.id}>
            <span className={active ? "claim-dot active" : "claim-dot"}>
              {reached && <Check size={13} />}
            </span>
            <div>
              <strong>{step.title}</strong>
              {detailed && <p>{step.body}</p>}
              {active && <small>Current stage</small>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function screenTitle(screen: Screen) {
  const labels: Record<Screen, string> = {
    home: "Protection overview",
    explore: "Explore cover",
    compare: "Compare plans",
    plan: "Plan details",
    checkout: "Secure checkout",
    vault: "Policy vault",
    policy: "Policy details",
    claims: "Claims centre",
    "claim-start": "Start a claim",
    "claim-evidence": "Claim evidence",
    "claim-submitted": "Claim submitted",
    "claim-track": "Claim tracking",
    renewal: "Policy renewal",
    assistant: "Protect AI",
    services: "Assistance services",
    profile: "Profile and privacy",
  };
  return labels[screen];
}

function claimStatusLabel(status: ClaimStatus) {
  const labels: Record<ClaimStatus, string> = {
    none: "Not started",
    submitted: "Registered",
    surveyor: "Surveyor assigned",
    assessment: "Assessment",
    approved: "Approved",
  };
  return labels[status];
}

export default App;
