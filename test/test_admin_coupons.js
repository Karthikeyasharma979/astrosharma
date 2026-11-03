import assert from 'node:assert/strict';
import { isBuiltInCouponCode } from '../src/utils/festivalOffers.js';
import { quoteAdminCoupon } from '../src/utils/consultationPricing.js';

const NOW = new Date('2026-11-15T06:00:00Z');
const coupon = (overrides = {}) => ({
    code: 'SUMMER15',
    name: 'Instagram campaign',
    discountType: 'percentage',
    discountValue: 15,
    minAmount: 0,
    startDate: '',
    endDate: '',
    usageLimit: null,
    oneUsePerCustomer: false,
    newCustomersOnly: false,
    isActive: true,
    ...overrides
});
const quote = (overrides = {}, params = {}) => quoteAdminCoupon({
    consultationTypeId: 'deep',
    couponCode: 'summer15',
    coupon: coupon(overrides),
    hasCustomerDetails: true,
    isNewUser: true,
    now: NOW,
    ...params
});

const tests = {
    'percentage and flat coupons price correctly': () => {
        const percent = quote();
        assert.deepEqual(
            [percent.valid, percent.baseAmount, percent.discountAmount, percent.finalAmount, percent.couponCode, percent.offerName],
            [true, 701, 105, 596, 'SUMMER15', 'Instagram campaign']
        );
        assert.equal(quote({ discountType: 'flat', discountValue: 200 }).finalAmount, 501);
    },

    'a customer never pays below ₹21': () => {
        assert.equal(quote({ discountValue: 100 }).finalAmount, 21);
        assert.equal(quote({ discountType: 'flat', discountValue: 5000 }).finalAmount, 21);
    },

    'an unknown or paused coupon is rejected with the same message': () => {
        const expected = "Coupon code 'SUMMER15' is invalid or not active today.";
        assert.equal(quote({}, { coupon: null }).message, expected);
        assert.equal(quote({ isActive: false }).message, expected);
    },

    'dates are inclusive and follow Indian time': () => {
        assert.equal(quote({ startDate: '2026-11-15', endDate: '2026-11-15' }).valid, true);
        assert.equal(quote({ startDate: '2026-11-16' }).valid, false, 'not started');
        assert.equal(quote({ endDate: '2026-11-14' }).valid, false, 'ended');
        // 18:31 UTC on the 14th is already 00:01 on the 15th in India
        const justAfterMidnight = { now: new Date('2026-11-14T18:31:00Z') };
        assert.equal(quote({ endDate: '2026-11-14' }, justAfterMidnight).valid, false);
        assert.equal(quote({ startDate: '2026-11-15' }, justAfterMidnight).valid, true);
    },

    'the total usage limit stops the coupon when reached': () => {
        assert.equal(quote({ usageLimit: 5 }, { totalUses: 4 }).valid, true);
        assert.equal(quote({ usageLimit: 5 }, { totalUses: 5 }).message, 'This coupon has reached its usage limit.');
    },

    'one use per customer is enforced': () => {
        assert.equal(quote({ oneUsePerCustomer: true }, { customerUses: 0 }).valid, true);
        assert.equal(quote({ oneUsePerCustomer: true }, { customerUses: 1 }).message, 'You have already used this coupon.');
    },

    'first-time coupons reject returning customers': () => {
        assert.equal(quote({ newCustomersOnly: true }).valid, true);
        assert.equal(quote({ newCustomersOnly: true }, { isNewUser: false }).message, 'This coupon is only for first-time customers.');
    },

    'customer-limited coupons need a phone number or email': () => {
        for (const limit of [{ oneUsePerCustomer: true }, { newCustomersOnly: true }]) {
            assert.equal(quote(limit, { hasCustomerDetails: false }).valid, false);
        }
        assert.equal(quote({}, { hasCustomerDetails: false }).valid, true);
    },

    'the minimum order is checked against the selected service': () => {
        assert.equal(quote({ minAmount: 300 }, { consultationTypeId: 'kundali' }).valid, false);
        assert.equal(quote({ minAmount: 300 }, { consultationTypeId: 'muhurtham' }).valid, true);
    },

    'an unknown service is rejected': () => {
        assert.equal(quote({}, { consultationTypeId: 'nope' }).valid, false);
    },

    'built-in codes are recognised in or out of season, and others are not': () => {
        for (const code of ['SHUBH20', 'firstastro', ' DIWALI30 ', 'UGADI25', 'HANUMAN', 'VIP', 'WELCOME']) {
            assert.equal(isBuiltInCouponCode(code), true, code);
        }
        for (const code of ['SUMMER15', 'UTSAV30', '']) {
            assert.equal(isBuiltInCouponCode(code), false, code);
        }
    }
};

let failed = 0;
for (const [name, run] of Object.entries(tests)) {
    try {
        run();
        console.log(`✅ ${name}`);
    } catch (err) {
        failed++;
        console.error(`❌ ${name}\n   ${err.message}`);
    }
}

console.log(failed ? `\n${failed} test(s) failed` : `\nAll ${Object.keys(tests).length} admin coupon tests passed`);
process.exit(failed ? 1 : 0);
