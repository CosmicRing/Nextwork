import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onLoad(this: RuntimePage): void;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
  onMajorInput(this: RuntimePage, event: { detail: { value: string } }): void;
  prefillEvidenceDraftFromTask(this: RuntimePage, event: { currentTarget: { dataset: { taskTitle: string } } }): void;
};

function read(relativePath: string) {
  return readFileSync(relativePath, "utf8");
}

function loadSampleData() {
  const sandbox = {
    module: { exports: {} as Record<string, unknown> },
    exports: {} as Record<string, unknown>,
  };
  vm.runInNewContext(read("miniprogram/utils/sample-data.js"), sandbox, {
    filename: "miniprogram/utils/sample-data.js",
  });
  return sandbox.module.exports as Record<string, unknown>;
}

const pageScript = read("miniprogram/pages/index/index.js");
for (const token of ["getEvidenceEntryByTaskTitle", "prefillEvidenceDraftFromTask"]) {
  assert.ok(pageScript.includes(token), `index page should expose source task runway helper ${token}`);
}

const markup = read("miniprogram/pages/index/index.wxml");
const runwayIndex = markup.indexOf('class="source-task-runway rescue-task-list"');
const sourceLadderIndex = markup.indexOf('class="source-ladder-panel"');
const entryGridIndex = markup.indexOf('class="rescue-entry-grid"');
const inboxIndex = markup.indexOf('class="evidence-inbox-panel"');

assert.ok(runwayIndex > -1, "ordinary-school rescue should render a front-loaded source task runway");
assert.ok(sourceLadderIndex > runwayIndex, "source task runway should appear before the authority ladder");
assert.ok(entryGridIndex > runwayIndex, "source task runway should appear before the entrance grid");
assert.ok(inboxIndex > runwayIndex, "source task runway should appear before the evidence inbox");

for (const token of [
  "source-task-card",
  "evidenceProgress",
  'data-task-title="{{item.title}}"',
  'bindtap="prefillEvidenceDraftFromTask"',
  "source-task-primary-action",
]) {
  assert.ok(markup.includes(token), `source task runway markup should include ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [
  ".source-task-runway",
  ".source-task-card",
  ".source-task-index",
  ".source-task-actions",
  ".source-task-primary-action",
]) {
  assert.ok(styles.includes(token), `source task runway styles should include ${token}`);
}

const sampleData = loadSampleData();
let capturedPage: IndexPageConfig | undefined;

vm.runInNewContext(
  pageScript,
  {
    require(specifier: string) {
      if (specifier === "../../utils/sample-data") return sampleData;
      throw new Error(`unexpected require: ${specifier}`);
    },
    Page(config: IndexPageConfig) {
      capturedPage = config;
    },
    wx: {
      getStorageSync() {
        return undefined;
      },
      setStorageSync() {},
      setClipboardData() {},
      showToast() {},
    },
  },
  { filename: "miniprogram/pages/index/index.js" },
);

assert.ok(capturedPage, "index page should register through Page()");

const page: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理学" } });

capturedPage.prefillEvidenceDraftFromTask.call(page, {
  currentTarget: { dataset: { taskTitle: "抓企业" } },
});

const campusTemplate = String(page.data.evidenceDraftText);
assert.ok(campusTemplate.includes("证据槽：到校招聘"), "campus task should prefill the campus recruiting evidence template");
assert.ok(campusTemplate.includes("郑州工商学院"), "task template should keep the current school name");
assert.ok(campusTemplate.includes("护理学"), "task template should keep the current major name");
assert.equal((page.data.evidenceInboxItems as unknown[]).length, 0, "prefilling from a task must not save evidence");

capturedPage.prefillEvidenceDraftFromTask.call(page, {
  currentTarget: { dataset: { taskTitle: "补薪资" } },
});
assert.ok(String(page.data.evidenceDraftText).includes("证据槽：岗位薪资"), "salary task should prefill the salary evidence template");

console.log("Mini program source task runway verified.");
