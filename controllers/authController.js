import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Chat from '../chatBotModel/model.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d'
    });
};

export async function signupUser(req, res) {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'An account with this email address already exists.' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        return res.status(500).json({ error: 'An unexpected error occurred during registration. Please try again.' });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter both email and password.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ error: 'An unexpected error occurred during login. Please try again.' });
    }
}

export async function getCurrentUser(req, res) {
    try {
        return res.status(200).json({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        });
    } catch (error) {
        console.error('GetCurrentUser error:', error.message);
        return res.status(500).json({ error: 'Failed to retrieve user session.' });
    }
}

export async function updateUser(req, res) {
    try {
        const { name, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'Account not found.' });
        }

        if (name) {
            user.name = name;
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to set a new password.' });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ error: 'The current password you entered is incorrect.' });
            }
            user.password = newPassword;
        }

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(`Error in updateUser: ${error.message}`);
        return res.status(500).json({ error: 'An error occurred while updating your profile.' });
    }
}

export async function deleteUser(req, res) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'Account not found.' });
        }

        // Cascade delete chats to prevent orphan records
        await Chat.deleteMany({ userId: req.user._id });
        await User.findByIdAndDelete(req.user._id);

        return res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(`Error in deleteUser: ${error.message}`);
        return res.status(500).json({ error: 'An error occurred while deleting your account.' });
    }
}
