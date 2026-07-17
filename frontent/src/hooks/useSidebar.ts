import { useChat } from './useChat';

export function useSidebar() {
  const { sidebarOpen, setSidebarOpen } = useChat();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  return {
    isOpen: sidebarOpen,
    toggle: toggleSidebar,
    close: closeSidebar,
    open: openSidebar
  };
}
