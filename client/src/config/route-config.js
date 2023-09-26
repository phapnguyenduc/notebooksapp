const routeConfig = (routeName) => {
    let routeUrl;

    switch (routeName) {
        case 'root':
            routeUrl = '/';
            break;

        case 'note-save':
            routeUrl = '/note/save';
            break;

        case 'notes':
            routeUrl = '/notes';
            break;

        default:
            break;
    }

    return routeUrl;
};

export default routeConfig;