import { NearBindgen, near, call, view, assert } from 'near-sdk-js';

class Message {
  author: string;
  title: string;
  text: string;
  dateTime: string;
  replies: Message[];
}

@NearBindgen({})
class DevFeedbackLog {
  messages: Message[] = [];

  @call({ payableFunction: true })
  add_new_feedback({ title, text }: { title: string, text: string }) {
    const hasPremium = near.attachedDeposit() >= BigInt("1" + "0".repeat(23));
    const premiumErrorMessage = "You must pay to leave feedback, or remain silent. That will be at least 0.1 NEAR, please. Thank you. Good day. Goodbye.";
    assert(hasPremium, premiumErrorMessage);
    const sender = near.predecessorAccountId();
    const dateTime = Date.now().toString();

    const isNewMessage = findMessageIndexByAuthorAndTitle(sender, title, this.messages);
    const errorMessage = "You have already left feedback with this title. Please choose a new title.";
    assert(isNewMessage, errorMessage);

    const message: Message = { 
      author: sender,
      title, 
      text, 
      dateTime,
      replies: []
    };
    this.messages.push(message);
  }

  @view({})
  get_feedback_messages({ n_most_recent = 10 }: { n_most_recent: number }): Message[] {
    const messages = this.messages;
    const n = Math.min(n_most_recent, messages.length);
    return messages.slice(messages.length - n, messages.length);
  }

  @view({})
  total_feedback_messages(): number { return this.messages.length; }
}

function findMessageIndexByAuthorAndTitle(author: string, title: string, messages: Message[]): boolean {
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].author === author && messages[i].title === title) {
      return false;
    }
  }
  return true;
}