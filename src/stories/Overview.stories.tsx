import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Label,
  Checkbox,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../index";
const meta = {
  title: "Introduction/Overview",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Components: Story = {
  render: () => (
    <div className="catalog-stack" style={{ maxWidth: 900 }}>
      <header>
        <Badge variant="outline">@comal/design-system · 0.1</Badge>
        <h1>One foundation. Your identity.</h1>
        <p className="catalog-muted">
          Generic components, accessible behavior, and tokens you control.
          Switch the theme and color scheme in the toolbar.
        </p>
      </header>
      <div className="catalog-grid">
        <Card>
          <CardHeader>
            <CardTitle>Create a workspace</CardTitle>
            <CardDescription>
              A small composition using the shared building blocks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="catalog-stack">
              <div className="catalog-field">
                <Label htmlFor="workspace">Workspace name</Label>
                <Input id="workspace" placeholder="Design team" />
              </div>
              <div className="catalog-field">
                <Label htmlFor="visibility">Visibility</Label>
                <Select defaultValue="team">
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="catalog-row">
                <Checkbox id="updates" defaultChecked />
                <Label htmlFor="updates">Send me updates</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Create workspace</Button>
            <Button variant="ghost">Cancel</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Make it yours</CardTitle>
            <CardDescription>
              Override the base tokens in your application stylesheet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre
              style={{ whiteSpace: "pre-wrap" }}
            >{`:root {\n  --primary: 9.500 55.556% 42.353%;\n  --primary-hover: 9.714 56.150% 36.667%;\n  --ring: 9.500 55.556% 42.353%;\n  --radius: 0.75rem;\n}`}</pre>
            <p className="catalog-muted">
              The library ships no brand or product logic. Unspecified tokens
              retain their base values.
            </p>
            <div className="catalog-row">
              <Badge>Typed</Badge>
              <Badge>Themeable</Badge>
              <Badge>Composable</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
