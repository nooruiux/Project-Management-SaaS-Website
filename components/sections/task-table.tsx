import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { deliverProjects, type Priority } from "@/content/deliver-projects";
import { cn } from "@/lib/utils";
import chevronDown16 from "@/public/figma/icon-chevron-down-16.svg";
import chevronDown24 from "@/public/figma/icon-chevron-down-24.svg";
import chevronRight16 from "@/public/figma/icon-chevron-right-16.svg";
import colAssigned from "@/public/figma/icon-col-assigned.svg";
import colDue from "@/public/figma/icon-col-due.svg";
import colNote from "@/public/figma/icon-col-note.svg";
import colPriority from "@/public/figma/icon-col-priority.svg";
import colProject from "@/public/figma/icon-col-project.svg";
import dots16 from "@/public/figma/icon-dots-horizontal-16.svg";
import dots24 from "@/public/figma/icon-dots-horizontal-24.svg";
import plus24 from "@/public/figma/icon-plus-24.svg";
import plusCircle from "@/public/figma/icon-plus-circle.svg";

// Figma priority badges: soft fill + strong text.
const priorityStyles: Record<Priority, string> = {
  High: "bg-accent-red-soft text-accent-red",
  Normal: "bg-accent-cyan-soft text-accent-blue",
  Medium: "bg-accent-green-soft text-accent-green",
  Low: "bg-primary-mist text-primary",
};

function Icon({ src, size }: { src: StaticImageData; size: number }) {
  return <Image src={src} alt="" aria-hidden="true" width={size} height={size} unoptimized className="shrink-0" />;
}

function HeaderCell({ icon, children, className }: { icon: StaticImageData; children: ReactNode; className?: string }) {
  return (
    <th scope="col" className={cn("h-9 border-b border-ink/12 p-0 text-left align-top font-semibold", className)}>
      <span className="inline-flex items-center gap-2 text-base leading-6 text-ink-muted">
        <Icon src={icon} size={24} />
        {children}
      </span>
    </th>
  );
}

/*
 * Figma 1:2837 — real table in Inter. Card p-32 (31 + 1px border), 1040px content; header row 36px, body rows 48px with
 * 1px ink/12 dividers; columns at x = 0 / 454 / 591 / 725 / 846 / 1017. Nesting indents 28px per level.
 * Chevrons, "…" and "+" icons are decorative (no behaviour designed); checkboxes are real inputs.
 * Below 1280px the table scrolls inside its own region (focusable, labelled) with a right-edge fade.
 */
export function TaskTable() {
  const { table } = deliverProjects;

  // min-w-0: as a flex item the card must not grow to the table's 1040px min-width — the region scrolls instead.
  return (
    <div className="min-w-0 rounded-xl border border-ink/8 bg-surface p-5 font-ui drop-shadow-[12px_12px_30px_rgba(0,0,0,0.06)] md:p-[31px]">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <Icon src={chevronDown24} size={24} />
            <span className="text-base leading-6 font-semibold text-[#595959]">{table.group}</span>
          </span>
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#e3e3e3] text-xs font-semibold text-[#333]">
            {table.count}
            <span className="sr-only"> tasks</span>
          </span>
        </div>
        <span className="flex items-center gap-3">
          <Icon src={dots24} size={24} />
          <Icon src={plus24} size={24} />
        </span>
      </div>

      <div
        role="region"
        aria-label="Project tasks"
        tabIndex={0}
        // relative: contains the absolutely-positioned sr-only labels so they can't widen the page.
        className="scroll-fade-x relative mt-7 overflow-x-auto"
      >
        <table className="w-full min-w-[1040px] table-fixed border-separate border-spacing-0">
          <colgroup>
            <col className="w-[454px]" />
            <col className="w-[137px]" />
            <col className="w-[134px]" />
            <col className="w-[121px]" />
            <col className="w-[171px]" />
            <col className="w-[23px]" />
          </colgroup>
          <thead>
            <tr>
              <HeaderCell icon={colProject}>{table.columns.project}</HeaderCell>
              <HeaderCell icon={colAssigned}>{table.columns.assigned}</HeaderCell>
              <HeaderCell icon={colDue}>{table.columns.due}</HeaderCell>
              <HeaderCell icon={colPriority}>{table.columns.priority}</HeaderCell>
              <HeaderCell icon={colNote}>{table.columns.note}</HeaderCell>
              <th scope="col" className="h-9 border-b border-ink/12 p-0 align-top">
                <span className="sr-only">Actions</span>
                <Icon src={plusCircle} size={24} />
              </th>
            </tr>
          </thead>
          <tbody className="text-sm leading-5 text-ink">
            {table.rows.map((row) => (
              <tr key={row.title}>
                <td className="h-12 border-b border-ink/12 p-0">
                  <label className="flex items-center gap-3" style={{ paddingLeft: row.depth * 28 }}>
                    <Icon src={row.expanded ? chevronDown16 : chevronRight16} size={16} />
                    {/* Checked state uses the Figma check-square icon from /public. */}
                    <input
                      type="checkbox"
                      defaultChecked={row.done}
                      className="size-4 shrink-0 cursor-pointer appearance-none rounded-xs border-[1.3px] border-[#8d92b0] bg-surface bg-center bg-no-repeat checked:border-0 checked:bg-[url(/figma/icon-check-square.svg)] checked:bg-size-[16px]"
                    />
                    <span className="truncate font-medium">{row.title}</span>
                  </label>
                </td>
                <td className="border-b border-ink/12 p-0">
                  <span className="flex items-center">
                    {row.assignees.map((avatar, i) => (
                      <Image
                        key={i}
                        src={avatar}
                        alt=""
                        width={24}
                        height={24}
                        sizes="24px"
                        className={cn("size-6 rounded-full object-cover", i < row.assignees.length - 1 && "-mr-2")}
                      />
                    ))}
                    <span className="sr-only">
                      {row.assignees.length} {row.assignees.length === 1 ? "assignee" : "assignees"}
                    </span>
                  </span>
                </td>
                {/* Figma stacks Due/Note text with fixed gaps, landing 2px below the row centre (pt-1 = +2px). */}
                <td className="border-b border-ink/12 p-0 pt-1">{row.due}</td>
                <td className="border-b border-ink/12 p-0">
                  <span className={cn("inline-flex rounded-xs px-2 py-1 leading-4 font-medium", priorityStyles[row.priority])}>
                    {row.priority}
                  </span>
                </td>
                <td className="border-b border-ink/12 p-0 pt-1">{row.note}</td>
                {/* "…" icons sit 3px below centre in Figma. */}
                <td className="border-b border-ink/12 p-0 pt-1.5 text-center">
                  <span className="inline-flex">
                    <Icon src={dots16} size={16} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-3 text-base leading-6 font-semibold text-ink/88">
        <Icon src={plus24} size={24} />
        {table.addLabel}
      </div>
    </div>
  );
}
