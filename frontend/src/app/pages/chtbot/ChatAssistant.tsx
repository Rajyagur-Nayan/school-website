"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// --- Data Types ---
interface Message {
  sender: "user" | "bot";
  text: string;
}

export function ChatAssistant() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    // Add user's message to the chat
    const userMessage: Message = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsTyping(true);

    // Prepare data for the API
    const params = new URLSearchParams();
    params.append("prompt", prompt);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat_bot`,
        params,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );

      // Add bot's response to the chat
      if (response.data && response.data.response) {
        const botMessage: Message = {
          sender: "bot",
          text: response.data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Invalid response from the bot.");
      }
    } catch (error) {
      console.error("Error communicating with chat bot:", error);
      toast.error("Sorry, I couldn't get a response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="h-[75vh] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with AI Assistant</CardTitle>
        <CardDescription>
          I can help explain topics in simple terms.
        </CardDescription>
      </CardHeader>
      <Separator />

      {/* Chat Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "justify-end" : ""
            }`}
          >
            {msg.sender === "bot" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg p-3 max-w-lg ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="prose dark:prose-invert text-sm">
                <ReactMarkdown>
                  {msg.text.replace(/\\n/g, "  \n")}
                </ReactMarkdown>
              </div>
            </div>
            {msg.sender === "user" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <Bot />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg p-3 bg-muted flex items-center space-x-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        {/* Empty div to scroll to */}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Form */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Explain 'photosynthesis' in simple terms..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button type="submit" disabled={isTyping}>
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
