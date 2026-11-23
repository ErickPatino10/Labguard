import jwt from 'jsonwebtoken'

// Verifica que la petición traiga un token válido
export const verificarToken = (req, res, next) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' })
    }

    const token = header.split(' ')[1]

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido o expirado' })
    }
}

// Permite el acceso solo a los roles indicados
export const verificarRol = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'No tienes permiso para esta acción' })
        }
        next()
    }
}
