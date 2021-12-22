import { buildResponse } from "@/response";
import { jest } from "@jest/globals";

jest.mock("@/response");

test("should build response", async () => {
  const res = buildResponse("text");
  expect(res.status).toBe(200);
  expect(res.headers.get("Content-Type")).toBe("text/html; charset=UTF-8");
  expect(await res.text()).toContain("<h1>text</h1>");
});

test("should build response with custom status", () => {
  const res = buildResponse("not found", 404);
  expect(res.status).toBe(404);
});

/**
 ● should spy on buildResponse

 expect(received).toHaveBeenCalledTimes(expected)

 Matcher error: received value must be a mock or spy function

 Received has type:  function
 Received has value: [Function buildResponse]

   17 |
   18 | test("should spy on buildResponse", async () => {
 > 19 |   expect(buildResponse).toHaveBeenCalledTimes(0);
      |                         ^
   20 |
   21 |   const res = buildResponse("not found", 404);
   22 |   expect(res.status).toBe(404);

   at ensureMockOrSpy (node_modules/expect/build/spyMatchers.js:1294:11)
   at Object.<anonymous> (test/response.spec.ts:19:25)
*/
test("should spy on buildResponse", async () => {
  expect(buildResponse).toHaveBeenCalledTimes(0);

  const res = buildResponse("not found", 404);
  expect(res.status).toBe(404);

  expect(buildResponse).toHaveBeenCalledTimes(1);
});

/**
  With proper typing, eg:
  https://www.benmvp.com/blog/using-jest-mock-functions-typescript/

  ● should spy with typed mock

  expect(received).toHaveBeenCalledTimes(expected)

  Matcher error: received value must be a mock or spy function

  Received has type:  function
  Received has value: [Function buildResponse]

    33 |     typeof buildResponse
    34 |   >;
  > 35 |   expect(mockBuildResponse).toHaveBeenCalledTimes(0);
       |                             ^
    36 |
    37 |   const res = mockBuildResponse("not found", 404);
    38 |   expect(res.status).toBe(404);

    at ensureMockOrSpy (node_modules/expect/build/spyMatchers.js:1294:11)
    at Object.<anonymous> (test/response.spec.ts:35:29)
 */
test("should spy with typed mock", async () => {
  const mockBuildResponse = buildResponse as jest.MockedFunction<
    typeof buildResponse
  >;
  expect(mockBuildResponse).toHaveBeenCalledTimes(0);

  const res = mockBuildResponse("not found", 404);
  expect(res.status).toBe(404);

  expect(mockBuildResponse).toHaveBeenCalledTimes(1);
});
