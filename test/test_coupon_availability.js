import assert from 'node:assert/strict';
import {
    HINDU_FESTIVALS,
    STANDING_OFFERS,
    validateCoupon,
    getActiveFestivalOffer,
    getCuratedOffers
} from '../src/utils/festivalOffers.js';
import { quoteConsultation } from '../src/utils/consultationPricing.js';

const at = (iso) => new Date(iso);
const check = (code, amount, now, flags = {}) => validateCoupon(code, amount, Boolean(flags.isNew), false, null, now);

const SATURDAY_OUT_OF_SEASON = at('2026-10-31T06:00:00Z');

const tests = {
    'festival codes are rejected out of season': () => {
        for (const code of ['UGADI25', 'SRIRAMA20', 'RAKSHA20', 'GANESHA25', 'NAVRATRI25', 'DIWALI30', 'VIDYA20', 'SOUBHAGYA25']) {
            assert.equal(check(code, 701, SATURDAY_OUT_OF_SEASON).valid, false, code);
        }
    },

    'festival codes work on the first and last day of their window, in Indian time': () => {
        // Diwali 2026 runs 1-10 November in India (UTC+05:30)
        assert.equal(check('DIWALI30', 701, at('2026-10-31T18:29:00Z')).valid, false, '23:59 IST on 31 Oct');
        assert.equal(check('DIWALI30', 701, at('2026-10-31T18:31:00Z')).finalAmount, 491, '00:01 IST on 1 Nov');
        assert.equal(check('DIWALI30', 701, at('2026-11-10T18:29:00Z')).valid, true, '23:59 IST on 10 Nov');
        assert.equal(check('DIWALI30', 701, at('2026-11-10T18:31:00Z')).valid, false, '00:01 IST on 11 Nov');
    },

    'a festival with no dates for the year is rejected': () => {
        assert.equal(check('DIWALI30', 701, at('2028-10-20T06:00:00Z')).valid, false);
    },

    'every festival has well-formed dates': () => {
        for (const festival of HINDU_FESTIVALS) {
            assert.ok(festival.windows?.length > 0, festival.id);
            for (const [start, end] of festival.windows) {
                assert.match(start, /^\d{4}-\d{2}-\d{2}$/, festival.id);
                assert.match(end, /^\d{4}-\d{2}-\d{2}$/, festival.id);
                assert.ok(start <= end, festival.id);
            }
        }
    },

    "weekday codes only work on their day, including aliases": () => {
        const tuesday = at('2026-11-03T06:00:00Z');
        assert.equal(check('MANGALVAR', 701, tuesday).finalAmount, 561);
        assert.equal(check('HANUMAN', 701, tuesday).valid, true);
        assert.equal(check('MANGALVAR', 701, SATURDAY_OUT_OF_SEASON).valid, false);
        assert.equal(check('HANUMAN', 701, SATURDAY_OUT_OF_SEASON).valid, false);
        assert.equal(check('LAKSHMI20', 701, tuesday).valid, false);
    },

    'the weekday changes at midnight in India, not UTC': () => {
        // Monday 18:31 UTC is already Tuesday 00:01 in India
        const earlyTuesdayInIndia = at('2026-11-02T18:31:00Z');
        assert.equal(check('MANGALVAR', 701, earlyTuesdayInIndia).valid, true);
        assert.equal(check('SOMVAR', 701, earlyTuesdayInIndia).valid, false);
        assert.equal(getActiveFestivalOffer(earlyTuesdayInIndia, null).code, 'MANGALVAR');
    },

    'the always-on 30% codes are gone': () => {
        for (const code of ['UTSAV30', 'FESTIVAL30', 'UTSAV', 'FESTIVAL']) {
            assert.equal(check(code, 701, SATURDAY_OUT_OF_SEASON).valid, false, code);
        }
    },

    'standing offers still work every day': () => {
        assert.equal(check('SHUBH20', 701, at('2026-11-03T06:00:00Z')).finalAmount, 561);
        assert.equal(check('UTSAV20', 701, at('2026-11-03T06:00:00Z')).finalAmount, 561);
        assert.equal(check('FIRSTASTRO', 701, at('2026-11-03T06:00:00Z'), { isNew: true }).finalAmount, 600);
        assert.equal(check('FIRST', 701, at('2026-11-03T06:00:00Z'), { isNew: true }).finalAmount, 600);
        assert.equal(check('NEWUSER', 101, at('2026-11-03T06:00:00Z'), { isNew: true }).finalAmount, 51);
    },

    'loyalty fallbacks still point at LOYALTY25 after the list changed': () => {
        const loyalty = { isValuableCustomer: true, isVipEligible: true, bookingCount: 3 };
        for (const code of ['VIP', 'LOYALTY', 'RETURNING', 'LOYALTY25']) {
            assert.equal(validateCoupon(code, 701, false, true, loyalty, SATURDAY_OUT_OF_SEASON).finalAmount, 526, code);
        }
        assert.equal(STANDING_OFFERS.some(o => o.code === 'UTSAV30'), false);
    },

    'SHIVOHAM gives flat ₹101 during Shivratri and 20% on other Mondays': () => {
        const shivratriMonday = at('2027-03-01T06:00:00Z');
        const ordinaryMonday = at('2026-11-02T06:00:00Z');
        const ordinaryTuesday = at('2026-11-03T06:00:00Z');
        assert.equal(check('SHIVOHAM', 301, shivratriMonday).discountAmount, 101);
        assert.equal(check('SHIVOHAM', 301, ordinaryMonday).discountAmount, 60);
        assert.equal(check('SHIVOHAM', 301, ordinaryTuesday).valid, false);
    },

    'the offer chip matches what the coupon actually gives': () => {
        const shivratri = getActiveFestivalOffer(at('2027-03-01T06:00:00Z'), 'shivratri');
        assert.equal(shivratri.discountType, 'flat');
        const chip = getCuratedOffers(101, false, false, null, shivratri).find(o => o.code === 'SHIVOHAM');
        assert.equal(chip.tag, '₹101 OFF');
        assert.equal(chip.savings, 'Save ₹80');
        assert.equal(check('SHIVOHAM', 101, at('2027-03-01T06:00:00Z')).discountAmount, 80);
    },

    'a festival campaign is not promoted outside its dates': () => {
        const offer = getActiveFestivalOffer(SATURDAY_OUT_OF_SEASON, 'ugadi');
        assert.equal(offer.isFestival, false);
        assert.equal(offer.code, 'SHUBH20');
        assert.equal(getActiveFestivalOffer(at('2027-04-07T06:00:00Z'), 'ugadi').code, 'UGADI25');
    },

    'the server quote uses the same rules': () => {
        const quote = quoteConsultation({ consultationTypeId: 'deep', couponCode: 'UTSAV30' });
        assert.equal(quote.valid, false);
        assert.equal(quoteConsultation({ consultationTypeId: 'deep', couponCode: 'SHUBH20' }).finalAmount, 561);
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

console.log(failed ? `\n${failed} test(s) failed` : `\nAll ${Object.keys(tests).length} coupon availability tests passed`);
process.exit(failed ? 1 : 0);
