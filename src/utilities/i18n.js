import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "account": "Account",
      "security": "Security",
      "preferences": "Preferences",
      "notifications": "Notifications",
      "connectedAccounts": "Connected Accounts",
      "accountSettings": "Account Settings",
      "displayName": "Display Name",
      "bio": "Bio",
      "saveChanges": "Save Changes",
      "securitySettings": "Security Settings",
      "newPassword": "New Password",
      "updatePassword": "Update Password",
      "theme": "Theme",
      "language": "Language",
      "savePreferences": "Save Preferences",
      "notificationSettings": "Notification Settings",
      "emailNotifications": "Email Notifications",
      "pushNotifications": "Push Notifications",
      "saveNotificationSettings": "Save Notification Settings",
      "google": "Google",
      "facebook": "Facebook",
      "connected": "Connected",
      "notConnected": "Not Connected",
      "disconnect": "Disconnect",
      "connect": "Connect",
      "infoNote": "To manage connected accounts, please use the social login options on the sign-in page."
    }
  },
  ja: {
    translation: {
      "account": "アカウント",
      "security": "セキュリティ",
      "preferences": "環境設定",
      "notifications": "通知",
      "connectedAccounts": "接続されたアカウント",
      "accountSettings": "アカウント設定",
      "displayName": "表示名",
      "bio": "自己紹介",
      "saveChanges": "変更を保存",
      "securitySettings": "セキュリティ設定",
      "newPassword": "新しいパスワード",
      "updatePassword": "パスワードを更新",
      "theme": "テーマ",
      "language": "言語",
      "savePreferences": "環境設定を保存",
      "notificationSettings": "通知設定",
      "emailNotifications": "メール通知",
      "pushNotifications": "プッシュ通知",
      "saveNotificationSettings": "通知設定を保存",
      "google": "グーグル",
      "facebook": "フェイスブック",
      "connected": "接続済み",
      "notConnected": "未接続",
      "disconnect": "切断",
      "connect": "接続",
      "infoNote": "接続されたアカウントを管理するには、サインインページのソーシャルログインオプションを使用してください。"
    }
  },
  fil: {
    translation: {
      "account": "May Ari",
      "security": "Seguridad",
      "preferences": "Mga Kagustuhan",
      "notifications": "Mga Abiso",
      "connectedAccounts": "Konektadong Mga May Ari",
      "accountSettings": "Mga Setting ng May Ari",
      "displayName": "Ipinapakitang Pangalan",
      "bio": "Talambuhay",
      "saveChanges": "I-save ang mga Pagbabago",
      "securitySettings": "Mga Setting ng Seguridad",
      "newPassword": "Bagong Password",
      "updatePassword": "I-update ang Password",
      "theme": "Tema",
      "language": "Wika",
      "savePreferences": "I-save ang Mga Kagustuhan",
      "notificationSettings": "Mga Setting ng Abiso",
      "emailNotifications": "Email Abiso",
      "pushNotifications": "Push Abiso",
      "saveNotificationSettings": "I-save ang Mga Setting ng Abiso",
      "google": "Google",
      "facebook": "Facebook",
      "connected": "Konektado",
      "notConnected": "Hindi Konektado",
      "disconnect": "Idiskonekta",
      "connect": "Ikonekta",
      "infoNote": "Upang pamahalaan ang mga konektadong akun, gamitin ang mga opsyon sa social login sa pahina ng pag-sign in."
    }
  },
  zh: {
    translation: {
      "account": "账户",
      "security": "安全",
      "preferences": "偏好设置",
      "notifications": "通知",
      "connectedAccounts": "已连接账户",
      "accountSettings": "账户设置",
      "displayName": "显示名称",
      "bio": "简介",
      "saveChanges": "保存更改",
      "securitySettings": "安全设置",
      "newPassword": "新密码",
      "updatePassword": "更新密码",
      "theme": "主题",
      "language": "语言",
      "savePreferences": "保存偏好",
      "notificationSettings": "通知设置",
      "emailNotifications": "电子邮件通知",
      "pushNotifications": "推送通知",
      "saveNotificationSettings": "保存通知设置",
      "google": "谷歌",
      "facebook": "脸书",
      "connected": "已连接",
      "notConnected": "未连接",
      "disconnect": "断开连接",
      "connect": "连接",
      "infoNote": "要管理已连接的账户，请使用登录页面上的社交登录选项。"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
