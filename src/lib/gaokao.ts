import type { GaokaoProfile, Job, MajorPath, StartupTrack } from "../types";
import { topEntries } from "./analysis";

export function scoreMajorPaths(paths: MajorPath[], profile: GaokaoProfile, tracks: StartupTrack[]) {
  const selected = new Set(profile.traits);

  return paths
    .map((path) => {
      const traitScore = path.fitTraits.reduce((score, trait) => score + (selected.has(trait) ? 14 : 0), 0);
      const relatedTrackScore = tracks
        .filter((track) => track.relatedMajors.some((major) => path.majors.includes(major)))
        .reduce((score, track) => score + Math.min(12, Math.round(track.heat / 10)), 0);
      const score = Math.min(98, 28 + traitScore + relatedTrackScore);

      return {
        ...path,
        score,
        matchedTraits: path.fitTraits.filter((trait) => selected.has(trait)),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function scoreStartupTracks(tracks: StartupTrack[], profile: GaokaoProfile) {
  const selected = new Set(profile.traits);

  return tracks
    .map((track) => {
      const traitScore = track.fitTraits.reduce((score, trait) => score + (selected.has(trait) ? 10 : 0), 0);
      const score = Math.min(99, Math.round(track.heat * 0.58 + traitScore));
      return {
        ...track,
        score,
        matchedTraits: track.fitTraits.filter((trait) => selected.has(trait)),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getEmploymentSignals(jobs: Job[]) {
  const directionCounts = new Map<string, number>();
  const requirementCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();

  jobs.forEach((job) => {
    directionCounts.set(job.direction, (directionCounts.get(job.direction) ?? 0) + 1);
    categoryCounts.set(job.category, (categoryCounts.get(job.category) ?? 0) + 1);
    job.requirements.forEach((requirement) => {
      requirementCounts.set(requirement, (requirementCounts.get(requirement) ?? 0) + 1);
    });
  });

  return {
    directions: topEntries(directionCounts, 4).map(([name]) => name),
    requirements: topEntries(requirementCounts, 8).map(([name]) => name),
    categories: topEntries(categoryCounts, 4).map(([name]) => name),
  };
}

export function getFourYearPlan(path: MajorPath) {
  return [
    {
      year: "大一",
      title: "验证兴趣，不急着锁死方向",
      items: path.firstYearPlan,
    },
    {
      year: "大二",
      title: "补齐专业硬课和一个可展示项目",
      items: ["进入实验室或项目组", `围绕 ${path.coreAbilities.slice(0, 3).join(" / ")} 做作品`, "开始找真实岗位 JD 对照差距"],
    },
    {
      year: "大三",
      title: "用实习、竞赛或创业 Demo 换反馈",
      items: ["投递目标方向实习", `选择一个创业路线：${path.startupRoutes.slice(0, 2).join(" 或 ")}`, "形成简历、作品集和复盘文档"],
    },
    {
      year: "大四",
      title: "分流到就业、保研、出国或创业验证",
      items: ["用岗位要求反推最后一轮补课", "集中面试或申请", "保留一个能持续迭代的项目资产"],
    },
  ];
}
