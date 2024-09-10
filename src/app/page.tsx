"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  IconButton,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  forceTLS: true,
});
console.log(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER
)
Pusher.logToConsole = true;
export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const channel = pusher.subscribe("chat-channel");
    channel.bind("new-message", (data: { message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message) {
      await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      setMessage("");
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" p={3}>
      <Typography variant="h4" gutterBottom>
        Connect
      </Typography>
      <Box
        flex={1}
        display="flex"
        flexDirection="column-reverse"
        mb={2}
        p={2}
        border={1}
        borderColor="divider"
        borderRadius={1}
        overflow="auto"
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ mb: 1 }}>
              <Paper elevation={2} sx={{ padding: 2, borderRadius: 1 }}>
                <Typography variant="body1">{msg}</Typography>
              </Paper>
            </ListItem>
          ))}
          <div ref={chatEndRef} />
        </List>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
          <InsertEmoticonIcon />
        </IconButton>
        {showEmojiPicker && (
          <Box position="absolute" bottom="70px">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
