const test = require("node:test");
const assert = require("node:assert");
const app = require("../server");

test("GET / should return backend API status", async () => {
    const server = app.listen(0);

    try {
        const port = server.address().port;
        const response = await fetch(`http://localhost:${port}/`);
        const body = await response.text();

        assert.strictEqual(response.status, 200);
        assert.strictEqual(body, "Backend API is running");
    } finally {
        server.close();
    }
});
