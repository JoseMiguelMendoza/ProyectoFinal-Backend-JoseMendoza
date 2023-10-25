document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('.deleteUserButton').forEach((button) => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-id');
            Swal.fire({
                title: '¿Estas seguro?',
                text: "No hay vuelta atrás.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then(async(result) => {
                if (result.isConfirmed) {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        button.parentElement.parentElement.remove();
                    } else {
                        return Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al eliminar usuario.',
                            showConfirmButton: true
                        });
                    }
                    Swal.fire(
                        'Eliminado!',
                        '¡El usuario ha sido eliminado!',
                        'success'
                    )
                }
            })
        });
    });
});