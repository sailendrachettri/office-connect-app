import  { useEffect, useState } from "react";
import axios from "axios";
import { createChatConnection } from "../../../signalr/chatConnection";

const Landing = ({selectedFriendProfileId, userFullDetails }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // console.log("landing page + selectedFriendProfileId ", selectedFriendProfileId)
  // console.log("landing page + userFullDetails", userFullDetails)
  

  // Load chat history
  useEffect(() => {

    (async()=>{
     const currentUserId = await window.store.get('userId');
      setCurrentUserId(currentUserId);
      console.log({currentUserId});
      console.log({selectedFriendProfileId});
    })();
     
    if (!currentUserId || !selectedFriendProfileId) return;
    axios
      .get(
        `https://localhost:44303/api/messages/${currentUserId}/${selectedFriendProfileId}`
      )
      .then(res => setMessages(res.data))
      .catch(err => console.error("Failed to load messages:", err));
  }, [selectedFriendProfileId, currentUserId]);

  // SignalR connection
  useEffect(() => {
    if (!currentUserId) return;

    const var_conn = createChatConnection(currentUserId);

    // Start connection
    const startConnection = async () => {
  try {
    await var_conn.start();
    console.log("SignalR Connected");
    setConnected(true);
  } catch (err) {
    console.error("SignalR connection failed:", err);
    setConnected(false);
    alert("SignalR connection failed: " + err.message);
    // retry after 5s
    setTimeout(startConnection, 5000);
  }
};


    startConnection();

    // Listen for incoming messages
    var_conn.on("ReceiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Track reconnect events
    var_conn.onreconnecting(() => {
      console.log("SignalR reconnecting...");
      setConnected(false);
    });
    var_conn.onreconnected(() => {
      console.log("SignalR reconnected");
      setConnected(true);
    });
    var_conn.onclose(() => {
      console.log("SignalR connection closed");
      setConnected(false);
    });

    setConnection(var_conn);

    return () => {
      var_conn.stop();
    };
  }, [currentUserId]);

  const sendMessage = async () => {
    console.log({connection})
    console.log({connected})
    if (!text.trim() || !connection || !connected) return;

    try {
      await connection.invoke(
        "SendMessage",
        currentUserId,
        selectedFriendProfileId,
        text
      );

      setMessages(prev => [
        ...prev,
        {
          sender_id: currentUserId,
          receiver_id: selectedFriendProfileId,
          message_text: text,
          created_at: new Date()
        }
      ]);

      setText("");
    } catch (err) {
      console.error("SendMessage failed:", err);
    }
  };

  return (
    <div className="chat">
      <div className="messages" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.sender_id === currentUserId ? "Me" : "Them"}:</b>{" "}
            {m.message_text}
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type..."
        className="w-[5rem] border-slate-200 border"
      />
      <button onClick={()=>{sendMessage()}} className="bg-slate-100 border border-slate-50 cursor-pointer">
        Send
      </button>
    </div>
  );
};

export default Landing;
