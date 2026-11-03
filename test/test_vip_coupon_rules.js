import { 
    validateCoupon, 
    getCustomerLoyaltyInfo, 
    recordCustomerBooking,
    getCuratedOffers 
} from '../src/utils/festivalOffers.js';

// Setup Mock LocalStorage for Node testing
const mockStorage = {};
global.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
global.window = {};

function runTests() {
    console.log('--- Starting VIP Coupon Logic Unit Tests ---');

    // -------------------------------------------------------------
    // Test Case 1: Placed an order (paid 1 time), next day visits.
    // Must NOT get VIP coupon! Requires minimum 2 orders.
    // -------------------------------------------------------------
    localStorage.clear();
    recordCustomerBooking('9876543210', 'test@example.com', 'FIRSTASTRO');

    let info = getCustomerLoyaltyInfo();
    console.log('\n[Case 1] After 1st booking (paid 1 time):');
    console.log(' - isValuableCustomer:', info.isValuableCustomer); // should be true (Silver Seeker)
    console.log(' - bookingCount:', info.bookingCount); // 1
    console.log(' - isVipEligible:', info.isVipEligible); // MUST BE FALSE
    console.log(' - ordersUntilNextVip:', info.ordersUntilNextVip); // 1

    if (info.isVipEligible !== false) {
        throw new Error('FAIL: Customer who paid only 1 time was marked as VIP eligible!');
    }

    // Try applying LOYALTY25
    let couponResult = validateCoupon('LOYALTY25', 701, false, info.isValuableCustomer, info);
    console.log(' - Attempting LOYALTY25 application:', couponResult);
    if (couponResult.valid !== false) {
        throw new Error('FAIL: LOYALTY25 should be rejected for 1-time payer!');
    }
    console.log(' - Curated offers count for 1-time payer (VIP should be absent):', getCuratedOffers(701, false, info.isValuableCustomer, info).map(o => o.code));
    if (getCuratedOffers(701, false, info.isValuableCustomer, info).some(o => o.code === 'LOYALTY25')) {
        throw new Error('FAIL: LOYALTY25 showed up in curated offers for 1-time payer!');
    }
    console.log('✅ Case 1 Passed: 1-time paying customer does NOT get VIP coupon.');

    // -------------------------------------------------------------
    // 2nd booking made (Regular / non-VIP dakshina)
    // -------------------------------------------------------------
    recordCustomerBooking('9876543210', 'test@example.com', '');
    info = getCustomerLoyaltyInfo();
    console.log('\n[Midway] After 2nd booking (paid 2 times):');
    console.log(' - bookingCount:', info.bookingCount); // 2
    console.log(' - isVipEligible:', info.isVipEligible); // MUST BE TRUE (meets min 2 orders, no prior VIP use)

    if (info.isVipEligible !== true) {
        throw new Error('FAIL: Customer with 2 completed bookings should now be eligible for first VIP coupon!');
    }

    couponResult = validateCoupon('LOYALTY25', 701, false, info.isValuableCustomer, info);
    console.log(' - Attempting LOYALTY25 application on order #3:', couponResult);
    if (!couponResult.valid) {
        throw new Error('FAIL: LOYALTY25 should be valid on order #3!');
    }
    console.log('✅ Unlocked: VIP coupon successfully unlocked on 3rd consultation.');

    // -------------------------------------------------------------
    // Test Case 2: User completes order #3 with VIP coupon (LOYALTY25)
    // Order #4 must be in GAP (VIP coupon blocked).
    // Order #5 must be unlocked again (Gap of 1 satisfied).
    // -------------------------------------------------------------
    recordCustomerBooking('9876543210', 'test@example.com', 'LOYALTY25');
    info = getCustomerLoyaltyInfo();
    console.log('\n[Case 2] After order #3 used LOYALTY25 (Now ordering #4):');
    console.log(' - bookingCount:', info.bookingCount); // 3
    console.log(' - lastVipBookingIndex:', info.lastVipBookingIndex); // 3
    console.log(' - ordersSinceLastVip:', info.ordersSinceLastVip); // 0
    console.log(' - isVipEligible:', info.isVipEligible); // MUST BE FALSE (gap of 1 not met)
    console.log(' - ordersUntilNextVip:', info.ordersUntilNextVip); // 1

    if (info.isVipEligible !== false) {
        throw new Error('FAIL: VIP coupon should be on cooldown for immediate consecutive order #4!');
    }

    couponResult = validateCoupon('LOYALTY25', 701, false, info.isValuableCustomer, info);
    console.log(' - Attempting LOYALTY25 on order #4:', couponResult);
    if (couponResult.valid !== false) {
        throw new Error('FAIL: LOYALTY25 should be rejected due to gap requirement on order #4!');
    }
    console.log('✅ Case 2 Step A Passed: Order #4 properly blocked from using VIP coupon consecutively.');

    // Customer places regular order #4
    recordCustomerBooking('9876543210', 'test@example.com', '');
    info = getCustomerLoyaltyInfo();
    console.log('\n[Case 2 Step B] After regular order #4 placed (Now ordering #5):');
    console.log(' - bookingCount:', info.bookingCount); // 4
    console.log(' - lastVipBookingIndex:', info.lastVipBookingIndex); // 3
    console.log(' - ordersSinceLastVip:', info.ordersSinceLastVip); // 1 (4 - 3 = 1)
    console.log(' - isVipEligible:', info.isVipEligible); // MUST BE TRUE (gap of 1 satisfied!)

    if (info.isVipEligible !== true) {
        throw new Error('FAIL: VIP coupon should be unlocked on order #5 after 1 regular order gap!');
    }

    couponResult = validateCoupon('LOYALTY25', 701, false, info.isValuableCustomer, info);
    console.log(' - Attempting LOYALTY25 on order #5:', couponResult);
    if (!couponResult.valid) {
        throw new Error('FAIL: LOYALTY25 should be valid on order #5!');
    }
    console.log('✅ Case 2 Step B Passed: Order #5 successfully unlocked after 1 regular order gap!');

    console.log('\n🎉 ALL VIP COUPON RULE TESTS PASSED PERFECTLY!\n');
}

runTests();
