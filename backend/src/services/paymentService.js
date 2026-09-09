module.exports = {
    createPreference: async (item) => {
        return {
            id: 'pref_demo_123456',
            init_point: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=demo',
            item
        };
    }
};
