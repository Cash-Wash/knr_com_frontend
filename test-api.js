#!/usr/bin/env node

/**
 * Script de test rapide des endpoints backend
 * Usage: node test-api.js
 */

const BASE_URL = "http://localhost:4000";

async function test() {
    try {
        console.log("🧪 Test API Backend KNR COM\n");

        // 1. GET /api/users
        console.log("1️⃣  GET /api/users");
        let res = await fetch(`${BASE_URL}/api/users`);
        let data = await res.json();
        console.log(`   ✅ ${data.length} utilisateurs trouvés\n`);

        // 2. GET /api/emissions
        console.log("2️⃣  GET /api/emissions");
        res = await fetch(`${BASE_URL}/api/emissions`);
        data = await res.json();
        console.log(`   ✅ ${data.length} émissions trouvées\n`);

        // 3. GET /api/reunions
        console.log("3️⃣  GET /api/reunions");
        res = await fetch(`${BASE_URL}/api/reunions`);
        data = await res.json();
        console.log(`   ✅ ${data.length} réunions trouvées\n`);

        // 4. POST /api/reunions
        console.log("4️⃣  POST /api/reunions");
        res = await fetch(`${BASE_URL}/api/reunions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                titre: "Test Réunion",
                heure: new Date().toISOString(),
                participants: ["u1", "u2"]
            })
        });
        data = await res.json();
        console.log(`   ✅ Réunion créée: ${data.titre}\n`);

        // 5. POST /api/start-live
        console.log("5️⃣  POST /api/start-live");
        res = await fetch(`${BASE_URL}/api/start-live`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emissionId: "e1" })
        });
        data = await res.json();
        console.log(`   ✅ Live démarré: ${data.emission.titre}\n`);

        console.log("✨ Tous les tests sont passés!");
    } catch (err) {
        console.error("❌ Erreur:", err.message);
        console.log("\n💡 Assurez-vous que le backend est lancé: cd server && npm run dev");
    }
}

test();
