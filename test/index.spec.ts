import { handleRequest } from "@/index";

test("should return 'OK'", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.status).toBe(200);
  expect(await res.text()).toContain("OK");
});
