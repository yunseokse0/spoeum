import { create } from 'zustand';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications: Notification[]) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification: Notification) => {
    const currentNotifications = get().notifications;
    const newNotifications = [notification, ...currentNotifications];
    const unreadCount = newNotifications.filter(n => !n.isRead).length;
    
    set({ 
      notifications: newNotifications,
      unreadCount,
    });
  },

  markAsRead: (id: string) => {
    const currentNotifications = get().notifications;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    
    set({ 
      notifications: updatedNotifications,
      unreadCount,
    });
  },

  markAllAsRead: () => {
    const currentNotifications = get().notifications;
    const updatedNotifications = currentNotifications.map(notification =>
      ({ ...notification, isRead: true })
    );
    
    set({ 
      notifications: updatedNotifications,
      unreadCount: 0,
    });
  },

  removeNotification: (id: string) => {
    const currentNotifications = get().notifications;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    
    set({ 
      notifications: updatedNotifications,
      unreadCount,
    });
  },

  clearNotifications: () => {
    set({ 
      notifications: [],
      unreadCount: 0,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
