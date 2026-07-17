/**
 * Formats a raw timestamp into a beautiful date/time display
 */
export function formatMessageTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/**
 * Categorizes dates into natural language groups
 */
export function formatConversationGroup(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        return 'Previous 7 Days';
      } else if (diffDays <= 30) {
        return 'Previous 30 Days';
      } else {
        return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
      }
    }
  } catch {
    return 'Older';
  }
}

/**
 * Abbreviates string content safely
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
