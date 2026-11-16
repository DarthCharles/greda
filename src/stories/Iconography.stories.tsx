import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../index";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Copy,
  Download,
  Mail,
  Menu,
  Plus,
  Search,
  Settings,
  X,
  type LucideIcon,
} from "../icons";

const meta = {
  title: "Iconography",
  tags: ["!autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const commonIcons = [
  { name: "Plus", icon: Plus },
  { name: "Search", icon: Search },
  { name: "X", icon: X },
  { name: "Check", icon: Check },
  { name: "ArrowRight", icon: ArrowRight },
  { name: "ChevronDown", icon: ChevronDown },
  { name: "Menu", icon: Menu },
  { name: "Settings", icon: Settings },
  { name: "Download", icon: Download },
  { name: "Copy", icon: Copy },
  { name: "Mail", icon: Mail },
  { name: "CircleCheck", icon: CircleCheck },
] satisfies { name: string; icon: LucideIcon }[];

export const Default: Story = {
  name: "Common icons",
  render: () => (
    <ul style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 10rem), 1fr))",
      gap: "var(--space-4)",
      padding: 0,
      margin: 0,
      listStyle: "none",
      maxWidth: "60rem",
    }}>
      {commonIcons.map(({ name, icon: Icon }) => (
        <li key={name} className="catalog-row">
          <Icon size={24} aria-hidden="true" />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
};

export const SizeAndStroke: Story = {
  render: () => (
    <div className="catalog-stack">
      <div className="catalog-row">
        {[16, 20, 24, 32].map((size) => (
          <span key={size} className="catalog-row">
            <Search size={size} aria-hidden="true" />
            <code>{size}px</code>
          </span>
        ))}
      </div>
      <div className="catalog-row">
        {[1, 1.5, 2].map((strokeWidth) => (
          <span key={strokeWidth} className="catalog-row">
            <Search size={24} strokeWidth={strokeWidth} aria-hidden="true" />
            <code>strokeWidth={strokeWidth}</code>
          </span>
        ))}
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="catalog-stack">
      <p className="catalog-row" style={{ color: "hsl(var(--text-secondary))" }}>
        <CircleCheck size={20} aria-hidden="true" />
        Changes saved
      </p>
      <div className="catalog-row">
        <Button><Download aria-hidden="true" /> Download</Button>
        <Button variant="outline">Continue <ArrowRight aria-hidden="true" /></Button>
        <Button size="icon" variant="outline" aria-label="Search">
          <Search aria-hidden="true" />
        </Button>
      </div>
    </div>
  ),
};
