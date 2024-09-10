import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

export async function POST(request: any) {
  try {
    const { message } = await request.json();
    await pusher.trigger("chat-channel", "new-message", { message });
    return new Response("Message sent", { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
