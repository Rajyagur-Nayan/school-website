"use client";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, PhoneOff, Loader, RefreshCw } from "lucide-react"; // Import User icon

// --- Enums & Types (Unchanged) ---
export enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  CONNECTING = "CONNECTING",
}

interface AgentProps {
  userName: string;
  userId: string;
  type: string;
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface Message {
  type: "transcript" | string;
  transcriptType?: "final" | "partial";
  transcript?: string;
  role: "user" | "system" | "assistant";
}

// --- Main Agent Component ---
const Agent = ({}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false); // AI speaking
  const [isUserSpeaking, setIsUserSpeaking] = useState(false); // User speaking
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    // Event listeners for the Vapi SDK
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    // AI speech
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    // User speech
    const onUserSpeechStart = () => setIsUserSpeaking(true);
    const onUserSpeechEnd = () => setIsUserSpeaking(false);

    const onError = (error: Error) => {
      console.error("Vapi Error:", error);
      setCallStatus(CallStatus.INACTIVE); // Reset on error
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript || "",
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("user-speech-start" as any, onUserSpeechStart); // Added - cast to any to satisfy typings
    vapi.on("user-speech-end" as any, onUserSpeechEnd); // Added - cast to any to satisfy typings
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("user-speech-start" as any, onUserSpeechStart); // Added - cast to any to satisfy typings
      vapi.off("user-speech-end" as any, onUserSpeechEnd); // Added - cast to any to satisfy typings
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      console.log("Interview has ended. You can now redirect or show results.");
      // Example: setTimeout(() => router.push('/results'), 3000);
    }
  }, [callStatus, router]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    try {
      // For production, use a more secure way to fetch the token if needed
      await vapi.start(process.env.NEXT_PUBLIC_WORKFLOW_TOKEN!);
    } catch (error) {
      console.error("Workflow start failed:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleEndCall = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);
  };

  const handleRestart = () => {
    setMessages([]);
    setCallStatus(CallStatus.INACTIVE);
    handleCall();
  };

  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;

  return (
    // Light mode: bg-gray-100, dark mode: bg-slate-950
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows for ambiance */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main Interview Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        // Light mode: bg-white/50, dark mode: bg-slate-900/50
        className="w-full max-w-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-gray-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-xl shadow-gray-400/10 dark:shadow-black/20"
      >
        {/* Avatars Display */}
        <AvatarDisplay
          isAiSpeaking={isSpeaking}
          isUserSpeaking={isUserSpeaking}
        />

        <div className="text-center">
          <h2 className="text-3xl font-bold">AI Lerning Bot</h2>
          {/* Light mode: text-gray-500, dark mode: text-slate-400 */}
          <p className="text-gray-500 dark:text-slate-400">
            Ready to begin your assessment.
          </p>
        </div>

        {/* Status & Transcript Display */}
        <StatusDisplay status={callStatus} lastMessage={lastMessage} />

        {/* Call Controls */}
        <CallButton
          status={callStatus}
          onStart={handleCall}
          onEnd={handleEndCall}
          onRestart={handleRestart}
        />
      </motion.div>
    </div>
  );
};

// --- Child Components for better organization ---

// Component for AI and User Avatars
const AvatarDisplay = ({
  isAiSpeaking,
  isUserSpeaking,
}: {
  isAiSpeaking: boolean;
  isUserSpeaking: boolean;
}) => (
  <div className="flex items-center justify-center gap-6">
    {/* User Avatar */}
    <motion.div
      animate={{
        scale: isUserSpeaking ? [1, 1.05, 1] : 1,
        boxShadow: isUserSpeaking
          ? [
              "0 0 0 0px rgba(79, 70, 229, 0)", // indigo-600
              "0 0 0 8px rgba(79, 70, 229, 0.4)",
              "0 0 0 0px rgba(79, 70, 229, 0)",
            ]
          : "0 0 0 0px rgba(79, 70, 229, 0)",
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-full"
    >
      <div className="w-40 h-40 rounded-full flex items-center justify-center bg-gray-200 dark:bg-slate-700 border-4 border-gray-300 dark:border-slate-600">
        <Image
          src="/user-avtar.png" // Replace with your AI avatar image
          alt="Lerning AI Avatar"
          width={200}
          height={200}
          // Light mode: border-gray-300, dark mode: border-slate-700
          className="rounded-full object-cover border-4 border-gray-300 dark:border-slate-700"
        />
      </div>
    </motion.div>

    {/* AI Avatar */}
    <motion.div
      animate={{
        scale: isAiSpeaking ? [1, 1.05, 1] : 1,
        boxShadow: isAiSpeaking
          ? [
              "0 0 0 0px rgba(59, 130, 246, 0)", // blue-500
              "0 0 0 10px rgba(59, 130, 246, 0.4)",
              "0 0 0 0px rgba(59, 130, 246, 0)",
            ]
          : "0 0 0 0px rgba(59, 130, 246, 0)",
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-full"
    >
      <Image
        src="/ai-lerning.jpg" // Replace with your AI avatar image
        alt="Lerning AI Avatar"
        width={160}
        height={160}
        // Light mode: border-gray-300, dark mode: border-slate-700
        className="rounded-full object-cover border-4 border-gray-300 dark:border-slate-700"
      />
    </motion.div>
  </div>
);

// Component to display status and animated messages
const StatusDisplay = ({
  status,
  lastMessage,
}: {
  status: CallStatus;
  lastMessage: SavedMessage | null;
}) => {
  let text = "Click the microphone to start the interview.";
  if (status === CallStatus.CONNECTING) text = "Connecting...";
  if (status === CallStatus.ACTIVE)
    text = lastMessage?.content ?? "Listening...";
  if (status === CallStatus.FINISHED) text = "Interview has ended. Thank you!";

  return (
    // Light mode: bg-gray-200/50, dark mode: bg-slate-800/50
    <div className="w-full h-20 text-center flex items-center justify-center bg-gray-200/50 dark:bg-slate-800/50 rounded-lg p-4">
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          // Light mode: text-gray-700, dark mode: text-slate-300
          className="text-gray-700 dark:text-slate-300 italic"
        >
          &ldquo;{text}&rdquo;
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// Component to handle the different button states
const CallButton = ({
  status,
  onStart,
  onEnd,
  onRestart,
}: {
  status: CallStatus;
  onStart: () => void;
  onEnd: () => void;
  onRestart: () => void;
}) => {
  const commonClasses =
    "flex items-center justify-center w-20 h-20 rounded-full font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 text-white"; // Added text-white
  let button: ReactNode;

  switch (status) {
    case CallStatus.CONNECTING:
      button = (
        <button
          className={cn(commonClasses, "bg-yellow-600 cursor-not-allowed")}
          disabled
        >
          <Loader className="animate-spin" size={32} />
        </button>
      );
      break;
    case CallStatus.ACTIVE:
      button = (
        <button
          onClick={onEnd}
          className={cn(commonClasses, "bg-red-600 hover:bg-red-700")}
        >
          <PhoneOff size={32} />
        </button>
      );
      break;
    case CallStatus.FINISHED:
      button = (
        <button
          onClick={onRestart}
          className={cn(commonClasses, "bg-blue-600 hover:bg-blue-700")}
        >
          <RefreshCw size={32} />
        </button>
      );
      break;
    default: // INACTIVE
      button = (
        <button
          onClick={onStart}
          className={cn(commonClasses, "bg-indigo-600 hover:bg-indigo-700")}
        >
          <Mic size={32} />
        </button>
      );
  }

  return <div className="mt-4">{button}</div>;
};

export default Agent;
