export async function onRequestGet(ctx) {
  var path = new URL(ctx.request.url).pathname.replace("/t/p/", "");
  if (path.endsWith("/")) {
    path = path + "index.html";
  }
  const file = await ctx.env.MEDIA.get(path);
  console.log(`URL ${context.request.url} became path: ${path}`);

  if (!file) return new Response(null, { status: 404 });
  return new Response(file.body, {
    headers: { "Content-Type": file.httpMetadata.contentType },
  });
}
