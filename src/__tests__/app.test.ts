import * as request from "supertest";
import app from "../app";

test("api root url should respond with 200", async () => {
    const response = await request(app.callback()).get("/api/v1/");
    expect(response.status).toEqual(200);
});
