import { getResponse } from "./helpers/getResponse";

test(`should run a test via mf.dispatchFetch with handler defined as a global`, async () => {
  async function handleRequest() {
    expect(true).toBeTruthy(); // just ensure that we've got the expected number of assertions
    return new Response("OK");
  }

  let result;
  try {
    result = await getResponse(handleRequest, "http://localhost:8787/");
  } catch (error) {
    // Jest is failing to compile:
    // > Jest failed to parse a file.

    // Actually trying to repro:
    // > FetchError [ERR_RESPONSE_TYPE]: Fetch handler didn't respond with a Response object.
    // when using mf.dispatchFetch with {script, globals}
    console.error(error);
  }
  expect(result?.status).toBe(200);
  expect(result?.headers.get("content-type")).toContain("text/plain");

  const text = await result?.text();
  expect(text).toContain("OK");
  expect.assertions(4);
});
