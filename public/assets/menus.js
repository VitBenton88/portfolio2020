//sortable menu items functionality and post submission
const draggableMenuContainer = $('.draggable.menu-item').closest('.draggableContainer');
let _id_menu_oldPosition = 0;
let draggableMenuContainer_arr = [];

draggableMenuContainer.sortable({
    handle: '.card-title',
    cancel: '.add-item',
    placeholder: "ui-state-highlight",
    forcePlaceholderSize: true,

    start: function (e, ui) {
        _id_menu_oldPosition = $(ui.item).index() + 1;
        draggableMenuContainer_arr = draggableMenuContainer.sortable("toArray");
    },

    update: function (e, ui) {
        const _id = $(ui.item).attr('id');
        const _id_newPosition = $(ui.item).index() + 1;
        const draggableMenuContainer_arr_updated = draggableMenuContainer.sortable("toArray");
        let _menuSwapped;

        //find id of menu item that was swapped
        for (let i = 0; i < draggableMenuContainer_arr.length; i++) {
            const _menu = draggableMenuContainer_arr[i];

            if (_menu == _id) {
                _menuSwapped = draggableMenuContainer_arr_updated[i];
                break;
            }

        }

        $.ajax({
            type: "PUT",
            url: "/updatemenuitemposition",
            data: {
                _id,
                _id_newPosition,
                _id_menu_oldPosition,
                _menuSwapped
            },
            success: function () {
                menuPositionUpdate('Menu item');
            }
        });
    }
});

//sortable submenu items functionality and post submission
const draggableSubmenuContainer = $('.draggable.submenu-item').closest('.draggableContainer');
let _id_submenu_oldPosition = 0;
let draggableSubmenuContainer_arr = [];

draggableSubmenuContainer.sortable({
    placeholder: "ui-state-highlight",
    forcePlaceholderSize: true,

    start: function (e, ui) {
        _id_submenu_oldPosition = $(ui.item).index() + 1;
        draggableSubmenuContainer_arr = draggableSubmenuContainer.sortable("toArray");
    },

    update: function (e, ui) {
        const _id = $(ui.item).attr('id');
        const _id_newPosition = $(ui.item).index() + 1;
        const draggableSubmenuContainer_arr_updated = draggableSubmenuContainer.sortable("toArray");
        let _submenuSwapped;

        //find id of menu item that was swapped
        for (let i = 0; i < draggableSubmenuContainer_arr.length; i++) {
            const _menu = draggableSubmenuContainer_arr[i];

            if (_menu == _id) {
                _submenuSwapped = $(`#${draggableSubmenuContainer_arr_updated[i]}`).data('id');
                break;
            }

        }

        $.ajax({
            type: "PUT",
            url: "/updatesubmenuitemposition",
            data: {
                _id,
                _id_newPosition,
                _id_submenu_oldPosition,
                _submenuSwapped
            },
            success: function () {
                menuPositionUpdate('Submenu item');
            }
        });
    }
});

// auto populate slug value based off name entered (menus)
$('#addmenu [name="name"]').focusout(function () {
    const nameValue = $(this).val().trim().replace(/\s+/g, '-').toLowerCase();

    $('#addmenu [name="slug"]').val(nameValue);
});
//# sourceMappingURL=menus.js.map
