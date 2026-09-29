"use client";

import { type ReactNode, useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  children: (activeTab: string) => ReactNode;
  defaultTab?: string;
}

export function Tabs({ tabs, children, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <div>
      {/* Tab list */}
      <div
        role="tablist"
        className="flex border-b border-border overflow-x-auto"
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={[
              "px-4 py-3 text-16 font-medium whitespace-nowrap",
              "border-b-2 -mb-px transition-colors duration-[120ms]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              active === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink hover:border-border",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
          className="py-6"
        >
          {active === tab.id && children(tab.id)}
        </div>
      ))}
    </div>
  );
}
