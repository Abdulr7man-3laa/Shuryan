import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import chatService from '@/api/services/chat.service';

/**
 * Chat Store - Refactored
 * إدارة محادثة واحدة فقط للمريض مع pagination
 */
const useChatStore = create(
  devtools(
    (set, get) => ({
      // ============= State =============
      
      // معرف المحادثة الحالية (من الـ Backend)
      conversationId: null,
      
      // الرسائل في المحادثة
      messages: [],
      
      // Pagination info
      pagination: {
        currentPage: 1,
        pageSize: 50,
        totalMessages: 0,
        totalPages: 0,
        hasMore: false,
      },
      
      // حالة الإرسال
      isSending: false,
      
      // حالة التحميل
      loading: {
        messages: false,
        loadingMore: false, // للـ pagination
      },
      
      // الأخطاء
      error: null,
      
      // Context الحالي (للصفحة الحالية)
      context: {
        currentPage: null,
        doctorId: null,
        appointmentId: null,
        specialty: null,
        additionalData: {},
      },

      // ============= Actions =============

      /**
       * تعيين الـ Context الحالي
       */
      setContext: (newContext) => {
        set((state) => ({
          context: { ...state.context, ...newContext }
        }));
      },

      /**
       * إرسال رسالة للـ AI Bot
       */
      sendMessage: async (message) => {
        const state = get();
        
        if (!message.trim()) {
          console.warn('⚠️ Cannot send empty message');
          return;
        }

        // إضافة رسالة المستخدم فوراً (Optimistic Update)
        const userMessage = {
          messageId: `temp-${Date.now()}`,
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
          suggestions: [],
          actions: [],
        };

        set((state) => ({
          messages: [...state.messages, userMessage],
          isSending: true,
          error: null,
        }));

        try {
          // إرسال الرسالة للـ Backend
          const response = await chatService.sendMessage({
            message,
            context: state.context,
          });

          // إضافة رد الـ AI
          const aiMessage = {
            messageId: response.messageId,
            role: 'assistant',
            content: response.reply,
            suggestions: response.suggestions || [],
            actions: response.actions || [],
            timestamp: response.timestamp,
          };

          set((state) => ({
            messages: [...state.messages, aiMessage],
            conversationId: response.conversationId,
            isSending: false,
            pagination: {
              ...state.pagination,
              totalMessages: state.pagination.totalMessages + 2, // user + bot
            },
          }));

          console.log('✅ Message sent successfully');
          
          return response;
        } catch (error) {
          console.error('❌ Error sending message:', error);
          
          // إزالة رسالة المستخدم عند الفشل
          set((state) => ({
            messages: state.messages.filter(msg => msg.messageId !== userMessage.messageId),
            isSending: false,
            error: error.response?.data?.message || 'فشل إرسال الرسالة',
          }));
          
          throw error;
        }
      },

      /**
       * جلب تاريخ المحادثة (الصفحة الأولى)
       */
      fetchChatHistory: async () => {
        set({ 
          loading: { messages: true, loadingMore: false }, 
          error: null 
        });

        try {
          const data = await chatService.getChatHistory(1, 50);

          if (data) {
            set({
              conversationId: data.conversationId,
              messages: data.messages || [],
              pagination: {
                currentPage: data.pagination?.currentPage || 1,
                pageSize: data.pagination?.pageSize || 50,
                totalMessages: data.pagination?.totalMessages || 0,
                totalPages: data.pagination?.totalPages || 0,
                hasMore: data.hasMore || false,
              },
              loading: { messages: false, loadingMore: false },
            });

            console.log('✅ Chat history loaded:', data.messages?.length || 0, 'messages');
          } else {
            // لا توجد محادثة بعد
            set({
              messages: [],
              loading: { messages: false, loadingMore: false },
            });
          }
        } catch (error) {
          console.error('❌ Error fetching chat history:', error);
          
          set({
            loading: { messages: false, loadingMore: false },
            error: error.response?.data?.message || 'فشل تحميل المحادثة',
          });
          
          throw error;
        }
      },

      /**
       * تحميل المزيد من الرسائل (pagination)
       */
      loadMoreMessages: async () => {
        const state = get();
        
        if (!state.pagination.hasMore || state.loading.loadingMore) {
          return;
        }

        set({ loading: { ...state.loading, loadingMore: true } });

        try {
          const nextPage = state.pagination.currentPage + 1;
          const data = await chatService.getChatHistory(nextPage, state.pagination.pageSize);

          if (data && data.messages) {
            set((state) => ({
              messages: [...data.messages, ...state.messages], // أقدم رسائل في البداية
              pagination: {
                currentPage: data.pagination?.currentPage || nextPage,
                pageSize: data.pagination?.pageSize || 50,
                totalMessages: data.pagination?.totalMessages || 0,
                totalPages: data.pagination?.totalPages || 0,
                hasMore: data.hasMore || false,
              },
              loading: { ...state.loading, loadingMore: false },
            }));

            console.log('✅ Loaded more messages:', data.messages.length);
          }
        } catch (error) {
          console.error('❌ Error loading more messages:', error);
          
          set((state) => ({
            loading: { ...state.loading, loadingMore: false },
            error: error.response?.data?.message || 'فشل تحميل المزيد من الرسائل',
          }));
          
          throw error;
        }
      },

      /**
       * مسح المحادثة بالكامل (البدء من جديد)
       */
      clearChat: async () => {
        try {
          await chatService.clearChat();

          // مسح كل شيء من الـ State
          set({
            conversationId: null,
            messages: [],
            pagination: {
              currentPage: 1,
              pageSize: 50,
              totalMessages: 0,
              totalPages: 0,
              hasMore: false,
            },
            error: null,
          });

          console.log('✅ Chat cleared successfully');
        } catch (error) {
          console.error('❌ Error clearing chat:', error);
          
          set({
            error: error.response?.data?.message || 'فشل مسح المحادثة',
          });
          
          throw error;
        }
      },

      /**
       * مسح الأخطاء
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Reset كامل للـ Store
       */
      reset: () => {
        set({
          conversationId: null,
          messages: [],
          pagination: {
            currentPage: 1,
            pageSize: 50,
            totalMessages: 0,
            totalPages: 0,
            hasMore: false,
          },
          isSending: false,
          loading: { messages: false, loadingMore: false },
          error: null,
          context: {
            currentPage: null,
            doctorId: null,
            appointmentId: null,
            specialty: null,
            additionalData: {},
          },
        });
      },
    }),
    { name: 'ChatStore' }
  )
);

export default useChatStore;
