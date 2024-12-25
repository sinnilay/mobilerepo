const conversationContainer = document.getElementById("conversation");
const inputForm = document.getElementById("input-form");
const inputField = document.getElementById("input-field");
const stopButton = document.getElementById("stop-button");

let typingInterval; 
let isTyping = false; 
let isStopped = false; 

function addMessage(text, isBot = true) {
  const message = document.createElement("div");
  message.className = `chatbot-message ${isBot ? "" : "user-message"}`;
  const messageText = document.createElement("p");
  messageText.className = "chatbot-text";
  messageText.textContent = text;
  message.appendChild(messageText);
  conversationContainer.appendChild(message);
  conversationContainer.scrollTop = conversationContainer.scrollHeight; // Auto-scroll to the latest message
}


function showTypingIndicator() {
  if (isStopped) return;
  isTyping = true;
  const typingMessage = document.createElement("div");
  typingMessage.className = "chatbot-message";
  typingMessage.id = "typing-indicator";
  const typingText = document.createElement("p");
  typingText.className = "chatbot-text";
  typingText.textContent = "Typing...";
  typingMessage.appendChild(typingText);
  conversationContainer.appendChild(typingMessage);
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
}


function stopTypingIndicator() {
  isTyping = false;
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

inputForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userMessage = inputField.value.trim();
  if (!userMessage) return;


  addMessage(userMessage, false);
  inputField.value = "";

 
  showTypingIndicator();

  try {
    
    const response = await fetch("https://google-gemini-nu-lac.vercel.app/google-gemini-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: userMessage }),
    });

    const data = await response.json();
    stopTypingIndicator();

   
    addMessage(data.res, true);

  } catch (error) {
    stopTypingIndicator();
    addMessage("Sorry, something went wrong. Please try again.");
  }
});

stopButton.addEventListener("click", () => {
  clearInterval(typingInterval);
  stopTypingIndicator();
  isStopped = true; 
});
