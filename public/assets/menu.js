// sortable menu items functionality and post submission
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

        // find id of menu item that was swapped
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

// sortable submenu items functionality and post submission
let draggableSubmenuContainer = $('.draggable.submenu-item').closest('.draggableContainer');
let _id_submenu_oldPosition = 0;
let draggableSubmenuContainer_arr = [];

draggableSubmenuContainer.sortable({
    placeholder: "ui-state-highlight",
    forcePlaceholderSize: true,

    start: function (e, ui) {
        _id_submenu_oldPosition = $(ui.item).index() + 1;
        // redefine draggable container to be relative to this draggable item, in instances where there are more than one
        draggableSubmenuContainer_arr = $(ui.item).closest('.draggableContainer').sortable("toArray");
    },

    update: function (e, ui) {
        const _id = $(ui.item).attr('id');
        const _id_newPosition = $(ui.item).index() + 1;
        const draggableSubmenuContainer_arr_updated = draggableSubmenuContainer.sortable("toArray");
        let _submenuSwapped = '';

        // find id of menu item that was swapped
        for (let i = 0; i < draggableSubmenuContainer_arr.length; i++) {
            const _menu = draggableSubmenuContainer_arr[i];

            if (_menu == _id) {
                _submenuSwapped = draggableSubmenuContainer_arr_updated[i];
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

// auto populate menu item fields when existing url is selected
$('.menu-item-url-select').change(function () {
    const $this = $(this);
    const selectedUrl = $this.find("option:selected").data('route');
    const selectedText = $this.find("option:selected").data('title');
    const closestTextField = $this.siblings(".addmenuitem").find('.addmenuitem-text');
    const closestUrlField = $this.siblings(".addmenuitem").find('.addmenuitem-url');
    const closestRefField = $this.siblings(".addmenuitem").find('.addmenuitem-ref');
    const closestOriginalRouteField = $this.siblings(".addmenuitem").find('.addmenuitem-or');

    closestTextField.val(selectedText);
    closestUrlField.val(selectedUrl);
    closestOriginalRouteField.val(selectedUrl);
    closestRefField.val('true');
});
//# sourceMappingURL=menu.js.map
