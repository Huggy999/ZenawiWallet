import {
  ArrowBottomLeftIcon,
  ArrowRightIcon,
  ArrowTopRightIcon,
  CheckCircledIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CopyIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  GearIcon,
  GlobeIcon,
  HomeIcon,
  InfoCircledIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PaperPlaneIcon,
  PersonIcon,
  PlusIcon,
  QuestionMarkCircledIcon,
  ReloadIcon,
  SewingPinIcon,
  TokensIcon,
} from "@radix-ui/react-icons";
import {
  createContext,
  type FormEvent,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  BottomSheet,
  FlowStack,
  KeyboardInput,
  KeyboardTextarea,
  MobileScroll,
  type FlowControls,
  type FlowScreen,
  useFlow,
} from "./mobile";
import bitcoinLogo from "./assets/bitcoin.png";
import ethereumLogo from "./assets/ethereum.png";
import usdcLogo from "./assets/usdc.png";

type Asset = {
  symbol: "BTC" | "ETH" | "USDC";
  name: string;
  price: string;
  change: string;
  holdings: string;
  fiat: string;
  icon: string;
  address: string;
};

type WalletContextValue = {
  balancesVisible: boolean;
  setBalancesVisible: (value: boolean) => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

const assets: Asset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$68,420.12",
    change: "+1.8%",
    holdings: "0.126 BTC",
    fiat: "$8,621.00",
    icon: bitcoinLogo,
    address: "bc1q5tersa8k2y3n7v4u9c6d0m2p8w7x3q4r6t",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$3,742.86",
    change: "+0.7%",
    holdings: "1.204 ETH",
    fiat: "$4,506.80",
    icon: ethereumLogo,
    address: "0x71D9A48b25E6c0E58b14953E2A9f18d5f3B7e812",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    price: "$1.00",
    change: "0.0%",
    holdings: "1,158.65 USDC",
    fiat: "$1,158.65",
    icon: usdcLogo,
    address: "0x71D9A48b25E6c0E58b14953E2A9f18d5f3B7e812",
  },
];

const recoveryWords = [
  "harbor", "maple", "velvet", "planet", "copper", "ribbon",
  "meadow", "cactus", "ember", "orbit", "winter", "signal",
];

function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used inside WalletContext");
  return context;
}

function formatBalance(visible: boolean, value: string) {
  return visible ? value : "••••••";
}

function BrandMark() {
  return <div className="brand-mark" aria-label="Tersa Wallet">Tersa Wallet</div>;
}

function IconButton({ label, children, onClick }: { label: string; children: ReactNode; onClick: () => void }) {
  return <button className="icon-button" type="button" aria-label={label} onClick={onClick}>{children}</button>;
}

function ScreenHeader({ title, flow }: { title: string; flow: FlowControls }) {
  return (
    <div className="screen-header">
      <IconButton label="Go back" onClick={() => flow.pop()}><ChevronLeftIcon /></IconButton>
      <h1>{title}</h1>
      <div className="header-action-slot" />
    </div>
  );
}

function BottomNav({ active, flow }: { active: "wallet" | "activity" | "settings"; flow: FlowControls }) {
  const go = (screen: FlowScreen) => flow.replace(screen);
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      <button type="button" className={active === "wallet" ? "active" : ""} onClick={() => go(HOME_SCREEN)}><HomeIcon /><span>Wallet</span></button>
      <button type="button" className={active === "activity" ? "active" : ""} onClick={() => go(ACTIVITY_SCREEN)}><ClockIcon /><span>Activity</span></button>
      <button type="button" className={active === "settings" ? "active" : ""} onClick={() => go(SETTINGS_SCREEN)}><GearIcon /><span>Settings</span></button>
    </nav>
  );
}

function AssetLogo({ asset, size = "regular" }: { asset: Asset; size?: "regular" | "large" }) {
  return <img className={`asset-logo ${size}`} src={asset.icon} alt={`${asset.name} logo`} draggable={false} />;
}

