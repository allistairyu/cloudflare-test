
export async function onRequestGet(context) {
	try {
		const value = await context.env.ORG.get("me");
		const json = JSON.parse(value)
		return Response.json(json)
	} catch (e) {
		return new Response(e)
	}
}