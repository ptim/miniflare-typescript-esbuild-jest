declare global {
  /** globalThis.MINIFLARE is true if we're in running in miniflare in dev */
  var MINIFLARE: true | undefined;

  function getMiniflareBindings(): Bindings;
  function getMiniflareDurableObjectStorage(
    id: DurableObjectId
  ): Promise<DurableObjectStorage>;
}

export {};
