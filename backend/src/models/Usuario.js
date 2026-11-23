import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        cedula: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        rol: {
            type: String,
            enum: ['administrador', 'docente', 'estudiante'],
            default: 'estudiante'
        },
        activo: { type: Boolean, default: true }
    },
    { timestamps: true }
)

export default mongoose.model('Usuario', usuarioSchema)
