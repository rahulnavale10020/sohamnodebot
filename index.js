const axios = require("axios");

// Replace with your Telegram bot token
const token = "6913365713:AAGsBq6xeLlAPZTDt7zpxpDlicsdW9PMt-M";
const apiUrl = `https://api.telegram.org/bot${token}`;

async function getUpdates(offset) {
  try {
    const response = await axios.get(`${apiUrl}/getUpdates`, {
      params: { offset },
    });
    return response.data.result || [];
  } catch (error) {
    console.error("Error fetching updates:", error.message);
    return [];
  }
}

async function sendMessage(chatId, text, replyToMessageId = null) {
  try {
    const payload = {
      chat_id: chatId,
      text,
    };
    if (replyToMessageId) {
      payload.reply_to_message_id = replyToMessageId; // Add reply-to-message functionality
    }
    await axios.post(`${apiUrl}/sendMessage`, payload);
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

(async function runBot() {
  console.log("Bot is running...");
  let offset = 0;

  while (true) {
    const updates = await getUpdates(offset);

    for (const update of updates) {
      // Check if 'message' exists in the update
      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;
        const messageId = update.message.message_id;

        if (text === "/hi") {
          await sendMessage(chatId, "Working", messageId);
        } else if (text == "/test") {
          await sendMessage(chatId, "Checking Going On", messageId);
        }
      }

      // Update the offset to avoid processing the same update again
      offset = update.update_id + 1;
    }

    // Polling delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
})();
