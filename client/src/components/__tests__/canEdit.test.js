import canEdit from '../../services/canEdit';

describe('can Edit order', () => {
  it('returns true for orders made now', () => {
    const date = new Date();
    expect(canEdit(date)).toBe(true);
  });
});
