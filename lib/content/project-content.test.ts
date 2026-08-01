import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildProjectDetails, serialize } from "../../qa/build-project-details.mjs";
import { PROJECTS } from "./projects";
import {
  PROJECT_DETAILS,
  getAllProjects,
  getNextProject,
  getProject,
  validateProjectDetails,
  type ProjectBlock,
} from "./project-content";

const contract = JSON.parse(readFileSync("qa/eng014c/reference-block-contract.json", "utf8")) as {
  routes: {
    slug: string;
    title: string;
    infoTags: string[];
    stats: { label: string; value: string }[];
    relatedSlug: string;
    blocks: {
      cls: string;
      surfaces: string[];
      index?: string;
      heading?: string;
      paragraphs?: string[];
    }[];
  }[];
};

const CONTRACT_BY_SLUG = new Map(contract.routes.map((route) => [route.slug, route]));

/* The only block classes the template knows how to render. Anything else in the
   data is an unsupported variant and must fail here rather than at request time. */
const SUPPORTED_BLOCK_CLASSES = new Set([
  "headerProjectBlock",
  "projectStatsBlock",
  "projectTitleQuoteBlock",
  "projectTwoImagesBlock",
  "projectTwoImagesBlock text",
  "projectTwoImagesBlock sqaures",
  "projectTextBlock",
  "projectFullWidthLoopBlock",
  "projectCreditsBlock",
  "projectRelatedBlock",
]);

const blockClasses = (slug: string) =>
  PROJECT_DETAILS.find((detail) => detail.slug === slug)?.blocks.map((block) => block.cls) ?? [];

const hasBlock = (slug: string, cls: string) => blockClasses(slug).includes(cls);

describe("project-detail route inventory", () => {
  it("carries exactly 21 unique project records", () => {
    expect(PROJECTS).toHaveLength(21);
    expect(new Set(PROJECTS.map((project) => project.slug)).size).toBe(21);
  });

  it("carries exactly 21 unique detail records that match the index", () => {
    expect(PROJECT_DETAILS).toHaveLength(21);
    expect(new Set(PROJECT_DETAILS.map((detail) => detail.slug)).size).toBe(21);
    expect(getAllProjects()).toHaveLength(21);

    for (const project of PROJECTS) {
      const merged = getProject(project.slug);
      expect(merged, `no detail record for ${project.slug}`).toBeDefined();
      expect(merged?.detail.title).toBe(project.title);
      expect(merged?.detail.infoTags[0]).toBe(project.year);
      expect(merged?.detail.infoTags[1]).toBe(project.sector);
    }
  });

  it("returns nothing for an unknown slug", () => {
    expect(getProject("not-a-project")).toBeUndefined();
    expect(getNextProject("not-a-project")).toBeUndefined();
  });
});

