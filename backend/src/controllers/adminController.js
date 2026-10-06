const prismaClient = require('../utils/prismaClient');
const { z } = require('zod');

const updateRoleSchema = z.object({
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN'])
});

/**
 * GET /api/admin/users
 * Returns all users (id, email, role, currentPhase).
 * Requires ADMIN role.
 */
const listUsers = async (req, res) => {
  try {
    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        currentPhase: true,
        medications: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ users });
  } catch (error) {
    console.error('Admin listUsers error:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
};

/**
 * PUT /api/admin/users/:userId/role
 * Updates a user's role. Body: { role: "PATIENT" | "DOCTOR" | "ADMIN" }
 * Requires ADMIN role.
 *
 * Bootstrap note: The first admin must be set directly via SQL:
 *   UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@your-domain.com';
 * After that, this endpoint can be used.
 */
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid role. Must be PATIENT, DOCTOR, or ADMIN.' });
    }
    const { role } = parsed.data;

    // Prevent admin from demoting themselves
    if (req.user.userId === userId && role !== 'ADMIN') {
      return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true }
    });

    res.json({ message: `Role updated to ${role}`, user: updatedUser });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Admin updateUserRole error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

module.exports = { listUsers, updateUserRole };