function HomeScreen() {
  const flow = useFlow();
  const { balancesVisible, setBalancesVisible } = useWallet();
  const [buyOpen, setBuyOpen] = useState(false);

  return (
    <>
      <MobileScroll className="app-screen">
        <main className="wallet-home" data-testid="wallet-home">
          <div className="home-topbar">
            <BrandMark />
            <IconButton label={balancesVisible ? "Hide balances" : "Show balances"} onClick={() => setBalancesVisible(!balancesVisible)}>
              {balancesVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </IconButton>
          </div>
          <section className="greeting-block">
            <h1>Hello there.</h1>
            <p>Here’s what you own.</p>
          </section>
          <section className="balance-block" aria-label="Wallet balance">
            <p>Total wallet value</p>
            <div className="balance-line"><h1>{formatBalance(balancesVisible, "$14,286.45")}</h1></div>
            <span className="balance-label">Est. in USD <InfoCircledIcon /></span>
          </section>
          <div className="ownership-note"><span className="ownership-icon"><LockClosedIcon /></span><div><strong>Your keys, your wallet</strong><span>You’re in full control of your assets.</span></div><ChevronRightIcon /></div>
          <section className="action-cluster" aria-label="Wallet actions">
            <div className="quick-actions">
              <button type="button" className="action-card send-card" onClick={() => flow.push(SEND_SCREEN)}>
                <span className="action-icon"><ArrowTopRightIcon /></span><span className="action-copy"><strong>Send</strong><small>From your wallet</small></span>
              </button>
              <button type="button" className="action-card receive-card" onClick={() => flow.push(RECEIVE_SCREEN)}>
                <span className="action-icon"><ArrowBottomLeftIcon /></span><span className="action-copy"><strong>Receive</strong><small>To your wallet</small></span>
              </button>
            </div>
            <button type="button" className="buy-banner" onClick={() => setBuyOpen(true)}>
              <span className="plus-pill"><PlusIcon /></span><span><strong>Buy crypto</strong><small>Powered by MoonPay</small></span><ChevronRightIcon />
            </button>
          </section>
          <section className="assets-section" aria-labelledby="assets-heading">
            <div className="section-heading"><h2 id="assets-heading">Assets</h2><button type="button" onClick={() => flow.push(MANAGE_ASSETS_SCREEN)}>See all</button></div>
            <div className="asset-list">
              {assets.map((asset) => (
                <button type="button" className="asset-row" key={asset.symbol} onClick={() => flow.push(makeAssetScreen(asset))}>
                  <AssetLogo asset={asset} />
                  <span className="asset-identity"><strong>{asset.name}</strong><small>{asset.symbol} · {asset.price}</small></span>
                  <span className="asset-value"><strong>{formatBalance(balancesVisible, asset.holdings)}</strong><small>{formatBalance(balancesVisible, asset.fiat)}</small></span>
                </button>
              ))}
            </div>
          </section>
          <div className="demo-notice">Values are estimates and may not reflect the exact value of your assets.</div>
        </main>
      </MobileScroll>
      <BottomSheet open={buyOpen} onOpenChange={setBuyOpen} title="Buy crypto" description="Choose a third-party provider. You’ll review fees before leaving Tersa." snap={0.55}>
        <div className="provider-list">
          <button type="button" onClick={() => setBuyOpen(false)}><span className="provider-logo">M</span><span><strong>MoonPay</strong><small>Card, Apple Pay · from 1.5%</small></span><ChevronRightIcon /></button>
          <button type="button" onClick={() => setBuyOpen(false)}><span className="provider-logo indigo">C</span><span><strong>Coinbase Pay</strong><small>Coinbase account · fees vary</small></span><ChevronRightIcon /></button>
        </div>
        <p className="sheet-legal">Third-party services have their own terms, eligibility rules, and identity checks.</p>
      </BottomSheet>
    </>
  );
}

function ActivityScreen() {
  const [query, setQuery] = useState("");
  const flow = useFlow();
  const items = [
    { icon: ethereumLogo, title: "Received ETH", detail: "Aug 21 · 0x4F2A…91C0", value: "+0.284 ETH", fiat: "$1,063.37" },
    { icon: bitcoinLogo, title: "Sent BTC", detail: "Aug 18 · bc1q…a82f", value: "−0.014 BTC", fiat: "$957.88" },
    { icon: usdcLogo, title: "Received USDC", detail: "Aug 12 · 0x93B7…32D1", value: "+420.00 USDC", fiat: "$420.00" },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <MobileScroll className="app-screen"><main className="standard-page with-footer" data-testid="activity-screen">
      <div className="main-page-title"><div><span>Wallet history</span><h1>Activity</h1></div></div>
      <label className="search-field"><MagnifyingGlassIcon /><KeyboardInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activity" aria-label="Search activity" /></label>
      <div className="month-label">AUGUST</div>
      <div className="transaction-list">
        {items.map((item) => <button type="button" key={item.title + item.detail} onClick={() => flow.push(ACTIVITY_DETAIL_SCREEN)}><img src={item.icon} alt="" draggable={false} /><span><strong>{item.title}</strong><small>{item.detail}</small></span><span className="transaction-value"><strong>{item.value}</strong><small>{item.fiat}</small></span></button>)}
        {items.length === 0 ? <div className="empty-state"><MagnifyingGlassIcon /><strong>No activity found</strong><span>Try another asset or address.</span></div> : null}
      </div>
    </main></MobileScroll>
  );
}

function ActivityDetailScreen() {
  const [copied, setCopied] = useState(false);
  const copyHash = async () => { await navigator.clipboard?.writeText("0x826f198ac027a356129fb6c36ff89bb5b41a96af915a2c08cba93b7e6ec1b88d"); setCopied(true); };
  return (
    <MobileScroll className="app-screen"><main className="standard-page detail-page" data-testid="activity-detail">
      <div className="status-orb success"><CheckCircledIcon /></div><p className="eyebrow">RECEIVED</p><h2>+0.284 ETH</h2><p className="muted">$1,063.37</p>
      <div className="detail-card"><DetailRow label="Status" value="Confirmed" accent /><DetailRow label="Date" value="Aug 21, 2026 · 10:24 AM" /><DetailRow label="Network fee" value="Paid by sender" /><DetailRow label="Network" value="Ethereum" /></div>
      <button type="button" className="secondary-button" onClick={copyHash}>{copied ? <CheckCircledIcon /> : <CopyIcon />} {copied ? "Transaction ID copied" : "Copy transaction ID"}</button>
    </main></MobileScroll>
  );
}

function SettingsScreen() {
  const flow = useFlow();
  return (
    <MobileScroll className="app-screen"><main className="standard-page settings-page with-footer" data-testid="settings-screen">
      <div className="main-page-title"><div><span>Private by design</span><h1>Settings</h1></div></div>
      <div className="profile-card"><div className="profile-icon"><PersonIcon /></div><span><strong>Primary wallet</strong><small>0x71D9…e812</small></span><ChevronRightIcon /></div>
      <section className="settings-group"><h2>Security</h2><SettingsRow icon={<LockClosedIcon />} title="Security center" detail="3 of 3 checks complete" onClick={() => flow.push(SECURITY_SCREEN)} /><SettingsRow icon={<TokensIcon />} title="Recovery phrase" detail="Backed up" onClick={() => flow.push(RECOVERY_SCREEN)} /></section>
      <section className="settings-group"><h2>Preferences</h2><SettingsRow icon={<GlobeIcon />} title="Currency" detail="USD" onClick={() => flow.push(CURRENCY_SCREEN)} /><SettingsRow icon={<SewingPinIcon />} title="Networks" detail="Ethereum · Bitcoin" onClick={() => flow.push(NETWORKS_SCREEN)} /></section>
      <section className="settings-group"><h2>About</h2><SettingsRow icon={<QuestionMarkCircledIcon />} title="Help center" detail="Guides and safety" onClick={() => flow.push(HELP_SCREEN)} /><SettingsRow icon={<ReloadIcon />} title="Preview onboarding" detail="Create or import a wallet" onClick={() => flow.push(WELCOME_SCREEN)} /></section>
      <div className="settings-meta">Tersa Wallet preview · Version 1.0.0</div>
    </main></MobileScroll>
  );
}

function SettingsRow({ icon, title, detail, onClick }: { icon: ReactNode; title: string; detail: string; onClick: () => void }) {
  return <button type="button" className="settings-row" onClick={onClick}><span className="settings-row-icon">{icon}</span><span><strong>{title}</strong><small>{detail}</small></span><ChevronRightIcon /></button>;
}

function SecurityScreen() {
  const [biometrics, setBiometrics] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [warnings, setWarnings] = useState(true);
  return (
    <MobileScroll className="app-screen"><main className="standard-page security-page" data-testid="security-screen">
      <div className="security-score"><CheckCircledIcon /><div><strong>All checks complete</strong><span>Your wallet has the recommended protections.</span></div></div>
      <div className="toggle-list"><ToggleRow title="Biometric unlock" detail="Use Face ID or fingerprint" checked={biometrics} onChange={setBiometrics} /><ToggleRow title="Auto-lock" detail="Lock after 1 minute" checked={autoLock} onChange={setAutoLock} /><ToggleRow title="Risk warnings" detail="Flag suspicious addresses" checked={warnings} onChange={setWarnings} /></div>
      <div className="safety-callout"><InfoCircledIcon /><p><strong>Tersa cannot reset your phrase.</strong> Support will never ask for recovery words or remote access.</p></div>
    </main></MobileScroll>
  );
}

function ToggleRow({ title, detail, checked, onChange }: { title: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="toggle-row"><span><strong>{title}</strong><small>{detail}</small></span><button type="button" role="switch" aria-checked={checked} className={checked ? "toggle on" : "toggle"} onClick={() => onChange(!checked)}><span /></button></div>;
}

function RecoveryScreen() {
  const [visible, setVisible] = useState(false);
  return (
    <MobileScroll className="app-screen"><main className="standard-page recovery-page" data-testid="recovery-screen">
      <div className="warning-card"><LockClosedIcon /><div><strong>For your eyes only</strong><span>Anyone with these words can control the wallet.</span></div></div>
      <button type="button" className={visible ? "phrase-panel visible" : "phrase-panel"} onClick={() => setVisible(!visible)}>
        {visible ? <div className="word-grid">{recoveryWords.map((word, index) => <span key={word}><small>{index + 1}</small>{word}</span>)}</div> : <div className="phrase-cover"><EyeClosedIcon /><strong>Tap to reveal recovery phrase</strong><span>Make sure nobody is watching your screen.</span></div>}
      </button>
      <p className="danger-copy">Never store these words in email, cloud storage, or a screenshot.</p>
    </main></MobileScroll>
  );
}

function GenericSettingsScreen({ title, children }: { title: string; children: ReactNode }) {
  return <MobileScroll className="app-screen"><main className="standard-page generic-page">{children}<div className="generic-footer">{title} preferences save instantly on this device.</div></main></MobileScroll>;
}

function CurrencyScreen() {
  const [currency, setCurrency] = useState("USD");
  const labels: Record<string, string> = { USD: "US Dollar", EUR: "Euro", GBP: "British Pound", CAD: "Canadian Dollar" };
  return <GenericSettingsScreen title="Currency"><div className="choice-list">{Object.keys(labels).map((item) => <button type="button" key={item} onClick={() => setCurrency(item)}><span><strong>{item}</strong><small>{labels[item]}</small></span>{currency === item ? <CheckCircledIcon /> : null}</button>)}</div></GenericSettingsScreen>;
}

function NetworksScreen() {
  const [enabled, setEnabled] = useState({ bitcoin: true, ethereum: true, base: false });
  return <GenericSettingsScreen title="Network"><div className="toggle-list"><ToggleRow title="Bitcoin" detail="Native SegWit" checked={enabled.bitcoin} onChange={(value) => setEnabled({ ...enabled, bitcoin: value })} /><ToggleRow title="Ethereum" detail="Ethereum mainnet" checked={enabled.ethereum} onChange={(value) => setEnabled({ ...enabled, ethereum: value })} /><ToggleRow title="Base" detail="Ethereum L2" checked={enabled.base} onChange={(value) => setEnabled({ ...enabled, base: value })} /></div></GenericSettingsScreen>;
}

function HelpScreen() {
  return <MobileScroll className="app-screen"><main className="standard-page help-page"><div className="help-hero"><QuestionMarkCircledIcon /><h2>How can we help?</h2><p>Learn how self-custody works and stay safe.</p></div><div className="choice-list"><button type="button"><span><strong>Protect your wallet</strong><small>Recovery phrase and scam safety</small></span><ChevronRightIcon /></button><button type="button"><span><strong>Send and receive</strong><small>Addresses, fees, and confirmations</small></span><ChevronRightIcon /></button><button type="button"><span><strong>Contact support</strong><small>support@tersa.example</small></span><ChevronRightIcon /></button></div><div className="safety-callout"><InfoCircledIcon /><p>Support can explain the product but can never recover funds or ask for your recovery phrase.</p></div></main></MobileScroll>;
}

function ManageAssetsScreen() {
  const [visible, setVisible] = useState({ BTC: true, ETH: true, USDC: true });
  return <MobileScroll className="app-screen"><main className="standard-page manage-page"><p className="page-intro">Choose which assets appear on your wallet home.</p><div className="toggle-list">{assets.map((asset) => <div className="asset-toggle" key={asset.symbol}><AssetLogo asset={asset} /><ToggleRow title={asset.name} detail={asset.symbol} checked={visible[asset.symbol]} onChange={(value) => setVisible({ ...visible, [asset.symbol]: value })} /></div>)}</div></main></MobileScroll>;
}

function SendScreen() {
  const flow = useFlow();
  return <MobileScroll className="app-screen"><main className="standard-page send-select" data-testid="send-screen"><p className="page-intro">Choose the asset you want to send.</p><div className="choice-list asset-choices">{assets.map((asset) => <button type="button" key={asset.symbol} onClick={() => flow.push(makeSendFormScreen(asset))}><AssetLogo asset={asset} /><span><strong>{asset.name}</strong><small>Available · {asset.holdings}</small></span><ChevronRightIcon /></button>)}</div><div className="safety-callout"><InfoCircledIcon /><p>Always confirm the network and first characters of an address before sending.</p></div></main></MobileScroll>;
}

function SendFormScreen({ asset }: { asset: Asset }) {
  const flow = useFlow();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const valid = address.trim().length >= 8 && Number(amount) > 0;
  const handleSubmit = (event: FormEvent) => { event.preventDefault(); if (valid) flow.push(makeReviewScreen(asset, address, amount)); };
  const price = Number(asset.price.replace(/[$,]/g, ""));
  return (
    <MobileScroll className="app-screen"><form className="standard-page send-form" onSubmit={handleSubmit} data-testid="send-form">
      <div className="asset-chip"><AssetLogo asset={asset} /><span><strong>{asset.name}</strong><small>Available {asset.holdings}</small></span></div>
      <label className="form-field"><span>Recipient address</span><KeyboardInput value={address} onChange={(event) => setAddress(event.target.value)} placeholder={asset.symbol === "BTC" ? "bc1q…" : "0x…"} data-testid="recipient-input" /></label>
      <label className="form-field amount-field"><span>Amount</span><div><KeyboardInput value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="0.00" data-testid="amount-input" /><strong>{asset.symbol}</strong></div><small>≈ {amount ? `$${(Number(amount) * price).toFixed(2)}` : "$0.00"}</small></label>
      <button className="primary-button" type="submit" disabled={!valid} data-testid="review-send">Review send <ArrowRightIcon /></button><p className="form-hint"><LockClosedIcon /> Tersa signs on this device. Your keys never leave it.</p>
    </form></MobileScroll>
  );
}

function ReviewSendScreen({ asset, address, amount }: { asset: Asset; address: string; amount: string }) {
  const flow = useFlow();
  return <MobileScroll className="app-screen"><main className="standard-page review-page" data-testid="review-send-screen"><div className="review-amount"><AssetLogo asset={asset} size="large" /><span>YOU SEND</span><h2>{amount} {asset.symbol}</h2><p>Network fee estimate included below</p></div><div className="detail-card"><DetailRow label="To" value={`${address.slice(0, 7)}…${address.slice(-5)}`} /><DetailRow label="Network" value={asset.symbol === "BTC" ? "Bitcoin" : "Ethereum"} /><DetailRow label="Network fee" value={asset.symbol === "BTC" ? "0.000021 BTC" : "0.0018 ETH"} /><DetailRow label="Arrival" value="Usually under 10 min" /></div><div className="safety-callout warm"><InfoCircledIcon /><p>Crypto transfers are irreversible. Confirm the address before continuing.</p></div><button className="primary-button" type="button" onClick={() => flow.push(SEND_SUCCESS_SCREEN)} data-testid="confirm-send">Hold to confirm</button></main></MobileScroll>;
}

function SendSuccessScreen() {
  const flow = useFlow();
  return <MobileScroll className="app-screen"><main className="success-page" data-testid="send-success"><div className="status-orb success"><CheckCircledIcon /></div><p className="eyebrow">TRANSACTION SIGNED</p><h1>Send submitted</h1><p>The network is processing your transaction. You can track it in Activity.</p><button className="primary-button" type="button" onClick={() => flow.replace(ACTIVITY_SCREEN)}>View activity</button><button className="text-button" type="button" onClick={() => flow.replace(HOME_SCREEN)}>Back to wallet</button></main></MobileScroll>;
}

function ReceiveScreen() {
  const [selected, setSelected] = useState(assets[0]);
  const [copied, setCopied] = useState(false);
  const copyAddress = async () => { await navigator.clipboard?.writeText(selected.address); setCopied(true); };
  return <MobileScroll className="app-screen"><main className="standard-page receive-page" data-testid="receive-screen"><p className="page-intro">Choose an asset and share the matching address.</p><div className="asset-tabs" aria-label="Receive asset">{assets.map((asset) => <button type="button" className={selected.symbol === asset.symbol ? "active" : ""} key={asset.symbol} onClick={() => { setSelected(asset); setCopied(false); }}><AssetLogo asset={asset} /><span>{asset.symbol}</span></button>)}</div><div className="address-card"><AssetLogo asset={selected} size="large" /><span>Your {selected.name} address</span><strong>{selected.address}</strong><button type="button" onClick={copyAddress}>{copied ? <CheckCircledIcon /> : <CopyIcon />}{copied ? "Copied" : "Copy address"}</button></div><div className="safety-callout"><InfoCircledIcon /><p>Only send {selected.symbol} on the {selected.symbol === "BTC" ? "Bitcoin" : "Ethereum"} network to this address.</p></div></main></MobileScroll>;
}

function AssetDetailScreen({ asset }: { asset: Asset }) {
  const flow = useFlow();
  const { balancesVisible } = useWallet();
  return <MobileScroll className="app-screen"><main className="standard-page asset-detail" data-testid={`asset-${asset.symbol.toLowerCase()}`}><div className="asset-detail-title"><AssetLogo asset={asset} size="large" /><span><strong>{asset.name}</strong><small>{asset.symbol}</small></span></div><section className="asset-balance"><span>Your balance</span><h2>{formatBalance(balancesVisible, asset.fiat)}</h2><p>{formatBalance(balancesVisible, asset.holdings)}</p></section><div className="asset-action-row"><button type="button" onClick={() => flow.push(makeSendFormScreen(asset))}><PaperPlaneIcon /><span>Send</span></button><button type="button" onClick={() => flow.push(RECEIVE_SCREEN)}><ArrowBottomLeftIcon /><span>Receive</span></button></div><div className="detail-card"><DetailRow label="Current price" value={asset.price} /><DetailRow label="24-hour change" value={asset.change} accent /><DetailRow label="Network" value={asset.symbol === "BTC" ? "Bitcoin" : "Ethereum"} /></div><p className="market-disclaimer">Prices are indicative and may be delayed. Tersa does not provide investment advice.</p></main></MobileScroll>;
}

function WelcomeScreen() {
  const flow = useFlow();
  return <MobileScroll className="app-screen onboarding-screen"><main className="welcome-page" data-testid="onboarding-welcome"><div className="onboarding-brand"><div className="brand-emblem"><LockClosedIcon /></div><BrandMark /></div><div className="welcome-copy"><p className="eyebrow">SELF-CUSTODY, SIMPLIFIED</p><h1>Your money.<br />Your keys.</h1><p>Create a private wallet you control — built for calm, everyday use.</p></div><div className="onboarding-actions"><button className="primary-button" type="button" onClick={() => flow.push(CREATE_WALLET_SCREEN)}>Create a new wallet</button><button className="secondary-button" type="button" onClick={() => flow.push(IMPORT_WALLET_SCREEN)}>Import existing wallet</button><button className="text-button" type="button" onClick={() => flow.replace(HOME_SCREEN)}>Exit preview</button></div></main></MobileScroll>;
}

function CreateWalletScreen() {
  const flow = useFlow();
  return <MobileScroll className="app-screen onboarding-screen"><main className="standard-page create-wallet-page" data-testid="create-wallet"><p className="eyebrow">STEP 1 OF 2</p><h2>Back up your wallet</h2><p className="page-intro">Write these demo recovery words down in order. Never share a real phrase with anyone.</p><div className="word-grid create-grid">{recoveryWords.map((word, index) => <span key={word}><small>{index + 1}</small>{word}</span>)}</div><div className="warning-card"><InfoCircledIcon /><div><strong>Demo phrase only</strong><span>This prototype does not create or store real cryptographic keys.</span></div></div><button className="primary-button" type="button" onClick={() => flow.push(VERIFY_PHRASE_SCREEN)}>I wrote it down</button></main></MobileScroll>;
}

function VerifyPhraseScreen() {
  const flow = useFlow();
  const [chosen, setChosen] = useState<string[]>([]);
  const complete = chosen.join(" ") === "orbit winter signal";
  return <MobileScroll className="app-screen onboarding-screen"><main className="standard-page verify-page" data-testid="verify-phrase"><p className="eyebrow">STEP 2 OF 2</p><h2>Check your backup</h2><p className="page-intro">Select words 10–12 in the correct order.</p><div className="verify-slots">{[0, 1, 2].map((index) => <button type="button" key={index} onClick={() => setChosen(chosen.filter((_, chosenIndex) => chosenIndex !== index))}><small>{index + 10}</small>{chosen[index] || "Select"}</button>)}</div><div className="word-options">{["signal", "orbit", "winter"].map((word) => <button type="button" key={word} disabled={chosen.includes(word)} onClick={() => setChosen([...chosen, word])}>{word}</button>)}</div><button className="primary-button" type="button" disabled={!complete} onClick={() => flow.push(WALLET_READY_SCREEN)}>Confirm backup</button></main></MobileScroll>;
}

function ImportWalletScreen() {
  const flow = useFlow();
  const [phrase, setPhrase] = useState("");
  const count = phrase.trim() ? phrase.trim().split(/\s+/).length : 0;
  return <MobileScroll className="app-screen onboarding-screen"><main className="standard-page import-page" data-testid="import-wallet"><p className="eyebrow">RESTORE WALLET</p><h2>Enter recovery phrase</h2><p className="page-intro">For this preview, enter any 12 words. Never enter a real recovery phrase into a demo.</p><label className="form-field"><span>Recovery words</span><KeyboardTextarea value={phrase} onChange={(event) => setPhrase(event.target.value)} placeholder="word 1  word 2  word 3…" rows={6} data-testid="recovery-input" /><small>{count} of 12 words</small></label><button className="primary-button" type="button" disabled={count !== 12} onClick={() => flow.push(WALLET_READY_SCREEN)}>Import preview wallet</button></main></MobileScroll>;
}

function WalletReadyScreen() {
  const flow = useFlow();
  return <MobileScroll className="app-screen"><main className="success-page" data-testid="wallet-ready"><div className="status-orb success"><CheckCircledIcon /></div><p className="eyebrow">READY</p><h1>Your wallet is set</h1><p>This preview is protected with device security and ready to explore.</p><button className="primary-button" type="button" onClick={() => flow.replace(HOME_SCREEN)}>Open wallet</button></main></MobileScroll>;
}

function DetailRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className="detail-row"><span>{label}</span><strong className={accent ? "accent" : ""}>{value}</strong></div>;
}

function header(title: string) { return (flow: FlowControls) => <ScreenHeader title={title} flow={flow} />; }
function footer(active: "wallet" | "activity" | "settings") { return (flow: FlowControls) => <BottomNav active={active} flow={flow} />; }

const HOME_SCREEN: FlowScreen = { id: "home", footer: footer("wallet"), footerHeight: 86, render: () => <HomeScreen /> };
const ACTIVITY_SCREEN: FlowScreen = { id: "activity", footer: footer("activity"), footerHeight: 86, render: () => <ActivityScreen /> };
const SETTINGS_SCREEN: FlowScreen = { id: "settings", footer: footer("settings"), footerHeight: 86, render: () => <SettingsScreen /> };
const SEND_SCREEN: FlowScreen = { id: "send", header: header("Send"), headerHeight: 56, render: () => <SendScreen /> };
const RECEIVE_SCREEN: FlowScreen = { id: "receive", header: header("Receive"), headerHeight: 56, render: () => <ReceiveScreen /> };
const MANAGE_ASSETS_SCREEN: FlowScreen = { id: "manage-assets", header: header("Manage assets"), headerHeight: 56, render: () => <ManageAssetsScreen /> };
const ACTIVITY_DETAIL_SCREEN: FlowScreen = { id: "activity-detail", header: header("Transaction"), headerHeight: 56, render: () => <ActivityDetailScreen /> };
const SECURITY_SCREEN: FlowScreen = { id: "security", header: header("Security center"), headerHeight: 56, render: () => <SecurityScreen /> };
const RECOVERY_SCREEN: FlowScreen = { id: "recovery", header: header("Recovery phrase"), headerHeight: 56, render: () => <RecoveryScreen /> };
const CURRENCY_SCREEN: FlowScreen = { id: "currency", header: header("Currency"), headerHeight: 56, render: () => <CurrencyScreen /> };
const NETWORKS_SCREEN: FlowScreen = { id: "networks", header: header("Networks"), headerHeight: 56, render: () => <NetworksScreen /> };
const HELP_SCREEN: FlowScreen = { id: "help", header: header("Help center"), headerHeight: 56, render: () => <HelpScreen /> };
const WELCOME_SCREEN: FlowScreen = { id: "welcome", header: header(""), headerHeight: 48, render: () => <WelcomeScreen /> };
const CREATE_WALLET_SCREEN: FlowScreen = { id: "create-wallet", header: header("Create wallet"), headerHeight: 56, render: () => <CreateWalletScreen /> };
const VERIFY_PHRASE_SCREEN: FlowScreen = { id: "verify-phrase", header: header("Verify phrase"), headerHeight: 56, render: () => <VerifyPhraseScreen /> };
const IMPORT_WALLET_SCREEN: FlowScreen = { id: "import-wallet", header: header("Import wallet"), headerHeight: 56, render: () => <ImportWalletScreen /> };
const WALLET_READY_SCREEN: FlowScreen = { id: "wallet-ready", render: () => <WalletReadyScreen /> };
const SEND_SUCCESS_SCREEN: FlowScreen = { id: "send-success", render: () => <SendSuccessScreen /> };

function makeAssetScreen(asset: Asset): FlowScreen { return { id: `asset-${asset.symbol}`, header: header(asset.symbol), headerHeight: 56, render: () => <AssetDetailScreen asset={asset} /> }; }
function makeSendFormScreen(asset: Asset): FlowScreen { return { id: `send-${asset.symbol}`, header: header(`Send ${asset.symbol}`), headerHeight: 56, render: () => <SendFormScreen asset={asset} /> }; }
function makeReviewScreen(asset: Asset, address: string, amount: string): FlowScreen { return { id: `review-${asset.symbol}`, header: header("Review transaction"), headerHeight: 56, render: () => <ReviewSendScreen asset={asset} address={address} amount={amount} /> }; }

export default function Prototype() {
  const [balancesVisible, setBalancesVisible] = useState(true);
  const value = useMemo(() => ({ balancesVisible, setBalancesVisible }), [balancesVisible]);
  return <WalletContext.Provider value={value}><FlowStack initial={HOME_SCREEN} /></WalletContext.Provider>;
}
