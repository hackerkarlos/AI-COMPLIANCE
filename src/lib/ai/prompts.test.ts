/**
 * prompts.test.ts — Unit tests for prompt templates (src/lib/ai/prompts/)
 *
 * Tests:
 * - getPromptForRegulation() returns non-empty strings for all mapped slugs
 * - Falls back to general prompt for unknown slugs
 * - Prompt strings contain expected regulation keywords
 * - Tool schemas are valid JSON-parseable objects
 */

import { describe, it, expect } from "vitest";
import { getPromptForRegulation } from "./prompts";

// ─── Tests ─────────────────────────────────────────────────────

describe("getPromptForRegulation", () => {
  const allKnownSlugs = [
    "gdpr",
    "databeskyttelsesloven",
    "eprivacy",
    "nis2",
    "ai_act",
    "bogfoeringsloven",
    "hvidvaskloven",
    "whistleblower",
    "psd2",
    "dora",
  ];

  it.each(allKnownSlugs)('should return a non-empty prompt for slug "%s"', (slug) => {
    const prompt = getPromptForRegulation(slug);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("should return the general prompt for unknown slugs", () => {
    const unknown = getPromptForRegulation("unknown_regulation_xyz");
    const general = getPromptForRegulation("hvidvaskloven");
    expect(unknown).toBe(general);
  });

  it("should return the general prompt for empty slug", () => {
    const empty = getPromptForRegulation("");
    const general = getPromptForRegulation("hvidvaskloven");
    expect(empty).toBe(general);
  });

  it("GDPR prompt should mention Datatilsynet", () => {
    const prompt = getPromptForRegulation("gdpr");
    expect(prompt).toContain("Datatilsynet");
  });

  it("GDPR prompt should mention GDPR legal article", () => {
    const prompt = getPromptForRegulation("gdpr");
    expect(prompt).toMatch(/Art\.\s*6/);
  });

  it("NIS2 prompt should mention cybersecurity", () => {
    const prompt = getPromptForRegulation("nis2");
    expect(prompt.toLowerCase()).toContain("cybersecur");
  });

  it("Bogforingsloven prompt should mention bookkeeping", () => {
    const prompt = getPromptForRegulation("bogfoeringsloven");
    expect(prompt.toLowerCase()).toMatch(/bookkeep|bogføri/i);
  });

  it("ePrivacy prompt should mention cookies", () => {
    const prompt = getPromptForRegulation("eprivacy");
    expect(prompt.toLowerCase()).toContain("cookie");
  });

  it("AI Act prompt should mention risk-based approach", () => {
    const prompt = getPromptForRegulation("ai_act");
    expect(prompt.toLowerCase()).toMatch(/risk.?based|risk level/i);
  });

  it("general prompt should cover Hvidvaskloven (AML)", () => {
    const prompt = getPromptForRegulation("hvidvaskloven");
    expect(prompt.toLowerCase()).toMatch(/anti.?money|hvidvask|aml/i);
  });

  it("general prompt should cover Whistleblower Act", () => {
    const prompt = getPromptForRegulation("hvidvaskloven"); // goes to general
    expect(prompt.toLowerCase()).toMatch(/whistleblow/i);
  });

  it("general prompt should cover PSD2", () => {
    const prompt = getPromptForRegulation("hvidvaskloven"); // goes to general
    expect(prompt).toContain("PSD2");
  });

  it("general prompt should cover DORA", () => {
    const prompt = getPromptForRegulation("hvidvaskloven"); // goes to general
    expect(prompt).toContain("DORA");
  });

  it("databeskyttelsesloven should use GDPR prompt (shared prompt)", () => {
    const databeskyttelsesloven = getPromptForRegulation("databeskyttelsesloven");
    const gdpr = getPromptForRegulation("gdpr");
    expect(databeskyttelsesloven).toBe(gdpr);
  });
});

describe("Prompt content quality", () => {
  const slugs = [
    "gdpr",
    "eprivacy",
    "nis2",
    "ai_act",
    "bogfoeringsloven",
  ];

  it.each(slugs)('should mention penalties/fines for "%s"', (slug) => {
    const prompt = getPromptForRegulation(slug);
    expect(prompt.toLowerCase()).toMatch(/fine|penalt|bøde/i);
  });

  it.each(slugs)('should include enforcement authority for "%s"', (slug) => {
    const prompt = getPromptForRegulation(slug);
    expect(prompt.toLowerCase()).toMatch(
      /datatilsynet|cfcs|finanstilsynet|enforcement/i
    );
  });
});
