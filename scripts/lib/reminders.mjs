import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const REMINDER_LISTS = [
  "Work",
  "Work - Inbox",
  "Claude",
  "Personal Finance & Bills",
  "Business FInance & Bills",
  "Personal Inbox",
  "Medical",
  "General Inbox",
  "To Do Sweep",
];

const LIST_TO_GROUP = {
  Work: "Work",
  "Work - Inbox": "Work",
  Claude: "Work",
  "Personal Finance & Bills": "Money",
  "Business FInance & Bills": "Money",
  "Personal Inbox": "Personal",
  Medical: "Personal",
  "General Inbox": "People to come back to",
};

export function isFragment(text) {
  const value = String(text || "").trim();
  if (!value) return true;
  if (value.length > 140) return true;
  if (/https?:\/\//i.test(value)) return true;
  if (/^(ok|okay|yes|no|thanks|lol|yeah)\b/i.test(value) && value.length < 24) return true;
  return false;
}

export function groupsFromReminders(rows, previousGroups = []) {
  const byName = {
    Work: [],
    "Deals in flight": [],
    Money: [],
    "People to come back to": [],
    Personal: [],
  };
  const previousDeals = (previousGroups || []).find((group) => group.name === "Deals in flight");
  if (previousDeals?.items?.length) byName["Deals in flight"] = previousDeals.items;

  let sweepTotal = 0;
  let sweepReal = 0;
  for (const row of rows || []) {
    if (row.list === "To Do Sweep") {
      sweepTotal += 1;
      if (!isFragment(row.text)) sweepReal += 1;
      continue;
    }
    const group = LIST_TO_GROUP[row.list];
    if (!group || !row.text) continue;
    if (group !== "Work" && isFragment(row.text) && !row.due) continue;
    byName[group].push({ due: row.due || "", text: row.text });
  }

  return {
    groups: Object.entries(byName).map(([name, items]) => ({ name, items })),
    sweep: {
      open_total: sweepTotal,
      real_tasks: sweepReal,
      untriaged_fragments: Math.max(0, sweepTotal - sweepReal),
    },
  };
}

export async function readReminders({ exec = execFileAsync } = {}) {
  if (process.platform !== "darwin") return null;
  const script = `
    set out to ""
    tell application "Reminders"
      repeat with listName in {"Work", "Work - Inbox", "Claude", "Personal Finance & Bills", "Business FInance & Bills", "Personal Inbox", "Medical", "General Inbox", "To Do Sweep"}
        try
          set theList to list (listName as text)
          set theNames to name of reminders of theList whose completed is false
          repeat with n in theNames
            set out to out & listName & "\t" & n & linefeed
          end repeat
        end try
      end repeat
    end tell
    return out
  `;
  try {
    const { stdout } = await exec("osascript", ["-e", script], { timeout: 60000 });
    return String(stdout || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const tab = line.indexOf("\t");
        if (tab < 0) return { list: "To Do Sweep", text: line, due: "" };
        return { list: line.slice(0, tab), text: line.slice(tab + 1), due: "" };
      });
  } catch {
    return null;
  }
}
