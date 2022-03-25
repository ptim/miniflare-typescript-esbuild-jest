let divcontent = "";
let exclude = false;
const html = `
<!DOCTYPE html>
<body>
  <h1>Hello World</h1>
  <div class="exclude">8888888</div>
  <div>ac46e98a4</div>
  <div>58b248a61</div>
  <div>032a22d17</div>
</body>
`;

class Rewriter1 extends HTMLRewriter {
  element(element: Element) {
    if (element.getAttribute("class")) {
      exclude = true;
    }
  }
}
class Rewriter2 extends HTMLRewriter {
  text(text: Text) {
    if (!text.lastInTextNode && !exclude) {
      divcontent = text.text;
    }
  }
}
class Rewriter3 extends HTMLRewriter {
  element(element: Element) {
    element.setAttribute("id", divcontent);
  }
}

const rewriter = new HTMLRewriter()
  .on("div", new Rewriter1())
  .on("div", new Rewriter2())
  .on("div", new Rewriter3());

/**
 * I am trying to pull content (text) from an (element) and put it as id of the
 * element, along with some exclusions i.e. if class does not exists Possible? I
 * know there is a workaround to push it in the global array and then search
 * replace the body content. But wondering if its doable with HTMLRewriter?
 * https://discord.com/channels/595317990191398933/846453104382836766/956805411594448937
 */
export async function handleRequest(request: Request, env: Bindings) {
  const res = new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });
  const newres = rewriter.transform(res);
  return new Response(newres.body, res);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

export default worker;
