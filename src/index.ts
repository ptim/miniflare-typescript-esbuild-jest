type State = Record<number, ElementBones>;
type ElementBones = {
  tagName: string;
  id: string;
  className: string;
  textContent: string;
  skip: boolean;
};

const html = `
<!DOCTYPE html>
<body>
  <h1>Hello World</h1>

  <div class="0 skip">skip</div>
  <div class="1">a</div>
  <div class="2">b</div>
  <div class="3">c</div>

  <hr style="display: none;" />
</body>
`;

const createScraper = (state: State, i: number) => ({
  element(el: Element) {
    // scrape the element...
    if (!state[i])
      state[i] = {
        tagName: el.tagName,
        id: el.getAttribute("id") ?? "",
        className: (el.getAttribute("class") ?? "").trim(),
        textContent: "",
        skip: (el.getAttribute("class") ?? "").includes("skip"),
      };
    console.log(`[1] ${i}: ${el.tagName}.${el.getAttribute("class") ?? "-"}`);
    // ...then remove it
    el.remove();
  },

  text(text: Text) {
    // capture all the text iteratively
    state[i].textContent += text.text;
    console.log(`[1] ${i}:    "${text.text}"`);

    // increment after capturing the last text node
    if (text.lastInTextNode) {
      console.log(`[1] ${i}:    ${JSON.stringify(state[i])}\n`);
      i++;
    }
  },
});

const createWriter = (state: State, i: number) => ({
  element(el: Element) {
    console.log(`[2] ${i}: ${el.tagName}\n`);

    // 're-hydrate' our scraped elements, mutate to taste
    const newDivs = Object.entries(state)
      .filter(([i, div]) => !div.skip)
      .map(
        ([i, { tagName, id, className, textContent }]) =>
          `<${tagName} id="${textContent}" class="${className}">${textContent}</${tagName}>`
      );
    // append to div#mount as HTML
    el.after(newDivs.join(""), { html: true });
  },
});

/**
 * I am trying to pull content (text) from an (element) and put it as id of the
 * element, along with some exclusions i.e. if class does not exists
 * Possible? I know there is a workaround to push it in the global array and then search
 * replace the body content. But wondering if its doable with HTMLRewriter?
 * https://discord.com/channels/595317990191398933/846453104382836766/956805411594448937
 */
export async function handleRequest(request: Request, env: Bindings) {
  const res = new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });

  let i = 0;
  let state: State = {};

  // These handlers are only registered now, not executed. Order is respected
  const rewriter = new HTMLRewriter()
    .on("div", createScraper(state, i))
    .on("hr", createWriter(state, i));

  // the transform is executed here (obv!)
  const newres = rewriter.transform(res);
  return new Response(newres.body, res);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };
export default worker;
