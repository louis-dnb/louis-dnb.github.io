'use strict';

export const TitleLabel = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div');
        container.id = 'titleLabel';
        container.innerHTML = "<a href='https://github.com/explv/'><span id='explv'>Explv</span>'s</a> + <a href='https://github.com/mejrs/'>Mej's</a> Map";

        L.DomEvent.disableClickPropagation(container);
        return container;
    }
});