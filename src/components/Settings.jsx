import React, { useState, useEffect } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utilities/firebase';
import { useAuth } from '../context/useAuth';
import { useTranslation } from 'react-i18next';
import '../scss/settings.scss';
import { usePreferences } from '../context/usePreferences';

const Settings = () => {
    const { t, i18n } = useTranslation();
    const { currentUser, accBST } = useAuth();
    const [selectedTab, setSelectedTab] = useState('account');
    const [message, setMessage] = useState('');
    const { preferences, setPreferences } = usePreferences();

    const [profile, setProfile] = useState({
        displayName: currentUser?.displayName || '',
        bio: accBST?.bio || '',
    });

    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (accBST) {
            setPreferences((prev) => ({ ...prev, theme: accBST.theme, language: accBST.language }));
        }
    }, [accBST]);

    const [notifications, setNotifications] = useState({
        emailNotifs: accBST?.emailNotifs ?? true,
        pushNotifs: accBST?.pushNotifs ?? true,
    });

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setPreferences({ ...preferences, language: newLang });
        i18n.changeLanguage(newLang);
    };

    const handleThemeChange = async (e) => {
        const newTheme = e.target.value;
        setPreferences((prev) => ({ ...prev, theme: newTheme }));

        if (currentUser) {
            try {
                const adminRef = doc(db, "account", currentUser.uid);
                await updateDoc(adminRef, { theme: newTheme });
                console.log("Theme updated in Firestore:", newTheme);
            } catch (error) {
                console.error("Error updating theme in Firestore:", error);
            }
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                await updateProfile(currentUser, { displayName: profile.displayName });
                const accountRef = doc(db, "account", currentUser.uid);
                await updateDoc(accountRef, {
                    displayName: profile.displayName,
                    bio: profile.bio,
                });
                setMessage(t("saveChanges"));
            }
        } catch (error) {
            console.error("Error updating account:", error);
            setMessage(t("errorUpdatingAccount") || "Error updating account.");
        }
    };

    const handleSecurityUpdate = async (e) => {
        e.preventDefault();
        try {
            if (currentUser && newPassword.length >= 6) {
                await updatePassword(currentUser, newPassword);
                setMessage(t("updatePassword"));
                setNewPassword('');
            } else {
                setMessage(t("passwordMinLength") || "Password must be at least 6 characters.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage(t("errorUpdating Password") || "Error updating password.");
        }
    };

    const handlePreferencesUpdate = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                const accountRef = doc(db, "account", currentUser.uid);
                await updateDoc(accountRef, {
                    theme: preferences.theme,
                    language: preferences.language,
                });
                setMessage(t("savePreferences"));
            }
        } catch (error) {
            console.error("Error updating preferences:", error);
            setMessage(t("errorUpdatingPreferences") || "Error updating preferences.");
        }
    };

    const handleNotificationsUpdate = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                // Update notifications if needed
                setMessage(t("saveNotificationSettings"));
            }
        } catch (error) {
            console.error("Error updating notifications:", error);
            setMessage(t("errorUpdatingNotifications") || "Error updating notifications.");
        }
    };

    useEffect(() => {
        setProfile({
            displayName: currentUser?.displayName || '',
            bio: accBST?.bio || '',
        });
    }, [accBST, currentUser]);
      

    // After updating preferences (or inside a useEffect)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', preferences?.theme?.toLowerCase());
    }, [preferences.theme]);
      

    return (
        <div className="settings-page">
            <aside className="settings-sidebar">
                <ul>
                    <li
                        className={selectedTab === 'account' ? 'active' : ''}
                        onClick={() => setSelectedTab('account')}
                    >
                        {t("account")}
                    </li>
                    <li
                        className={selectedTab === 'security' ? 'active' : ''}
                        onClick={() => setSelectedTab('security')}
                    >
                        {t("security")}
                    </li>
                    <li
                        className={selectedTab === 'preferences' ? 'active' : ''}
                        onClick={() => setSelectedTab('preferences')}
                    >
                        {t("preferences")}
                    </li>
                    <li
                        className={selectedTab === 'notifications' ? 'active' : ''}
                        onClick={() => setSelectedTab('notifications')}
                    >
                        {t("notifications")}
                    </li>
                    <li
                        className={selectedTab === 'connections' ? 'active' : ''}
                        onClick={() => setSelectedTab('connections')}
                    >
                        {t("connectedAccounts")}
                    </li>
                </ul>
            </aside>
            <main className="settings-content">
                {message && <div className="message">{message}</div>}
                {selectedTab === 'account' && (
                    <section className="account-section">
                        <h2>{t("accountSettings")}</h2>
                        <form onSubmit={handleAccountUpdate}>
                            <div className="form-group">
                                <label htmlFor="displayName">{t("displayName")}</label>
                                <input
                                    type="text"
                                    id="displayName"
                                    value={profile.displayName}
                                    onChange={(e) =>
                                        setProfile({ ...profile, displayName: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio">{t("bio")}</label>
                                <textarea
                                    id="bio"
                                    value={profile.bio}
                                    onChange={(e) =>
                                        setProfile({ ...profile, bio: e.target.value })
                                    }
                                ></textarea>
                            </div>
                            <button type="submit">{t("saveChanges")}</button>
                        </form>
                    </section>
                )}

                {selectedTab === 'security' && (
                    <section className="security-section">
                        <h2>{t("securitySettings")}</h2>
                        <form onSubmit={handleSecurityUpdate}>
                            <div className="form-group">
                                <label htmlFor="newPassword">{t("newPassword")}</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit">{t("updatePassword")}</button>
                        </form>
                    </section>
                )}

                {selectedTab === 'preferences' && (
                    <section className="preferences-section">
                        <h2>{t("preferences")}</h2>
                        <form onSubmit={handlePreferencesUpdate}>
                            <div className="form-group">
                                <label htmlFor="theme">{t("theme")}</label>
                                <select
                                    id="theme"
                                    value={preferences.theme}
                                    onChange={handleThemeChange}
                                >
                                    <option value="Light">{t("Light") || "Light"}</option>
                                    <option value="Dark">{t("Dark") || "Dark"}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="language">{t("language")}</label>
                                <select
                                    id="language"
                                    value={preferences.language}
                                    onChange={handleLanguageChange}
                                >
                                    <option value="en">English</option>
                                    <option value="ja">日本語</option>
                                    <option value="fil">Filipino</option>
                                    <option value="zh">中文</option>
                                </select>
                            </div>
                            <button type="submit">{t("savePreferences")}</button>
                        </form>
                    </section>
                )}

                {selectedTab === 'notifications' && (
                    <section className="notifications-section">
                        <h2>{t("notificationSettings")}</h2>
                        <form onSubmit={handleNotificationsUpdate}>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNotifs}
                                        onChange={(e) =>
                                            setNotifications({
                                                ...notifications,
                                                emailNotifs: e.target.checked,
                                            })
                                        }
                                    />
                                    {t("emailNotifications")}
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={notifications.pushNotifs}
                                        onChange={(e) =>
                                            setNotifications({
                                                ...notifications,
                                                pushNotifs: e.target.checked,
                                            })
                                        }
                                    />
                                    {t("pushNotifications")}
                                </label>
                            </div>
                            <button type="submit">{t("saveNotificationSettings")}</button>
                        </form>
                    </section>
                )}

                {selectedTab === 'connections' && (
                    <section className="connections-section">
                        <h2>{t("connectedAccounts")}</h2>
                        <div className="accounts-container">
                            <div className="account-card">
                                <div className="account-logo google">
                                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1926 1.15099C8.69557 2.36415 5.67973 4.66676 3.58806 7.72061C1.49639 10.7745 0.439155 14.4186 0.571638 18.1177C0.704121 21.8168 2.01934 25.376 4.32412 28.2724C6.62889 31.1687 9.80173 33.2497 13.3766 34.2096C16.2748 34.9574 19.3113 34.9903 22.225 34.3053C24.8646 33.7124 27.3049 32.4442 29.3071 30.6248C31.3909 28.6734 32.9034 26.191 33.6821 23.4444C34.5284 20.4575 34.679 17.3164 34.1223 14.2623H17.8473V21.0135H27.2727C27.0843 22.0903 26.6806 23.1179 26.0858 24.0351C25.491 24.9522 24.7173 25.7399 23.811 26.351C22.66 27.1123 21.3626 27.6246 20.002 27.8549C18.6374 28.1086 17.2377 28.1086 15.8731 27.8549C14.49 27.5689 13.1816 26.9981 12.0313 26.1787C10.1833 24.8706 8.79564 23.0121 8.06644 20.8686C7.32492 18.6849 7.32492 16.3175 8.06644 14.1338C8.5855 12.6031 9.44357 11.2095 10.5766 10.0569C11.8732 8.71358 13.5148 7.7534 15.3212 7.28167C17.1276 6.80993 19.029 6.84486 20.8168 7.38263C22.2135 7.81136 23.4906 8.56043 24.5465 9.57013C25.6093 8.51284 26.6702 7.45281 27.7293 6.39005C28.2762 5.81857 28.8723 5.27443 29.411 4.68927C27.7992 3.1894 25.9074 2.02232 23.8438 1.2549C20.0859 -0.109583 15.9742 -0.146253 12.1926 1.15099Z" fill="white"/>
                                        <path d="M12.1918 1.15134C15.9731 -0.146782 20.0848 -0.111078 23.843 1.25252C25.9069 2.02515 27.7979 3.19785 29.4074 4.7033C28.8605 5.28845 28.2836 5.83533 27.7258 6.40408C26.6648 7.46319 25.6048 8.51866 24.5457 9.57048C23.4898 8.56078 22.2126 7.81171 20.816 7.38298C19.0288 6.84333 17.1274 6.80638 15.3205 7.27619C13.5136 7.74599 11.8711 8.7044 10.573 10.0463C9.44001 11.1989 8.58195 12.5926 8.06289 14.1232L2.39453 9.73455C4.42346 5.71108 7.93642 2.63344 12.1918 1.15134Z" fill="#E33629"/>
                                        <path d="M0.891789 14.082C1.19646 12.5721 1.70227 11.1098 2.3957 9.73438L8.06405 14.134C7.32253 16.3177 7.32253 18.6851 8.06405 20.8688C6.17551 22.3271 4.28606 23.7927 2.3957 25.2656C0.659779 21.8102 0.130355 17.8732 0.891789 14.082Z" fill="#F8BD00"/>
                                        <path d="M17.8469 14.2598H34.1219C34.6786 17.3139 34.528 20.455 33.6817 23.4418C32.903 26.1884 31.3905 28.6709 29.3067 30.6223C27.4774 29.1949 25.6399 27.7785 23.8106 26.3512C24.7175 25.7394 25.4916 24.9509 26.0864 24.0328C26.6813 23.1147 27.0846 22.0859 27.2723 21.0082H17.8469C17.8442 18.7605 17.8469 16.5102 17.8469 14.2598Z" fill="#587DBD"/>
                                        <path d="M2.39258 25.266C4.28294 23.8077 6.1724 22.3421 8.06094 20.8691C8.79158 23.0134 10.1812 24.872 12.0312 26.1793C13.1852 26.9949 14.4964 27.5611 15.8813 27.8418C17.2459 28.0955 18.6455 28.0955 20.0102 27.8418C21.3708 27.6115 22.6682 27.0992 23.8191 26.3379C25.6484 27.7652 27.4859 29.1816 29.3152 30.609C27.3134 32.4293 24.873 33.6985 22.2332 34.2922C19.3195 34.9772 16.283 34.9443 13.3848 34.1965C11.0925 33.5845 8.95146 32.5055 7.0957 31.0273C5.1315 29.4679 3.52722 27.5027 2.39258 25.266Z" fill="#319F43"/>    
                                    </svg>
                                </div>
                                <div className="account-details">
                                    <h3>{t("google")}</h3>
                                    <p>
                                        {currentUser?.providerData.some((p) => p.providerId === 'google.com')
                                            ? t("connected")
                                            : t("notConnected")}
                                    </p>
                                    {currentUser?.providerData.some((p) => p.providerId === 'google.com') ? (
                                        <button className="disconnect-btn">{t("disconnect")}</button>
                                    ) : (
                                        <button className="connect-btn">{t("connect")}</button>
                                    )}
                                </div>
                            </div>
                            <div className="account-card">
                                <div className="account-logo facebook">
                                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M30.8961 0.320312H2.10586C1.11973 0.320312 0.320312 1.11973 0.320312 2.10586V30.8961C0.320312 31.8822 1.11973 32.6816 2.10586 32.6816H30.8961C31.8822 32.6816 32.6816 31.8822 32.6816 30.8961V2.10586C32.6816 1.11973 31.8822 0.320312 30.8961 0.320312Z" fill="#3D5A98"/>
                                        <path d="M22.6473 32.6797V20.1481H26.8527L27.4816 15.2645H22.6473V12.1473C22.6473 10.7337 23.041 9.76842 25.0672 9.76842H27.6539V5.39342C26.4013 5.26312 25.1425 5.20105 23.8832 5.20749C20.159 5.20749 17.5941 7.47702 17.5941 11.6633V15.2645H13.3887V20.1481H17.5941V32.6797H22.6473Z" fill="white"/>            
                                    </svg>
                                </div>
                                <div className="account-details">
                                    <h3>{t("facebook")}</h3>
                                    <p>
                                        {currentUser?.providerData.some((p) => p.providerId === 'facebook.com')
                                            ? t("connected")
                                            : t("notConnected")}
                                    </p>
                                    {currentUser?.providerData.some((p) => p.providerId === 'facebook.com') ? (
                                        <button className="disconnect-btn">{t("disconnect")}</button>
                                    ) : (
                                        <button className="connect-btn">{t("connect")}</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="info-note">{t("infoNote")}</p>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Settings;
