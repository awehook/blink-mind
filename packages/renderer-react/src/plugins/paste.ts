export function PastePlugin() {
  let pasteType;
  return {
    setPasteType(ctx) {
      pasteType = ctx.pasteType;
    },
    getPasteType(ctx) {
      return pasteType;
    }
  }
}
