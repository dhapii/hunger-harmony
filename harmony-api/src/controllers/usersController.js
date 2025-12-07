const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

exports.getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, dan password harus diisi' });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        name, 
        email, 
        password: hashedPassword, 
        role: role || 'user' 
      }])
      .select('id, name, email, role')
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'User berhasil dibuat',
      user: data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Tidak ada data untuk diupdate' });
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, name, email, role')
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({
      message: 'User berhasil diupdate',
      user: data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({
      message: 'User berhasil dihapus',
      id: data.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};
