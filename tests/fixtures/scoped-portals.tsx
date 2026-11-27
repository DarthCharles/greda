import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../../src/index";

function ScopedPortals() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div data-theme="comal" data-color-scheme="dark" ref={setContainer}>
      <Drawer>
        <DrawerTrigger asChild><Button>Pickup details</Button></DrawerTrigger>
        <DrawerContent container={container} nativeBackdrop>
          <DrawerHeader>
            <DrawerTitle>Pickup details</DrawerTitle>
            <DrawerDescription>Your order will be ready on Saturday.</DrawerDescription>
          </DrawerHeader>
          <div
            role="region"
            aria-label="Pickup instructions"
            tabIndex={0}
            style={{ minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}
          >
            <p className="comal-ui">Collect your order from the service desk between 10 am and 2 pm.</p>
            <p className="comal-ui">Bring your confirmation email so the team can find your items.</p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild><Button>Done</Button></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Popover placement="bottom-start">
        <PopoverTrigger asChild><Button>Scoped details</Button></PopoverTrigger>
        <PopoverContent container={container} aria-label="Scoped details">
          <p>This portal inherits the local Comal dark theme.</p>
          <PopoverClose asChild><Button>Close scoped details</Button></PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}

createRoot(document.body.appendChild(document.createElement("div"))).render(<ScopedPortals />);
