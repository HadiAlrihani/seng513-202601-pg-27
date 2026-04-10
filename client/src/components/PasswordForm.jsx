// Appears when a user attempts to reset their password

import { useState } from 'react';

const PasswordForm = ({ userId, onClose }) => {
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
        const response = await fetch('http://localhost:5000/profile/reset-password', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            user_id: userId,
            old_password: oldPassword,
            new_password: newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            onClose();
        } else {
            setError(data.error || 'Failed to update password');
        }
        } catch (err) {
            console.error("Caught error:", err); //debug
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
            </div>
        )}
        
        <div className="mb-4">
            <label htmlFor="old-password" className="block text-sm font-medium mb-2">
            Old Password
            </label>
            <input
            id="old_password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            minLength={3}
            disabled={loading}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <label htmlFor="new-password" className="block text-sm font-medium mb-2">
            New Password
            </label>
            <input
            id="new_password"
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={3}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>

        <div className="flex gap-3 justify-end">
            <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
            Cancel
            </button>
            <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#D3F0D3]/100 text-black rounded-lg disabled:opacity-50"
            >
            {loading ? 'Updating...' : 'Save'}
            </button>
        </div>
        </form>
    );
    };

export default PasswordForm;