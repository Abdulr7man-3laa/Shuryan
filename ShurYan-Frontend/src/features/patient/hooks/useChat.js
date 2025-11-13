import { useEffect } from 'react';
import useChatStore from '../stores/chatStore';

/**
 * Custom Hook للـ ChatBot - Refactored
 * يوفر واجهة سهلة للتعامل مع الـ Chat Store
 * 
 * @param {Object} options - خيارات الـ Hook
 * @param {boolean} options.autoFetchHistory - جلب تاريخ المحادثة تلقائياً عند التحميل
 * @param {Object} options.context - Context للصفحة الحالية
 * @returns {Object} Chat state and actions
 */
const useChat = (options = {}) => {
  const {
    autoFetchHistory = false,
    context = null,
  } = options;

  // State
  const conversationId = useChatStore((state) => state.conversationId);
  const messages = useChatStore((state) => state.messages);
  const pagination = useChatStore((state) => state.pagination);
  const isSending = useChatStore((state) => state.isSending);
  const loading = useChatStore((state) => state.loading);
  const error = useChatStore((state) => state.error);
  const contextState = useChatStore((state) => state.context);

  // Actions
  const setContext = useChatStore((state) => state.setContext);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const fetchChatHistory = useChatStore((state) => state.fetchChatHistory);
  const loadMoreMessages = useChatStore((state) => state.loadMoreMessages);
  const clearChat = useChatStore((state) => state.clearChat);
  const clearError = useChatStore((state) => state.clearError);
  const reset = useChatStore((state) => state.reset);

  // Auto-fetch chat history on mount
  useEffect(() => {
    if (autoFetchHistory) {
      fetchChatHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchHistory]); // fetchChatHistory is stable from Zustand

  // Set context if provided (only on mount or when context changes)
  useEffect(() => {
    if (context) {
      setContext(context);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(context)]); // Use JSON.stringify to compare object values

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // لا نعمل reset كامل، فقط نمسح الأخطاء
      clearError();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on unmount

  return {
    // State
    conversationId,
    messages,
    pagination,
    isSending,
    loading,
    error,
    context: contextState,

    // Actions
    sendMessage,
    fetchChatHistory,
    loadMoreMessages,
    clearChat,
    clearError,
    setContext,
    reset,

    // Computed
    hasMessages: messages.length > 0,
    hasMoreMessages: pagination.hasMore,
    isLoading: loading.messages,
    isLoadingMore: loading.loadingMore,
  };
};

export default useChat;
