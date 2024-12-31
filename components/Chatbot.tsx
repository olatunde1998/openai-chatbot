"use client";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownCircleIcon,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);
  const chatIconRef = useRef<HTMLButtonElement>(null);
  const {
    messages,
    input,
    handleSubmit,
    handleInputChange,
    isLoading,
    stop,
    reload,
    error,
  } = useChat({ api: "/api/gemini" });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="bg-green-400 text-black">
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              ref={chatIconRef}
              onClick={toggleChat}
              className="rounded-full size-14 p-2 shadow-lg"
            >
              {!isChatOpen ? (
                <MessageCircle className="size-12" />
              ) : (
                <ArrowDownCircleIcon />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-[95%] md:w-[500px]"
          >
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold">
                  Chat with Geomatic Connect AI
                </CardTitle>
                <Button
                  onClick={toggleChat}
                  size="sm"
                  variant="ghost"
                  className="px-2 py-0"
                >
                  <X className="size-4" />
                  <span className="sr-only">Close Chat</span>
                </Button>
              </CardHeader>

              {/* ===== */}
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {messages.length === 0 && (
                    <p className="w-full mt-32 text-gray-500 items-center justify-center flex gap-3">
                      No message Yet.
                    </p>
                  )}
                  {messages?.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-4 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <ReactMarkdown
                          children={message.content}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              return inline ? (
                                <code
                                  {...props}
                                  className="bg-gray-200 px-1 rounded"
                                >
                                  {children}
                                </code>
                              ) : (
                                <pre
                                  {...props}
                                  className="bg-gray-200 p-2 rounded"
                                >
                                  <code>{children}</code>
                                </pre>
                              );
                            },
                            ul: ({ children }) => (
                              <ul className="list-disc ml-4">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <li className="list-decimal ml-4">{children}</li>
                            ),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="w-full items-center flex justify-center gap-3">
                      <Loader2 className="animate-spin h-5 w-5 text-green-400" />
                      <button
                        type="button"
                        className="underline"
                        onClick={() => stop()}
                      >
                        abort
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="w-full items-center flex justify-center gap-3">
                      <p>An error occurred.</p>
                      <button
                        type="button"
                        className="underline"
                        onClick={() => reload()}
                      >
                        Retry
                      </button>
                    </div>
                  )}
                  <div ref={scrollRef}> </div>
                </ScrollArea>
              </CardContent>

              {/* ==== */}
              <CardFooter>
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center w-full space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Type your message here..."
                    onChange={handleInputChange}
                    disabled={isLoading}
                    value={input}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="icon"
                    className="size-9 rounded-full flex items-center justify-center"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
