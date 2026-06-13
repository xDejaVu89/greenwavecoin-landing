import { describe, it, expect } from "vitest";
import { generateReferralCode } from "./db";

describe("Referral System", () => {
  describe("generateReferralCode", () => {
    it("generates an 8-character code", () => {
      const code = generateReferralCode();
      expect(code).toHaveLength(8);
    });

    it("generates codes with only allowed characters (no confusable chars)", () => {
      const ALLOWED = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/;
      for (let i = 0; i < 100; i++) {
        const code = generateReferralCode();
        expect(code).toMatch(ALLOWED);
        // Should not contain confusable characters
        expect(code).not.toContain("0");
        expect(code).not.toContain("O");
        expect(code).not.toContain("1");
        expect(code).not.toContain("I");
      }
    });

    it("generates unique codes across multiple calls", () => {
      const codes = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        codes.add(generateReferralCode());
      }
      // With 1000 codes from a 32^8 space, expect near-perfect uniqueness
      expect(codes.size).toBeGreaterThan(990);
    });

    it("generates codes that are uppercase", () => {
      for (let i = 0; i < 50; i++) {
        const code = generateReferralCode();
        expect(code).toBe(code.toUpperCase());
      }
    });
  });

  describe("Referral URL format", () => {
    it("referral link format is correct", () => {
      const code = "ABC12345";
      const origin = "https://greenwavecoin.com";
      const link = `${origin}/?ref=${code}`;
      expect(link).toBe("https://greenwavecoin.com/?ref=ABC12345");
    });

    it("URL param ref is properly read", () => {
      const url = new URL("https://greenwavecoin.com/?ref=ABC12345");
      const ref = url.searchParams.get("ref");
      expect(ref).toBe("ABC12345");
    });
  });
});
