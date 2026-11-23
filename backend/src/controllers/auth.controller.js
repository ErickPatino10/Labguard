import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

export const registrar = async (req, res) => {
    try {
        const { nombre, apellido, cedula, email, password, rol } = req.body

        const existe = await Usuario.findOne({ $or: [{ email }, { cedula }] })
        if (existe) {
            return res.status(400).json({ mensaje: 'El email o la cédula ya están registrados' })
        }

        const passwordCifrada = await bcrypt.hash(password, 10)

        const usuario = await Usuario.create({
            nombre,
            apellido,
            cedula,
            email,
            password: passwordCifrada,
            rol
        })

        res.status(201).json({ mensaje: 'Usuario registrado', id: usuario._id })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar', error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const usuario = await Usuario.findOne({ email })
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password)
        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
        }

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.json({ mensaje: 'Inicio de sesión correcto', token })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message })
    }
}

export const perfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' })
        }
        res.json(usuario)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el perfil', error: error.message })
    }
}
