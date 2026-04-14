/**
 * client.test.ts — Unit tests for src/lib/ai/client.ts
 *
 * Tests:
 * - getAnthropicClient throws when ANTHROPIC_API_KEY is missing
 * - getAnthropicClient returns a singleton
 * - Exported constants are correct
 */

import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";

describe("client constants", () => {
  it("should export correct MODELS", async () => {
    const { MODELS } = await import("./client");
    expect(MODELS.HAIKU).toBe("claude-haiku-4-5-20251001");
    expect(MODELS.SONNET).toBe("claude-sonnet-4-6");
  });

  it("should export DEFAULT_TEMPERATURE as 0", async () => {
    const { DEFAULT_TEMPERATURE } = await import("./client");
    expect(DEFAULT_TEMPERATURE).toBe(0);
  });

  it("should export MAX_TOKENS_CLASSIFY as 256", async () => {
    const { MAX_TOKENS_CLASSIFY } = await import("./client");
    expect(MAX_TOKENS_CLASSIFY).toBe(256);
  });

  it("should export MAX_TOKENS_ASSESS as 4096", async () => {
    const { MAX_TOKENS_ASSESS } = await import("./client");
    expect(MAX_TOKENS_ASSESS).toBe(4096);
  });
});

describe("getAnthropicClient", () => {
  const originalEnv = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    vi.resetModules();
    // Ensure module cache is cleared so singleton is reset
    vi.doUnmock("@/lib/ai/client");
  });

  afterEach(() => {
    vi.doUnmock("@/lib/ai/client");
    delete process.env.ANTHROPIC_API_KEY;
    // Restore original env
    if (originalEnv !== undefined) {
      process.env.ANTHROPIC_API_KEY = originalEnv;
    }
  });

  it("should throw when ANTHROPIC_API_KEY is not set", async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const { getAnthropicClient } = await import("./client");

    expect(() => getAnthropicClient()).toThrow(
      "ANTHROPIC_API_KEY is not set"
    );
  });

  it("should return an Anthropic client when API key is set", async () => {
    process.env.ANTHROPIC_API_KEY = "test-anthropic-key";

    const { getAnthropicClient } = await import("./client");

    const client = getAnthropicClient();
    expect(client).toBeDefined();
    // Verify it's an actual Anthropic client instance
    expect(typeof client.messages.create).toBe("function");
  });

  it("should return the same client instance on subsequent calls (singleton)", async () => {
    process.env.ANTHROPIC_API_KEY = "test-anthropic-key-2";

    const { getAnthropicClient } = await import("./client");

    const client1 = getAnthropicClient();
    const client2 = getAnthropicClient();
    expect(client1).toBe(client2);
  });
});