describe("audited block contract", () => {
  it("renders every route's blocks in the audited order", () => {
    for (const route of contract.routes) {
      expect(blockClasses(route.slug), route.slug).toEqual(route.blocks.map((b) => b.cls));
    }
  });

  it("uses only supported block classes", () => {
    for (const detail of PROJECT_DETAILS) {
      for (const block of detail.blocks) {
        expect(SUPPORTED_BLOCK_CLASSES.has(block.cls), `${detail.slug}: ${block.cls}`).toBe(true);
      }
    }
  });

  it("keeps the required per-route optional-variant matrix", () => {
    const squares = "projectTwoImagesBlock sqaures";
    const loop = "projectFullWidthLoopBlock";

    expect(hasBlock("oceanco-leviathan", squares)).toBe(true);
    expect(hasBlock("oceanco-leviathan", loop)).toBe(true);

    expect(hasBlock("broederliefde-rotterdam-ahoy", squares)).toBe(true);
    expect(hasBlock("broederliefde-rotterdam-ahoy", loop)).toBe(false);

    expect(hasBlock("salvia-bioelectronics", squares)).toBe(false);
    expect(hasBlock("salvia-bioelectronics", loop)).toBe(true);

    expect(hasBlock("ansu-fati-arriba-nutrition", squares)).toBe(false);
    expect(hasBlock("ansu-fati-arriba-nutrition", loop)).toBe(false);

    expect(hasBlock("madunia-brand-launch", squares)).toBe(false);
    expect(hasBlock("madunia-brand-launch", loop)).toBe(true);
  });

  it("gives every media block the surface count its geometry requires", () => {
    const expected: Record<string, number> = {
      headerProjectBlock: 1,
      projectTwoImagesBlock: 2,
      "projectTwoImagesBlock text": 2,
      "projectTwoImagesBlock sqaures": 2,
      projectFullWidthLoopBlock: 1,
      projectRelatedBlock: 1,
    };

    for (const detail of PROJECT_DETAILS) {
      for (const block of detail.blocks) {
        const count = expected[block.cls];
        if (count === undefined) continue;
        const surfaces = (block as Extract<ProjectBlock, { surfaces: unknown }>).surfaces;
        expect(surfaces, `${detail.slug}: ${block.cls}`).toHaveLength(count);
      }
    }
  });

  it("keeps narrative headings and indices verbatim from the reference", () => {
    for (const route of contract.routes) {
      const detail = PROJECT_DETAILS.find((d) => d.slug === route.slug);
      route.blocks.forEach((audited, position) => {
        const block = detail?.blocks[position] as {
          heading?: string;
          index?: string;
          paragraphs?: string[];
        };
        if (audited.heading) expect(block.heading, route.slug).toBe(audited.heading);
        if (audited.index) expect(block.index, route.slug).toBe(audited.index);
        if (audited.heading && "paragraphs" in block) {
          const body = block.paragraphs!.join(" ");
          expect(body.length, route.slug).toBeGreaterThan(0);
          /* Some routes open the narrative with the same words as its heading,
             so only a doubled heading proves the prefix was left in place. */
          expect(
            body.startsWith(`${audited.heading} ${audited.heading}`),
            `${route.slug} repeats the heading`,
          ).toBe(false);
          expect(body, route.slug).not.toMatch(/\[\s*\d+\s*]/);
        }
      });
    }
  });

  it("preserves the audited paragraph breaks in every narrative block", () => {
    let multiParagraph = 0;
    for (const route of contract.routes) {
      const detail = PROJECT_DETAILS.find((d) => d.slug === route.slug);
      route.blocks.forEach((audited, position) => {
        if (!audited.paragraphs?.length) return;
        const block = detail?.blocks[position] as { paragraphs?: string[] };
        expect(block.paragraphs, `${route.slug}: ${audited.cls}`).toEqual(audited.paragraphs);
        if (audited.paragraphs.length > 1) multiParagraph += 1;
      });
    }
    /* Collapsing these to one string is exactly the defect this replaces, so
       the fixture must actually contain multi-paragraph narratives. */
    expect(multiParagraph).toBeGreaterThan(0);
  });
});

