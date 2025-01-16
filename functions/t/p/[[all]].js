export async function onRequestGet(ctx) {
  var path = new URL(ctx.request.url).pathname.replace("/t/p", "");

  path = path.replace(/^\/+/, "");

  if (path == "") {
    console.log("${path} is empty");
    path = "index.html";
  }

  if (path.endsWith("/")) {
    console.log("${path} ends with a slash");
    path = path + "index.html";
  }

  var file = await ctx.env.MEDIA.get(path);
  console.log(`URL ${ctx.request.url} became path: ${path}`);

  if (!file) {
    path = path + "/index.html";
    console.log(`got 404, trying ${path} fallback`);
    var file = await ctx.env.MEDIA.get(path);
  }

  if (!file) return new Response(null, { status: 404 });

  return new Response(file.body, {
    headers: { "Content-Type": file.httpMetadata.contentType },
  });
}
