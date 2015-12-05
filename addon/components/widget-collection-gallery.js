import Ember from 'ember';
import CollectionWidget from 'ember-eureka/widget-collection';
import layout from '../templates/components/widget-collection-gallery';

export default CollectionWidget.extend({
    layout: layout,

    label: Ember.computed.alias('config.label'),
    options: Ember.computed.alias('config.options'),
    imageSrc: Ember.computed.alias('config.imageSrc'),
    imageTitle: Ember.computed.alias('config.imageTitle'),
    imageDescription: Ember.computed.alias('config.imageDescription'),

    isLoading: false,

    data: Ember.computed(function() {
        return Ember.A();
    }),

    pathPrefix: Ember.computed.alias('config.filePath.prefix'),

    filesEndpoint: Ember.computed('appConfig', function() {
        let apiEndpoint = this.get('appConfig.apiEndpoint');
        let uploadEndpoint = this.get('appConfig.fileUploadEndpoint');
        return `${apiEndpoint}${uploadEndpoint}`;
    }),

    pathUrl: Ember.computed('filesEndpoint', 'pathPrefix', function() {
        let endpoint = this.get('filesEndpoint');
        let pathPrefix = this.get('pathPrefix') || '';
        if (pathPrefix && pathPrefix[0] !== '/') {
            pathPrefix = `/${pathPrefix}`;
        }
        return `${endpoint}${pathPrefix}`;
    }),

    pathThumbnail: Ember.computed('filesEndpoint', 'pathPrefix', function() {
        let endpoint = this.get('filesEndpoint');
        let pathPrefix = this.get('pathPrefix') || '';
        if (pathPrefix && pathPrefix[0] !== '/') {
            pathPrefix = `/${pathPrefix}`;
        }
        return `${endpoint}/i/thumb/400x400${pathPrefix}`;
    }),


    /** update the collection from the `routeModel.query` */
    fetch: Ember.on('init', Ember.observer(
      'routeModel.query.hasChanged', 'routeModel.meta', 'options',
      'imageTitle', 'imageSrc', 'imageDescription',
      'store', 'pathUrl', 'pathThumbnail', function() {

        this.set('isLoading', true);
        let routeQuery = this.get('routeModel.query')._toObject();

        let query = {};
        for (let fieldName of Object.keys(routeQuery)) {
            if (fieldName[0] === '_') {
                query[fieldName.slice(1)] = routeQuery[fieldName];
            } else {
                query.filter = query.filter || {};
                query.filter[fieldName] = routeQuery[fieldName];
            }
        }

        let store = this.get('store');

        let imageSrc = this.get('imageSrc');
        let imageTitle = this.get('imageTitle');
        let imageDescription = this.get('imageDescription');

        let aggregator = {
            src: imageSrc
        };

        if (imageTitle) {
            aggregator.title = imageTitle;
        }
        if (imageDescription) {
            aggregator.description = imageDescription;
        }

        let options = this.get('options');

        let pathUrl = this.get('pathUrl');
        let pathThumbnail = this.get('pathThumbnail');

        this.set('isLoading', true);
        store.aggregate(aggregator, query, options).then((data) => {
            data = data.map((item) => {
                if (item.src[0] !== '/') {
                    item.src = `/${item.src}`;
                }
                return {
                    src: `${pathUrl}${item.src}`,
                    thumbnail: `${pathThumbnail}${item.src}`,
                    title: item.title,
                    description: item.description
                };
            });
            this.set('data', data);
            this.set('isLoading', false);
        }).catch((error) => {
            console.error(error);
            this.set('isLoading', false);
        });
    }))

});