describe("dynamic statistics", () => {
  it("preserves every audited metric label, value and order", () => {
    for (const route of contract.routes) {
      const detail = PROJECT_DETAILS.find((d) => d.slug === route.slug);
      expect(detail?.stats, route.slug).toEqual(route.stats);
      expect(detail?.stats.length, route.slug).toBeGreaterThan(0);
    }
  });

  it("represents three-, four- and five-metric routes", () => {
    const countFor = (slug: string) =>
      PROJECT_DETAILS.find((detail) => detail.slug === slug)?.stats.length;

    expect(countFor("madunia-brand-launch")).toBe(3);
    expect(countFor("oceanco-leviathan")).toBe(4);
    expect(countFor("ansu-fati-arriba-nutrition")).toBe(5);
    expect(countFor("srg-international-reeses")).toBe(5);
  });

  it("keeps route-specific metrics the fixed four-stat model used to drop", () => {
    const labelsFor = (slug: string) =>
      PROJECT_DETAILS.find((detail) => detail.slug === slug)?.stats.map((stat) => stat.label) ?? [];

    for (const slug of [
      "srg-international-reeses",
      "xxl-nutrition-festival-activations",
      "buddha-to-buddha-los-angeles",
      "ansu-fati-arriba-nutrition",
      "hotek-brand-video",
    ]) {
      expect(labelsFor(slug), slug).toContain("Products sold");
    }

    expect(labelsFor("de-hollandse-100-lymphco")).toContain("Donations raised");
    expect(
      PROJECT_DETAILS.find((detail) => detail.slug === "de-hollandse-100-lymphco")?.stats.find(
        (stat) => stat.label === "Donations raised",
      )?.value,
    ).toBe("€850.000+");
  });

  it("uses no metadata label the reference does not show", () => {
    const allowed = new Set([
      "Impressions",
      "Followers",
      "Products sold",
      "Donations raised",
      "Countries",
      "Engagements",
    ]);
    for (const detail of PROJECT_DETAILS) {
      for (const stat of detail.stats) {
        expect(allowed.has(stat.label), `${detail.slug}: ${stat.label}`).toBe(true);
      }
    }
    /* The reference header shows bare values, never "Year"/"Sector"/"Services". */
    for (const detail of PROJECT_DETAILS) {
      expect(detail.infoTags).toHaveLength(3);
      expect(detail.infoTags.join(" ")).not.toMatch(/\b(Year|Sector|Services)\b/);
    }
  });
});

describe("hero surfaces", () => {
  it("keeps the image-only hero state for the route audited without a hero video", () => {
    const porsche = PROJECT_DETAILS.find((d) => d.slug === "porsche-employer-branding");
    const header = porsche?.blocks[0] as Extract<ProjectBlock, { type: "header" }>;
    expect(header.surfaces[0].kind).toBe("image");
    expect(header.surfaces[0].videoId).toBeNull();
    expect(porsche?.heroVideoId).toBeNull();
  });

  it("matches every audited hero surface kind", () => {
    for (const route of contract.routes) {
      const detail = PROJECT_DETAILS.find((d) => d.slug === route.slug);
      const header = detail?.blocks[0] as Extract<ProjectBlock, { type: "header" }>;
      expect(header.surfaces[0].kind, route.slug).toBe(route.blocks[0].surfaces[0]);
      expect(header.surfaces[0].shape).toBe("wide");
    }
  });
});

describe("related-project cycle", () => {
  it("targets the audited next project on every route", () => {
    for (const route of contract.routes) {
      const detail = PROJECT_DETAILS.find((d) => d.slug === route.slug);
      expect(detail?.relatedNext, route.slug).toBe(route.relatedSlug);
      expect(getNextProject(route.slug)?.slug, route.slug).toBe(route.relatedSlug);
    }
  });

  it("closes as a single cycle covering all 21 routes and wrapping Madunia to Oceanco", () => {
    expect(getNextProject("madunia-brand-launch")?.slug).toBe("oceanco-leviathan");

    const visited = new Set<string>();
    let slug = "oceanco-leviathan";
    for (let step = 0; step < PROJECT_DETAILS.length; step += 1) {
      expect(visited.has(slug), `cycle revisits ${slug} early`).toBe(false);
      visited.add(slug);
      const next = getNextProject(slug);
      expect(next, `no next project for ${slug}`).toBeDefined();
      slug = next!.slug;
    }
    expect(visited.size).toBe(21);
    expect(slug).toBe("oceanco-leviathan");
  });

  it("points every related target at a real project", () => {
    const slugs = new Set(PROJECT_DETAILS.map((detail) => detail.slug));
    for (const detail of PROJECT_DETAILS) {
      expect(slugs.has(detail.relatedNext), `${detail.slug} -> ${detail.relatedNext}`).toBe(true);
      expect(detail.relatedNext).not.toBe(detail.slug);
      const related = detail.blocks.find((block) => block.type === "related");
      expect((related as Extract<ProjectBlock, { type: "related" }>).targetSlug).toBe(
        detail.relatedNext,
      );
    }
  });
});

