"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  MoreVertical,
  MessageSquare,
  Search,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const API_BASE = "http://127.0.0.1:8000/api";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/rooms/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        const token = localStorage.getItem("access");
        try {
          const res = await fetch(
            `${API_BASE}/messages/?room=${selectedChat.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (res.ok) {
            const data = await res.json();
            setMessages(data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
    const token = localStorage.getItem("access");
    try {
      const res = await fetch(`${API_BASE}/messages/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room: selectedChat.id, text: message }),
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[100dvh] flex overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-30
          w-full md:w-[380px] h-full
          backdrop-blur-xl bg-white/80 dark:bg-slate-900/80
          border-r border-slate-200 dark:border-slate-800
          shadow-2xl transition-all duration-300
          ${selectedChat ? "translate-x-[-100%] md:translate-x-0" : "translate-x-0"}
        `}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
                Messages
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Хөрөнгө оруулагчидтай холбогдоорой
              </p>
            </div>
            <button className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all">
              <Plus size={20} />
            </button>
          </div>

          <div className="relative mt-5">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Хайх..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 h-[calc(100%-160px)]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            rooms.map((room: any) => (
              <div
                key={room.id}
                onClick={() => setSelectedChat(room)}
                className={`p-4 rounded-3xl cursor-pointer transition-all duration-300
                ${
                  selectedChat?.id === room.id
                    ? "bg-blue-600 text-white shadow-xl scale-[1.02]"
                    : "bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold
                    ${selectedChat?.id === room.id ? "bg-white/20" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}
                  >
                    {room.investor_name?.[0] || "I"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold truncate text-sm">
                        {room.investor_name}
                      </h3>
                      <span
                        className={`text-[10px] ${selectedChat?.id === room.id ? "text-blue-100" : "text-slate-400"}`}
                      >
                        12:45 PM
                      </span>
                    </div>
                    <p
                      className={`truncate text-xs mt-1 ${selectedChat?.id === room.id ? "text-blue-50" : "text-slate-500"}`}
                    >
                      {room.startup_name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* MAIN CHAT */}
      <main
        className={`flex-1 flex flex-col relative overflow-hidden ${!selectedChat ? "hidden md:flex" : "flex"}`}
      >
        {/* Background Glows for Dark Mode */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        {selectedChat ? (
          <>
            <header className="h-[72px] px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl z-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {selectedChat.investor_name?.[0]}
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-white">
                    {selectedChat.investor_name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 relative z-10"
            >
              {messages.map((msg: any) => {
                const isMe = msg.sender_name === user?.username;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300">
                        {msg.sender_name?.[0]}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-[20px] ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-500/10"
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm md:text-[15px] leading-relaxed">
                        {msg.text}
                      </p>
                      <span
                        className={`text-[9px] mt-1 block opacity-60 ${isMe ? "text-right" : "text-left"}`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="p-4 md:p-6 z-10">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[24px] p-1.5 shadow-xl"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Мессеж бичих..."
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-700 dark:text-white placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Send size={18} fill="currentColor" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-[32px] flex items-center justify-center mb-6 text-blue-600">
              <MessageSquare size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Таны зурвасууд
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs">
              Хөрөнгө оруулагчтайгаа холбогдож төслөө танилцуулаарай.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
