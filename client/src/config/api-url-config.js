const apiUrlConfig = (apiName) => {
    let apiUrl;

    switch (apiName) {
        case 'private-notes':
            apiUrl = 'private/notes/';
            break;

        case 'private-note-save':
            apiUrl = 'private/note/save';
            break;

        case 'private-note-delete':
            apiUrl = 'private/note/delete/';
            break;

        case 'private-tags':
            apiUrl = 'private/tags';
            break;

        case 'user-add':
            apiUrl = 'user/add';
            break;

        default:
            break;
    }

    return apiUrl;
};

export default apiUrlConfig;