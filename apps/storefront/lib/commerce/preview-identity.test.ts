import { it, expect, vi, afterEach } from "vitest";
import { createPreviewIdentity } from "./preview-identity";
afterEach(() => vi.unstubAllEnvs());
it("simulates single-use code, cooldown and does not verify in production", async () => {
  vi.stubEnv("NODE_ENV", "development");
  let time = 0;
  const port = createPreviewIdentity(() => time);
  const c = await port.request("+994501234567");
  expect(c).not.toBeNull();
  expect(await port.request("+994501234567")).toBeNull();
  expect(await port.verify(c!.id, "000000")).toEqual({
    kind: "error",
    code: "INVALID",
  });
  expect(await port.verify(c!.id, "123456")).toEqual({ kind: "preview" });
  expect((await port.verify(c!.id, "123456")).kind).toBe("error");
  vi.stubEnv("NODE_ENV", "production");
  expect(await port.request("+994501234567")).toBeNull();
  time = 1000000;
  expect((await port.verify(c!.id, "123456")).kind).toBe("error");
});
it("expires challenges and locks after five failed attempts", async () => {
  vi.stubEnv("NODE_ENV", "development");
  let time = 0;
  const port = createPreviewIdentity(() => time);
  let c = await port.request("+994501234567");
  for (let i = 0; i < 5; i++) await port.verify(c!.id, "000000");
  expect(await port.verify(c!.id, "123456")).toEqual({
    kind: "error",
    code: "LOCKED",
  });
  time = 31000;
  c = await port.request("+994501234567");
  time += 120001;
  expect(await port.verify(c!.id, "123456")).toEqual({
    kind: "error",
    code: "EXPIRED",
  });
});