describe("generator reproducibility", () => {
  it("regenerates the committed model byte-for-byte from its audited inputs", async () => {
    const raw = JSON.parse(readFileSync("qa/projects-data.json", "utf8"));
    const { details, mediaManifest } = buildProjectDetails(raw, contract);

    expect(await serialize(details, "lib/content/project-details.json")).toBe(
      readFileSync("lib/content/project-details.json", "utf8").replace(/\r\n/g, "\n"),
    );
    expect(await serialize(mediaManifest, "qa/project-media-manifest.json")).toBe(
      readFileSync("qa/project-media-manifest.json", "utf8").replace(/\r\n/g, "\n"),
    );
  });

  it("loses no audited route, block or metric from qa/projects-data.json", () => {
    const raw = JSON.parse(readFileSync("qa/projects-data.json", "utf8")) as {
      slug: string;
      blocks: { cls: string }[];
    }[];

    expect(raw).toHaveLength(21);
    for (const record of raw) {
      const detail = PROJECT_DETAILS.find((d) => d.slug === record.slug);
      expect(detail, `${record.slug} dropped from the model`).toBeDefined();
      expect(detail?.blocks.map((block) => block.cls)).toEqual(
        record.blocks.map((block) => block.cls.trim()),
      );
      expect(CONTRACT_BY_SLUG.has(record.slug), `${record.slug} missing from contract`).toBe(true);
    }
  });

  it("rejects an unsupported block variant", () => {
    const raw = structuredClone(JSON.parse(readFileSync("qa/projects-data.json", "utf8"))) as {
      blocks: { cls: string }[];
    }[];
    const mutated = structuredClone(contract);
    /* Both audited inputs agree on the new class, so only the variant check can
       reject it. */
    mutated.routes[0].blocks[3].cls = "projectThreeImagesBlock";
    raw[0].blocks[3].cls = "projectThreeImagesBlock";

    expect(() => buildProjectDetails(raw, mutated)).toThrow(/unsupported block class/);
  });

  it("rejects a media block whose audited surface count cannot be rendered", () => {
    const raw = JSON.parse(readFileSync("qa/projects-data.json", "utf8"));
    const mutated = structuredClone(contract);
    mutated.routes[0].blocks[3].surfaces = ["video"];

    expect(() => buildProjectDetails(raw, mutated)).toThrow(/audited surfaces, expected 2/);
  });

  it("rejects a contract whose block order drifts from the audited page", () => {
    const raw = JSON.parse(readFileSync("qa/projects-data.json", "utf8"));
    const mutated = structuredClone(contract);
    mutated.routes[0].blocks.reverse();

    expect(() => buildProjectDetails(raw, mutated)).toThrow(/do not match the contract/);
  });

  it("rejects a route with no audited page record", () => {
    const raw = JSON.parse(readFileSync("qa/projects-data.json", "utf8")).filter(
      (record: { slug: string }) => record.slug !== "htc",
    );

    expect(() => buildProjectDetails(raw, contract)).toThrow(/no audited page record/);
  });
});

/* A cast alone would let a malformed record reach the renderer, where an
   unsupported block type renders as a silently missing section. These prove the
   load-time validator turns each such record into a loud failure. */
