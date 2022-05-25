const html = /* html */ `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lorem</title>
  </head>
  <body style="margin: 0 auto; max-width: 42rem;">
    <h1>HTMLRewriter text chunk demo</h1>

    <p>Each instance of "REPLACED" in the following is the result of a rewrite:</p>

    <pre style="white-space: pre-line;">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin est nisl, laoreet in facilisis eget, varius ut neque. Praesent eu lacinia mi, eget vulputate nunc. Ut posuere pharetra odio in dignissim. Nulla ullamcorper pharetra vehicula. Nulla congue elit quis imperdiet eleifend. Cras luctus scelerisque leo ac viverra. Maecenas facilisis sagittis aliquet. Ut sodales ultricies est sed fermentum. Proin efficitur aliquet diam, ut efficitur massa maximus eu. Suspendisse dapibus nulla quis nunc bibendum, sit amet hendrerit nunc fringilla. Aliquam eleifend sit amet leo nec dignissim. Sed mattis enim ac nisi vulputate sollicitudin. In hac habitasse platea dictumst.

    Phasellus scelerisque rutrum posuere. Mauris congue, est non tincidunt pulvinar, orci erat fermentum eros, vehicula commodo nisi diam et lacus. Praesent magna tellus, porta ac augue ut, laoreet maximus dui. Fusce id diam in arcu pretium luctus vitae volutpat nisi. Duis at nulla vulputate, mattis massa quis, dapibus nulla. Nam mattis pellentesque commodo. Donec cursus rutrum lorem in maximus. Proin tincidunt et odio quis sagittis. Donec ex magna, vehicula nec ipsum fringilla, consectetur auctor sem. Curabitur porttitor, sapien nec porta fermentum, ex metus pretium neque, eget ornare magna mi sed lacus. Vivamus laoreet condimentum erat quis lobortis. Fusce congue risus non pharetra malesuada. Proin in consequat lorem. Proin sed euismod ex, vel efficitur metus. Proin in quam hendrerit, fermentum mi nec, mattis nunc.

    Nulla ultrices odio nec lectus fringilla, vel tempor felis tempus. Ut accumsan nibh a rhoncus dapibus. Phasellus in ex eu nunc aliquam semper sed at metus. Nullam imperdiet nisl urna. Sed convallis massa sit amet sem gravida dictum. Morbi sit amet elementum odio, nec blandit nibh. Donec gravida, nibh quis sagittis aliquet, purus purus gravida tortor, at ultrices risus tellus ut eros. Vivamus pellentesque cursus nibh a condimentum. Nulla tempus cursus sem at dapibus. Duis porta felis ac pellentesque molestie. Duis eget interdum eros. In a nibh lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    </pre>
  </body>
</html>
`;

const searchPattern = /\bnulla\b/gi;
const substitute = "REPLACED";

export class ElementHandler implements HTMLRewriterElementContentHandlers {
  chunkIndex: number;
  textState: String;

  constructor() {
    this.chunkIndex = 0;
    this.textState = "";
  }

  /** https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/#text-chunks */
  text(text: Text) {
    console.log(`🟠 ${this.chunkIndex}:`, `"${text.text}"`);

    // capture all the text content as it streams in
    this.textState += text.text;

    // remove each chunk while we have access to it
    text.remove();

    // replace the content once we've got the complete text content
    if (text.lastInTextNode) {
      // > [text.text is] empty if the chunk is the last chunk of the text node.
      // https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/#properties-1
      console.log("🟢 complete:", `"${this.textState}"`);

      const updated = this.textState.replace(searchPattern, substitute);
      console.log("🟣 updated:", `"${updated}"`);

      // replace only the last chunk, which is always empty
      text.replace(updated);
    }

    this.chunkIndex++;
  }
}

export async function handleRequest(request: Request, env: Bindings) {
  // this would usually be a fetch from origin...
  const response = new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  });

  return new HTMLRewriter().on("pre", new ElementHandler()).transform(response);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };
export default worker;
