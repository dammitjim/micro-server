import * as request from "supertest";
import app from "../app";

// TODO this test should now die
test("api root url should respond with 404", async () => {
    const response = await request(app.callback()).get("/api/v1/");
    expect(response.status).toEqual(404);
});