describe("project-details.json runtime validation", () => {
  const clone = () => structuredClone(PROJECT_DETAILS) as unknown as Record<string, unknown>[];
  const mutate = (change: (data: Record<string, unknown>[]) => void) => {
    const data = clone();
    change(data);
    return () => validateProjectDetails(data);
  };

  it("accepts the committed model unchanged", () => {
    expect(() => validateProjectDetails(clone())).not.toThrow();
  });

  it("rejects a non-array payload", () => {
    expect(() => validateProjectDetails({ slug: "oceanco-leviathan" })).toThrow(
      /expected an array/,
    );
  });

  it("rejects an unsupported block class", () => {
    expect(
      mutate((data) => {
        (data[0].blocks as { cls: string }[])[3].cls = "projectThreeImagesBlock";
      }),
    ).toThrow(/unsupported block class "projectThreeImagesBlock"/);
  });

  it("rejects a block whose type disagrees with its class", () => {
    expect(
      mutate((data) => {
        (data[0].blocks as { type: string }[])[1].type = "fullLoop";
      }),
    ).toThrow(/requires type "stats"/);
  });

  it("rejects an unsupported surface shape", () => {
    expect(
      mutate((data) => {
        (data[0].blocks as { surfaces?: { shape: string }[] }[])[0].surfaces![0].shape = "diamond";
      }),
    ).toThrow(/unsupported shape "diamond"/);
  });

  it("rejects an unsupported surface kind", () => {
    expect(
      mutate((data) => {
        (data[0].blocks as { surfaces?: { kind: string }[] }[])[0].surfaces![0].kind = "audio";
      }),
    ).toThrow(/unsupported kind "audio"/);
  });

  it("rejects a media block with the wrong surface count", () => {
    expect(
      mutate((data) => {
        const blocks = data[0].blocks as { cls: string; surfaces?: unknown[] }[];
        const pair = blocks.find((block) => block.cls === "projectTwoImagesBlock")!;
        pair.surfaces = pair.surfaces!.slice(0, 1);
      }),
    ).toThrow(/needs 2 surface\(s\), got 1/);
  });

  it("rejects an image surface that still carries a video id", () => {
    expect(
      mutate((data) => {
        const porsche = data.find((record) => record.slug === "porsche-employer-branding")!;
        (porsche.blocks as { surfaces?: { videoId: string | null }[] }[])[0].surfaces![0].videoId =
          "1196251480";
      }),
    ).toThrow(/image surfaces must not carry a videoId/);
  });

  it("rejects a narrative block with no paragraphs", () => {
    expect(
      mutate((data) => {
        const blocks = data[0].blocks as { type: string; paragraphs?: string[] }[];
        blocks.find((block) => block.type === "text")!.paragraphs = [];
      }),
    ).toThrow(/needs a non-empty paragraphs array/);
  });

  it("rejects a duplicate slug", () => {
    expect(
      mutate((data) => {
        data.push(structuredClone(data[0]));
      }),
    ).toThrow(/duplicate slug/);
  });

  it("rejects a related target that is not a known route", () => {
    expect(
      mutate((data) => {
        data[0].relatedNext = "no-such-project";
      }),
    ).toThrow(/is not a known route/);
  });

  it("rejects a related block whose target disagrees with relatedNext", () => {
    expect(
      mutate((data) => {
        const blocks = data[0].blocks as { type: string; targetSlug?: string }[];
        blocks.find((block) => block.type === "related")!.targetSlug = "htc";
      }),
    ).toThrow(/targetSlug disagrees with relatedNext/);
  });

  it("rejects an empty statistics array", () => {
    expect(
      mutate((data) => {
        data[0].stats = [];
      }),
    ).toThrow(/stats must be a non-empty array/);
  });
});

describe("quote narrative paragraphs", () => {
  it("stores every audited quote paragraph separately", () => {
    for (const route of contract.routes) {
      const detail = PROJECT_DETAILS.find((d) => d.slug === route.slug);
      route.blocks.forEach((audited, position) => {
        if (audited.cls !== "projectTitleQuoteBlock" || !audited.paragraphs?.length) return;
        const block = detail?.blocks[position] as { paragraphs?: string[] };
        expect(block.paragraphs, route.slug).toEqual(audited.paragraphs);
      });
    }
  });

  it("keeps a multi-paragraph quote as distinct paragraphs through validation", () => {
    const data = structuredClone(PROJECT_DETAILS) as unknown as Record<string, unknown>[];
    const blocks = data[0].blocks as { type: string; paragraphs?: string[] }[];
    const quote = blocks.find((block) => block.type === "quote")!;
    quote.paragraphs = ["First audited sentence.", "Second audited sentence."];

    const validated = validateProjectDetails(data);
    const stored = validated[0].blocks.find((block) => block.type === "quote") as {
      paragraphs: string[];
    };
    /* Two audited paragraphs must stay two. Collapsing them into one string is
       exactly the reflow defect this item removed elsewhere. */
    expect(stored.paragraphs).toHaveLength(2);
    expect(stored.paragraphs.join(" ")).not.toBe(stored.paragraphs[0]);
  });
});
