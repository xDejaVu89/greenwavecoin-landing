import { describe, it, expect } from "vitest";
import { Resend } from "resend";

describe("Resend API key", () => {
  it("should be configured and able to reach the Resend API", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be set").toBeTruthy();
    expect(apiKey!.startsWith("re_"), "RESEND_API_KEY must start with re_").toBe(true);

    // Validate the key by listing domains (lightweight read-only call)
    const resend = new Resend(apiKey);
    const { data, error } = await resend.domains.list();

    expect(error, `Resend API error: ${JSON.stringify(error)}`).toBeNull();
    expect(data).toBeDefined();
  });
});
