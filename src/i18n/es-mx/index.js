export default {
  order: {
    label: 'Pedido | Pedidos',
    new: 'Nuevo pedido',
    review: 'Resumen',
    description: 'Nombre del pedido',
    details: 'Detalles',
    createdAt: 'Pedido el',
    updatedAt: 'Actualizado el',
    dates: 'Fechas',
    confirm_exit_title: 'Tienes un pedido en proceso',
    confirm_exit_message: 'Al continuar perderás los cambios ¿Continuar?',
    status: {
      label: 'Estado',
      options: {
        'OPEN': { label: 'Nuevo' },
        'IN_PROCESS': { label: 'En proceso' },
        'CLOSED': { label: 'Cancelado' },
        'WON': { label: 'Entregado' }
      }
    },
    step1_desc: 'Agrega los artículos a tu pedido',
    step2_desc: 'Agrega una descripción',
    step3_desc: 'Confirma y envía tu pedido',
    rules: {
      too_much: 'Ups, demasiado',
      minimum: 'Debe haber al menos {count}'
    }
  },
  customer: {
    label: 'Cliente | Clientes',
    name: 'Nombre',
    new: 'Nuevo cliente',
    make_call: 'Llamar por teléfono',
    send_email: 'Enviar correo electrónico',
    email: 'Correo electrónico',
    phone: 'Teléfono | Teléfonos',
    extuid_code: 'Código de cliente',
    share_link_help: 'Comparte este código para que tu cliente pueda realizarte pedidos.',
    rules: {
      phone_length: 'Teléfono debe tener {count} dígitos',
      pick_customer: 'Selecciona cliente'
    }
  },
  pricing: {
    label: 'Precio | Precios',
    total: 'Total'
  },
  item: {
    label: 'Artículo | Artículos',
    description: 'Descripción',
    code: 'Código',
    quantity: 'Cantidad',
    provider: 'Marca',
    add_item: 'Agregar articulo',
    new: 'Nuevo artículo'
  },
  app: {
    label: 'GOM',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    abort: 'Cancelar',
    confirm: 'Confirmación',
    yes: 'Sí',
    no: 'No',
    sign_out: 'Cerrar sesión',
    continue_question: '¿Continuar?',
    see_more: 'Ver más',
    filter_by_status: 'Filtrar por status',
    no_results: 'Sin resultados',
    to: 'para',
    user_name: 'Usuario',
    password: 'Password',
    sign_in: 'Iniciar sesión',
    share: 'Compartir con',
    copy_link: 'Copiar enlace',
    copied_link: 'Enlace copiado',
    rules: {
      required: 'Campo requerido',
      max_length: 'Máximo {count} caracteres'
    }
  },
  notifications: {
    positive: {
      changes_saved: 'Cambios guardados'
    },
    error: {
      generic: 'Ups algo salió mal, inténtalo más tarde :(',
      wrong_credentials: 'Usuario o contraseña incorrectos',
      signin_failed: 'No pudimos iniciar sesión. Inténtalo más tarde'
    }
  }
}
