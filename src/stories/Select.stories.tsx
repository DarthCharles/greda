import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
} from "../index";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Composable single select. Arrow keys navigate, typeahead finds options, Enter selects, and Escape closes. Supply a Label for the trigger. Disabled items are skipped. Use disabled while options load and a descriptive placeholder. Portals inherit the document theme; use content container for scoped themes.",
      },
    },
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example({
  disabled = false,
  invalid = false,
}: {
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <div className="catalog-field">
      <Label htmlFor="select-example">Visibility</Label>
      <Select disabled={disabled}>
        <SelectTrigger
          id="select-example"
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "select-error" : undefined}
        >
          <SelectValue placeholder="Choose visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="team">Team</SelectItem>
          <SelectItem value="public" disabled>
            Public (unavailable)
          </SelectItem>
        </SelectContent>
      </Select>
      {invalid && (
        <p id="select-error" className="catalog-error">
          Choose a visibility.
        </p>
      )}
    </div>
  );
}
export const Default: Story = { render: () => <Example /> };
export const Disabled: Story = { render: () => <Example disabled /> };
export const Invalid: Story = { render: () => <Example invalid /> };
