"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    const userA = await prisma.user.upsert({
        where: { mobile: '09120000000' },
        update: {},
        create: {
            mobile: '09120000000',
            first_name: 'Ali',
            last_name: 'Ahmadi',
            national_code: '0012345678',
            role: client_1.UserRole.USER,
        },
    });
    console.log(`👤 User A: ${userA.first_name} ${userA.last_name} (${userA.mobile})`);
    const userAdmin = await prisma.user.upsert({
        where: { mobile: '09120000001' },
        update: {},
        create: {
            mobile: '09120000001',
            first_name: 'Admin',
            last_name: 'Adminian',
            national_code: '0098765432',
            role: client_1.UserRole.ADMIN,
        },
    });
    console.log(`👤 Admin: ${userAdmin.first_name} ${userAdmin.last_name} (${userAdmin.mobile})`);
    const userB = await prisma.user.upsert({
        where: { mobile: '09120000002' },
        update: {},
        create: {
            mobile: '09120000002',
            first_name: 'Mina',
            last_name: 'Karimi',
            national_code: '0011122233',
            role: client_1.UserRole.USER,
        },
    });
    console.log(`👤 User B: ${userB.first_name} ${userB.last_name} (${userB.mobile})`);
    const orderNumbersToClean = ['EBAN-SEED-A-0001'];
    for (let i = 1; i <= 10; i++) {
        orderNumbersToClean.push(`EBAN-DUMMY-${String(i).padStart(4, '0')}`);
    }
    const existingOrders = await prisma.order.findMany({
        where: { order_number: { in: orderNumbersToClean } },
        select: { id: true, quote_id: true },
    });
    const orderIds = existingOrders.map((o) => o.id);
    const quoteIds = existingOrders.map((o) => o.quote_id).filter((id) => id !== null);
    if (orderIds.length > 0) {
        await prisma.document.deleteMany({ where: { order_id: { in: orderIds } } });
        await prisma.insurancePolicy.deleteMany({ where: { order_id: { in: orderIds } } });
        await prisma.payment.deleteMany({ where: { order_id: { in: orderIds } } });
    }
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
    if (quoteIds.length > 0) {
        await prisma.quote.deleteMany({ where: { id: { in: quoteIds } } });
    }
    const mainQuote = await prisma.quote.create({
        data: {
            user_id: userA.id,
            product_slug: 'third-party',
            status: 'ORDERED',
            data_json: {
                plate: '12345678',
                brand: 'Peugeot',
                model: '206',
                year: 1400,
                previousCompany: 'iran',
                expirationDate: '2026-01-01',
                discountPercent: 0,
                firstName: 'Ali',
                lastName: 'Ahmadi',
                nationalCode: '0012345678',
                birthDate: '1990-05-01',
            },
            amount: 5000000,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
    console.log(`📝 Main Quote created: ${mainQuote.id}`);
    const mainOrder = await prisma.order.create({
        data: {
            user_id: userA.id,
            quote_id: mainQuote.id,
            order_number: 'EBAN-SEED-A-0001',
            status: 'PROCESSING',
            amount: 5000000,
        },
    });
    console.log(`📦 Main Order created: ${mainOrder.order_number}`);
    await prisma.payment.create({
        data: {
            order_id: mainOrder.id,
            gateway: 'mock',
            status: 'PAID',
            amount: 5000000,
            authority: 'seeded-auth-001',
            transaction_id: 'seeded-tx-001',
            paid_at: new Date(),
        },
    });
    console.log(`💳 Main Payment created`);
    await prisma.insurancePolicy.create({
        data: {
            order_id: mainOrder.id,
            policy_number: 'POL-SEED-A-001',
            status: 'ACTIVE',
            start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            file_url: '/storage/seeded-policy-a.pdf',
        },
    });
    console.log(`🛡️  Main InsurancePolicy created`);
    await prisma.document.create({
        data: {
            order_id: mainOrder.id,
            type: 'NATIONAL_CARD',
            file_url: '/storage/seeded-national-a.jpg',
            status: 'APPROVED',
        },
    });
    console.log(`📄 Main Document created`);
    const statuses = ['DRAFT', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    const products = ['third-party', 'body', 'life', 'travel'];
    for (let i = 1; i <= 10; i++) {
        const user = i <= 5 ? userA : userB;
        const status = statuses[(i - 1) % statuses.length];
        const productSlug = products[(i - 1) % products.length];
        const orderNumber = `EBAN-DUMMY-${String(i).padStart(4, '0')}`;
        const amount = 1000000 + i * 500000;
        const dummyQuote = await prisma.quote.create({
            data: {
                user_id: user.id,
                product_slug: productSlug,
                status: status === 'CANCELLED' ? 'EXPIRED' : status === 'DRAFT' ? 'DRAFT' : 'ORDERED',
                data_json: {
                    dummy: true,
                    orderIndex: i,
                    product: productSlug,
                },
                amount,
                expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            },
        });
        const dummyOrder = await prisma.order.create({
            data: {
                user_id: user.id,
                quote_id: dummyQuote.id,
                order_number: orderNumber,
                status,
                amount,
            },
        });
        if (status === 'COMPLETED') {
            await prisma.insurancePolicy.create({
                data: {
                    order_id: dummyOrder.id,
                    policy_number: `POL-DUMMY-${String(i).padStart(4, '0')}`,
                    status: 'ACTIVE',
                    start_date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
                    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                    file_url: `/storage/seeded-policy-dummy-${i}.pdf`,
                },
            });
        }
        console.log(`📦 Dummy Order ${i}: ${orderNumber} | ${status} | ${productSlug} | User: ${user.first_name}`);
    }
    console.log('\n✅ Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map