const getMenuPrincipal = (role = 'USER_ROLE') => {
    const menu = [
        {
            title: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { title: 'Main', url: '/' },
                { title: 'ProgressBar', url: 'progress' },
                { title: 'Gráficas', url: 'grafica1' },
                { title: 'Promesas', url: 'promesas' },
                { title: 'Rxjs', url: 'rxjs' },
            ]
        },
        {
            title: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                { title: 'Usuarios', url: 'usuarios' },
                { title: 'Hospitales', url: 'hospitales' },
                { title: 'Médicos', url: 'medicos' },
            ]
        }
    ];

    if (role !== 'ADMIN_ROLE') {
        menu[1].submenu.splice(0, 1);
    }

    return menu;
}

module.exports = {
    getMenuPrincipal
}