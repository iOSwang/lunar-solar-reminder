
import { toast } from "@/hooks/use-toast";

export interface UserProfile {
  phone: string;
  email: string;
}

const STORAGE_KEY = 'calendar_user_profile';

// Get user profile
export const getUserProfile = (): UserProfile => {
  try {
    const savedProfile = localStorage.getItem(STORAGE_KEY);
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
  } catch (error) {
    console.error('Failed to load user profile:', error);
  }
  
  return {
    phone: '',
    email: ''
  };
};

// Update user profile
export const updateUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    toast({
      title: "个人信息已更新",
      description: "您的联系方式已成功保存"
    });
  } catch (error) {
    console.error('Failed to save user profile:', error);
    toast({
      title: "保存个人信息失败",
      variant: "destructive"
    });
  }
};
