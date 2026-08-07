import { describe, expect, it } from "vitest";
import { FAQ_DATA, PARTNERSHIP_PROGRAMS, TESTIMONIALS_DATA } from "./landingData";

/**
 * Product-truth invariants (P4 Issue #40).
 *
 * These tests protect the public interface from describing capabilities
 * that are not implemented. If a capability is genuinely implemented in
 * the future, update the copy and these assertions together.
 */
describe("public product-truth invariants", () => {
  it("does not claim an active peer-support pilot in FAQ answers", () => {
    for (const faq of FAQ_DATA) {
      expect(faq.answer.toLowerCase()).not.toMatch(
        /pilot terbatas|skala pilot|saat ini dijalankan dalam skala/
      );
    }
  });

  it("does not reference a non-existent support directory in testimonial features", () => {
    for (const item of TESTIMONIALS_DATA) {
      expect(item.featureUsed).not.toMatch(/direktori/i);
    }
  });

  it("does not promise collective emotional-trend insight for partnerships", () => {
    for (const program of PARTNERSHIP_PROGRAMS) {
      expect(program.description.toLowerCase()).not.toMatch(
        /insight tren|tren kesehatan emosional kolektif/
      );
    }
  });
});
