import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../utilities/firebase";

const PremiumActivationModal = ({ userUid, onClose, onUpgrade }) => {
    const handleUpgrade = async (tier) => {
        let updatedData = { isPremiumUser: true };
        if (tier === "basic") {
            updatedData.ratePremium = 1;
            updatedData.PremiumPrice = 4.99;
        } else if (tier === "medium") {
            updatedData.cardLimits = 100;
            updatedData.taskLimits = 100;
            updatedData.ratePremium = 2;
            updatedData.PremiumPrice = 9.99;
        } else if (tier === "pro") {
            updatedData.cardLimits = 1000;
            updatedData.taskLimits = 1000;
            updatedData.ratePremium = 3;
            updatedData.PremiumPrice = 19.99;
        }

        try {
            const accountRef = doc(db, "account", userUid);
            await updateDoc(accountRef, updatedData);
            alert(`Successfully upgraded to ${tier}!`);
            if (onUpgrade) onUpgrade(tier);
            onClose();
        } catch (error) {
            console.error("Error upgrading premium:", error);
            alert("There was an error upgrading your account. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="premium-modal">
                <h2>Upgrade to Premium</h2>
                <div className="premium-options">
                    <div
                        className="premium-option"
                        onClick={() => handleUpgrade("basic")}
                    >
                        <h3>Basic</h3>
                        <p>Allows custom colors only.</p>
                        <p className="price">Price: $4.99/month</p>
                    </div>
                    <div
                        className="premium-option"
                        onClick={() => handleUpgrade("medium")}
                    >
                        <h3>Medium</h3>
                        <p>
                        Custom colors plus card and task limits up to <strong>100</strong>.
                        </p>
                        <p className="price">Price: $9.99/month</p>
                    </div>
                    <div
                        className="premium-option"
                        onClick={() => handleUpgrade("pro")}
                    >
                        <h3>Pro</h3>
                        <p>
                        Custom colors plus card and task limits up to <strong>1000</strong>.
                        </p>
                        <p className="price">Price: $19.99/month</p>
                    </div>
                </div>
                <button className="close-btn" onClick={onClose}>
                Cancel
                </button>
            </div>
        </div>
    );
};

export default PremiumActivationModal;
