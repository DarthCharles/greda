import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "../index";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Supplementary information on hover or keyboard focus; Escape dismisses. Do not place interactive content inside. The trigger must have its own accessible name. For disabled actions use adjacent explanatory text. --tooltip-width controls wrapping. Portal themes follow html or the supplied container.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Details</Button>
        </TooltipTrigger>
        <TooltipContent>More information about this action.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
