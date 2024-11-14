describe('Sample test', () => {
    
    test('test that true === true', () => {
        expect(true).toBe(true);
    });

    test('there is no I in team', () => {
        expect('team').not.toMatch(/I/);
    });

});