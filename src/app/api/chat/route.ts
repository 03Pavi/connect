import Pusher from "pusher";
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});
export async function POST(request: any) {
  console.log({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
  });
  const { message } = await request.json();
  pusher.trigger("chat-channel", "new-message", { message });
  return new Response("Message sent", { status: 200 });
}
