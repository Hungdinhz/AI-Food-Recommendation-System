import { fetchApi } from "./apiClient";

export interface ChatResponse {
  reply: string;
}

export const chatService = {
  /**
   * Send a message to the AI chatbot and get a response.
   */
  async sendMessage(userId: number, message: string): Promise<string> {
    const response = await fetchApi<ChatResponse>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ userId, message }),
    });
    return response.reply;
  },
};
